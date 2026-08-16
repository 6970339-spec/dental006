from django.utils import timezone
from celery import shared_task
from .models import Appointment, Notification


@shared_task
def send_appointment_reminders():
    now = timezone.now()
    upcoming = Appointment.objects.filter(starts_at__range=(now, now + timezone.timedelta(hours=24)), status__in=["scheduled", "confirmed"])
    created = 0
    for appointment in upcoming:
        _, was_created = Notification.objects.get_or_create(
            user=appointment.doctor,
            appointment=appointment,
            title="Напоминание о приеме",
            defaults={"message": f"Завтра: {appointment.patient.full_name}"},
        )
        created += int(was_created)
    return created
