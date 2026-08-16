from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import AppointmentViewSet, AttachmentViewSet, ClinicViewSet, InvoiceViewSet, NotificationViewSet, PatientViewSet, TreatmentViewSet, UserViewSet, change_password, dashboard, me, password_reset_confirm, password_reset_request, reports

router = DefaultRouter()
router.register("users", UserViewSet, basename="users")
router.register("clinics", ClinicViewSet, basename="clinics")
router.register("patients", PatientViewSet, basename="patients")
router.register("appointments", AppointmentViewSet, basename="appointments")
router.register("treatments", TreatmentViewSet, basename="treatments")
router.register("invoices", InvoiceViewSet, basename="invoices")
router.register("attachments", AttachmentViewSet, basename="attachments")
router.register("notifications", NotificationViewSet, basename="notifications")

urlpatterns = [
    path("me/", me),
    path("auth/password/change/", change_password),
    path("auth/password/reset/", password_reset_request),
    path("auth/password/reset/confirm/", password_reset_confirm),
    path("dashboard/", dashboard),
    path("reports/", reports),
    path("", include(router.urls)),
]
