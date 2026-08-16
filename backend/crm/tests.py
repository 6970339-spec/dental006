from datetime import timedelta
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from .models import Appointment, Clinic, Patient, User


class RoleAccessTests(TestCase):
    def setUp(self):
        self.clinic = Clinic.objects.create(name="Тестовая клиника")
        self.director = User.objects.create_user("director", password="pass12345", clinic=self.clinic, role="director")
        self.doctor = User.objects.create_user("doctor", password="pass12345", clinic=self.clinic, role="doctor")
        self.patient = Patient.objects.create(clinic=self.clinic, card_number="P-00001", first_name="Иван", last_name="Иванов", phone="+70000000000")
        self.client = APIClient()

    def test_director_can_create_patient(self):
        self.client.force_authenticate(self.director)
        response = self.client.post("/api/patients/", {"first_name": "Анна", "last_name": "Петрова", "phone": "+71111111111"})
        self.assertEqual(response.status_code, 201)

    def test_doctor_cannot_create_appointment(self):
        self.client.force_authenticate(self.doctor)
        now = timezone.now()
        response = self.client.post("/api/appointments/", {"patient": self.patient.pk, "doctor": self.doctor.pk, "starts_at": now.isoformat(), "ends_at": (now + timedelta(hours=1)).isoformat()})
        self.assertEqual(response.status_code, 403)

    def test_doctor_sees_only_own_schedule(self):
        other = User.objects.create_user("other", password="pass12345", clinic=self.clinic, role="doctor")
        now = timezone.now()
        Appointment.objects.create(clinic=self.clinic, patient=self.patient, doctor=self.doctor, starts_at=now, ends_at=now + timedelta(hours=1), created_by=self.director)
        Appointment.objects.create(clinic=self.clinic, patient=self.patient, doctor=other, starts_at=now + timedelta(hours=2), ends_at=now + timedelta(hours=3), created_by=self.director)
        self.client.force_authenticate(self.doctor)
        response = self.client.get("/api/appointments/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 1)

