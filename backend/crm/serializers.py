from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Appointment, Attachment, Clinic, Invoice, Notification, Patient, Payment, TreatmentRecord

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    display_name = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = ("id", "username", "first_name", "last_name", "display_name", "email", "phone", "role", "specialization", "avatar", "access_rights", "is_active")


class ClinicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clinic
        fields = "__all__"


class PatientSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    visits_count = serializers.IntegerField(read_only=True)
    debt = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = Patient
        exclude = ("clinic",)
        read_only_fields = ("card_number",)


class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source="patient.full_name", read_only=True)
    patient_phone = serializers.CharField(source="patient.phone", read_only=True)
    doctor_name = serializers.CharField(source="doctor.display_name", read_only=True)

    class Meta:
        model = Appointment
        exclude = ("clinic", "created_by")

    def validate(self, attrs):
        if attrs.get("ends_at") and attrs.get("starts_at") and attrs["ends_at"] <= attrs["starts_at"]:
            raise serializers.ValidationError("Время окончания должно быть позже времени начала.")
        return attrs


class TreatmentRecordSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source="appointment.patient.full_name", read_only=True)
    doctor_name = serializers.CharField(source="appointment.doctor.display_name", read_only=True)

    class Meta:
        model = TreatmentRecord
        fields = "__all__"


class PaymentSerializer(serializers.ModelSerializer):
    accepted_by_name = serializers.CharField(source="accepted_by.display_name", read_only=True)

    class Meta:
        model = Payment
        fields = "__all__"
        read_only_fields = ("accepted_by",)


class InvoiceSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source="patient.full_name", read_only=True)
    paid_amount = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    balance = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    payments = PaymentSerializer(many=True, read_only=True)

    class Meta:
        model = Invoice
        exclude = ("clinic",)
        read_only_fields = ("number", "status")


class AttachmentSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source="uploaded_by.display_name", read_only=True)

    class Meta:
        model = Attachment
        fields = "__all__"
        read_only_fields = ("uploaded_by",)


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = "__all__"
        read_only_fields = ("user",)
