from datetime import date, time, timedelta
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.utils import timezone
from crm.models import Appointment, Clinic, Invoice, Patient, Payment, TreatmentRecord, User


class Command(BaseCommand):
    help = "Creates an idempotent demo clinic and data"

    def handle(self, *args, **options):
        clinic, _ = Clinic.objects.get_or_create(name="Дента Плюс", defaults={"address": "Москва, ул. Спокойная, 12", "phone": "+7 495 120-45-45", "email": "hello@dentaplus.ru"})
        director, created = User.objects.get_or_create(username="director", defaults={"first_name": "Ислам", "last_name": "Парчиев", "email": "director@dentaplus.ru", "role": "director", "clinic": clinic})
        if created:
            director.set_password("demo1234")
        director.first_name = "Ислам"
        director.last_name = "Парчиев"
        director.email = "director@dentaplus.ru"
        director.role = "director"
        director.clinic = clinic
        director.access_rights = ["patients", "calendar", "treatment", "finance", "documents", "reports", "staff", "settings"]
        director.save()
        doctor, created = User.objects.get_or_create(username="doctor", defaults={"first_name": "Михаил", "last_name": "Орлов", "role": "doctor", "specialization": "Стоматолог-терапевт", "clinic": clinic})
        if created:
            doctor.set_password("demo1234")
            doctor.save()
        admin, created = User.objects.get_or_create(username="admin", defaults={"first_name": "Елена", "last_name": "Волкова", "role": "administrator", "clinic": clinic})
        if created:
            admin.set_password("demo1234")
            admin.save()

        patients_data = [
            ("P-00001", "Мария", "Кузнецова", "+7 916 555-14-20", "1991-04-17"),
            ("P-00002", "Алексей", "Смирнов", "+7 903 122-87-41", "1985-11-02"),
            ("P-00003", "София", "Лебедева", "+7 925 448-10-33", "2000-07-29"),
            ("P-00004", "Дмитрий", "Попов", "+7 910 372-45-65", "1978-01-13"),
        ]
        patients = []
        for card, first, last, phone, birth in patients_data:
            patient, _ = Patient.objects.get_or_create(clinic=clinic, card_number=card, defaults={"first_name": first, "last_name": last, "phone": phone, "birth_date": birth})
            patients.append(patient)

        today = timezone.localdate()
        slots = [(9, 0, "Профилактический осмотр", "confirmed"), (10, 30, "Лечение кариеса", "in_progress"), (12, 0, "Консультация", "scheduled"), (14, 30, "Профессиональная гигиена", "confirmed")]
        for patient, (hour, minute, reason, status) in zip(patients, slots):
            starts = timezone.make_aware(timezone.datetime.combine(today, time(hour, minute)))
            appointment, _ = Appointment.objects.get_or_create(clinic=clinic, patient=patient, doctor=doctor, starts_at=starts, defaults={"ends_at": starts + timedelta(hours=1), "reason": reason, "status": status, "room": "Кабинет 2", "created_by": admin})
            if status == "in_progress":
                TreatmentRecord.objects.get_or_create(appointment=appointment, defaults={"diagnosis": "Кариес дентина", "procedures": "Лечение кариеса, реставрация", "cost": Decimal("6800")})

        invoice, _ = Invoice.objects.get_or_create(clinic=clinic, number="INV-DEMO-001", defaults={"patient": patients[0], "amount": Decimal("12400"), "status": "partial", "due_date": today + timedelta(days=7)})
        Payment.objects.get_or_create(invoice=invoice, amount=Decimal("5000"), defaults={"method": "card", "paid_at": timezone.now(), "accepted_by": admin})
        self.stdout.write(self.style.SUCCESS("Demo ready: director / demo1234"))
