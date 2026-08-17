from datetime import timedelta
from decimal import Decimal
from django.contrib.auth import get_user_model
from django.contrib.auth import password_validation
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.db.models import Count, DecimalField, ExpressionWrapper, F, Q, Sum, Value
from django.db.models.functions import Coalesce
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import Appointment, Attachment, Clinic, Invoice, Notification, Patient, Payment, TreatmentRecord
from .permissions import RolePermission
from .serializers import AppointmentSerializer, AttachmentSerializer, ClinicSerializer, InvoiceSerializer, NotificationSerializer, PatientSerializer, PaymentSerializer, TreatmentRecordSerializer, UserSerializer

User = get_user_model()


class ClinicScopedMixin:
    permission_classes = [RolePermission]

    def clinic(self):
        return self.request.user.clinic


class UserViewSet(ClinicScopedMixin, viewsets.ModelViewSet):
    serializer_class = UserSerializer
    resource_name = "users"

    def get_queryset(self):
        return User.objects.filter(clinic=self.clinic()).order_by("first_name")

    def perform_create(self, serializer):
        serializer.save(clinic=self.clinic())


class ClinicViewSet(ClinicScopedMixin, viewsets.ModelViewSet):
    serializer_class = ClinicSerializer
    resource_name = "clinic"

    def get_queryset(self):
        return Clinic.objects.filter(pk=self.clinic().pk)


class PatientViewSet(ClinicScopedMixin, viewsets.ModelViewSet):
    serializer_class = PatientSerializer
    resource_name = "patients"
    search_fields = ("first_name", "last_name", "middle_name", "phone", "card_number")
    ordering_fields = ("last_name", "created_at")

    def get_queryset(self):
        paid = Coalesce(Sum("invoices__payments__amount"), Value(Decimal("0")), output_field=DecimalField())
        billed = Coalesce(Sum("invoices__amount", distinct=True), Value(Decimal("0")), output_field=DecimalField())
        return Patient.objects.filter(clinic=self.clinic()).annotate(visits_count=Count("appointments", distinct=True), debt=ExpressionWrapper(billed - paid, output_field=DecimalField()))

    def perform_create(self, serializer):
        last = Patient.objects.filter(clinic=self.clinic()).count() + 1
        serializer.save(clinic=self.clinic(), card_number=f"P-{last:05d}")

    def perform_destroy(self, instance):
        Invoice.objects.filter(patient=instance).delete()
        instance.delete()

    @action(detail=False, methods=["delete"], url_path="bulk-delete")
    def bulk_delete(self, request):
        patient_ids = request.data.get("ids", [])
        if not isinstance(patient_ids, list) or not patient_ids:
            return Response({"ids": ["Передайте непустой список пациентов."]}, status=status.HTTP_400_BAD_REQUEST)
        queryset = self.get_queryset().filter(pk__in=patient_ids)
        resolved_ids = list(queryset.values_list("pk", flat=True))
        Invoice.objects.filter(patient_id__in=resolved_ids).delete()
        deleted = queryset.count()
        queryset.delete()
        return Response({"deleted": deleted})


class AppointmentViewSet(ClinicScopedMixin, viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    resource_name = "appointments"
    filterset_fields = ("doctor", "status", "patient")
    search_fields = ("patient__first_name", "patient__last_name", "patient__phone")

    def get_queryset(self):
        queryset = Appointment.objects.filter(clinic=self.clinic()).select_related("patient", "doctor")
        if self.request.user.role == User.Role.DOCTOR:
            queryset = queryset.filter(doctor=self.request.user)
        date_from = self.request.query_params.get("date_from")
        date_to = self.request.query_params.get("date_to")
        if date_from:
            queryset = queryset.filter(starts_at__date__gte=date_from)
        if date_to:
            queryset = queryset.filter(starts_at__date__lte=date_to)
        return queryset

    def perform_create(self, serializer):
        appointment = serializer.save(clinic=self.clinic(), created_by=self.request.user)
        Notification.objects.create(user=appointment.doctor, title="Новая запись", message=f"{appointment.patient.full_name} записан на прием", appointment=appointment)

    @action(detail=False, methods=["get"])
    def free_slots(self, request):
        doctor_id = request.query_params.get("doctor")
        date = request.query_params.get("date")
        if not doctor_id or not date:
            return Response({"detail": "Укажите doctor и date."}, status=400)
        booked = self.get_queryset().filter(doctor_id=doctor_id, starts_at__date=date).exclude(status=Appointment.Status.CANCELLED)
        busy_hours = set(booked.values_list("starts_at__hour", flat=True))
        slots = [f"{hour:02d}:00" for hour in range(9, 19) if hour not in busy_hours]
        return Response({"date": date, "slots": slots})


class TreatmentViewSet(ClinicScopedMixin, viewsets.ModelViewSet):
    serializer_class = TreatmentRecordSerializer
    resource_name = "treatments"

    def get_queryset(self):
        queryset = TreatmentRecord.objects.filter(appointment__clinic=self.clinic()).select_related("appointment__patient", "appointment__doctor")
        if self.request.user.role == User.Role.DOCTOR:
            queryset = queryset.filter(appointment__doctor=self.request.user)
        return queryset


class InvoiceViewSet(ClinicScopedMixin, viewsets.ModelViewSet):
    serializer_class = InvoiceSerializer
    resource_name = "finances"
    filterset_fields = ("status", "patient")

    def get_queryset(self):
        return Invoice.objects.filter(clinic=self.clinic()).select_related("patient").prefetch_related("payments")

    def perform_create(self, serializer):
        number = f"INV-{timezone.now():%Y%m}-{Invoice.objects.filter(clinic=self.clinic()).count() + 1:04d}"
        serializer.save(clinic=self.clinic(), number=number)

    @action(detail=True, methods=["post"])
    def pay(self, request, pk=None):
        invoice = self.get_object()
        serializer = PaymentSerializer(data={**request.data, "invoice": invoice.pk})
        serializer.is_valid(raise_exception=True)
        serializer.save(accepted_by=request.user)
        invoice.refresh_from_db()
        invoice.status = Invoice.Status.PAID if invoice.balance <= 0 else Invoice.Status.PARTIAL
        invoice.save(update_fields=["status"])
        return Response(InvoiceSerializer(invoice, context={"request": request}).data, status=status.HTTP_201_CREATED)


class AttachmentViewSet(ClinicScopedMixin, viewsets.ModelViewSet):
    serializer_class = AttachmentSerializer
    resource_name = "attachments"
    filterset_fields = ("patient", "kind")

    def get_queryset(self):
        return Attachment.objects.filter(patient__clinic=self.clinic())

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)


class NotificationViewSet(ClinicScopedMixin, viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer
    resource_name = "notifications"

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=True, methods=["post"])
    def read(self, request, pk=None):
        notification = self.get_object()
        notification.read = True
        notification.save(update_fields=["read"])
        return Response(self.get_serializer(notification).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    return Response(UserSerializer(request.user, context={"request": request}).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    if not user.check_password(request.data.get("old_password", "")):
        return Response({"old_password": ["Текущий пароль указан неверно."]}, status=400)
    new_password = request.data.get("new_password", "")
    try:
        password_validation.validate_password(new_password, user=user)
    except Exception as exc:
        return Response({"new_password": list(exc.messages)}, status=400)
    user.set_password(new_password)
    user.save(update_fields=["password"])
    return Response({"detail": "Пароль изменен."})


@api_view(["POST"])
@permission_classes([AllowAny])
def password_reset_request(request):
    email = request.data.get("email", "").strip()
    user = User.objects.filter(email__iexact=email, is_active=True).first()
    if user:
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        reset_url = f"{request.scheme}://{request.get_host()}/reset-password?uid={uid}&token={token}"
        send_mail("Восстановление пароля Dental CRM", f"Для смены пароля откройте: {reset_url}", None, [user.email])
    # The same response prevents account enumeration.
    return Response({"detail": "Если аккаунт существует, инструкция отправлена на email."})


@api_view(["POST"])
@permission_classes([AllowAny])
def password_reset_confirm(request):
    try:
        user_id = force_str(urlsafe_base64_decode(request.data.get("uid", "")))
        user = User.objects.get(pk=user_id, is_active=True)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response({"detail": "Ссылка недействительна."}, status=400)
    if not default_token_generator.check_token(user, request.data.get("token", "")):
        return Response({"detail": "Ссылка устарела или недействительна."}, status=400)
    new_password = request.data.get("new_password", "")
    try:
        password_validation.validate_password(new_password, user=user)
    except Exception as exc:
        return Response({"new_password": list(exc.messages)}, status=400)
    user.set_password(new_password)
    user.save(update_fields=["password"])
    return Response({"detail": "Новый пароль сохранен."})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard(request):
    clinic = request.user.clinic
    today = timezone.localdate()
    month_start = today.replace(day=1)
    appointments = Appointment.objects.filter(clinic=clinic)
    if request.user.role == User.Role.DOCTOR:
        appointments = appointments.filter(doctor=request.user)
    today_qs = appointments.filter(starts_at__date=today)
    income_today = Payment.objects.filter(invoice__clinic=clinic, paid_at__date=today).aggregate(total=Coalesce(Sum("amount"), Decimal("0")))["total"]
    income_month = Payment.objects.filter(invoice__clinic=clinic, paid_at__date__gte=month_start).aggregate(total=Coalesce(Sum("amount"), Decimal("0")))["total"]
    open_invoices = Invoice.objects.filter(clinic=clinic).exclude(status__in=[Invoice.Status.PAID, Invoice.Status.CANCELLED])
    billed_open = open_invoices.aggregate(total=Coalesce(Sum("amount"), Decimal("0")))["total"]
    paid_open = Payment.objects.filter(invoice__in=open_invoices).aggregate(total=Coalesce(Sum("amount"), Decimal("0")))["total"]
    debt = billed_open - paid_open
    return Response({
        "appointments_today": today_qs.count(),
        "completed_today": today_qs.filter(status=Appointment.Status.COMPLETED).count(),
        "new_patients_month": Patient.objects.filter(clinic=clinic, created_at__date__gte=month_start).count(),
        "patients_total": Patient.objects.filter(clinic=clinic).count(),
        "income_today": income_today,
        "income_month": income_month,
        "unpaid_total": debt,
        "schedule": AppointmentSerializer(today_qs[:8], many=True).data,
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def reports(request):
    clinic = request.user.clinic
    today = timezone.localdate()
    month_start = today.replace(day=1)
    by_doctor = Appointment.objects.filter(clinic=clinic, starts_at__date__gte=month_start).values(name=F("doctor__first_name")).annotate(appointments=Count("id"), income=Coalesce(Sum("treatment__cost"), Decimal("0"))).order_by("-income")
    return Response({
        "patients": Patient.objects.filter(clinic=clinic).count(),
        "visits_month": Appointment.objects.filter(clinic=clinic, starts_at__date__gte=month_start).count(),
        "new_patients_month": Patient.objects.filter(clinic=clinic, created_at__date__gte=month_start).count(),
        "by_doctor": list(by_doctor),
    })
