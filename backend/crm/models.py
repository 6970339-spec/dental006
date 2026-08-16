from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator
from django.db import models


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Clinic(TimeStampedModel):
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=300, blank=True)
    phone = models.CharField(max_length=30, blank=True)
    email = models.EmailField(blank=True)
    logo = models.ImageField(upload_to="clinic/", blank=True, null=True)

    def __str__(self):
        return self.name


class User(AbstractUser):
    class Role(models.TextChoices):
        SUPER_ADMIN = "super_admin", "Супер-администратор"
        DIRECTOR = "director", "Директор"
        DEPUTY_DIRECTOR = "deputy_director", "Заместитель директора"
        ADMINISTRATOR = "administrator", "Администратор"
        DOCTOR = "doctor", "Врач"
        ACCOUNTANT = "accountant", "Бухгалтер"

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.ADMINISTRATOR)
    clinic = models.ForeignKey(Clinic, on_delete=models.CASCADE, related_name="users", null=True, blank=True)
    phone = models.CharField(max_length=30, blank=True)
    specialization = models.CharField(max_length=120, blank=True)
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    access_rights = models.JSONField(default=list, blank=True)

    @property
    def display_name(self):
        return self.get_full_name() or self.username


class Patient(TimeStampedModel):
    class Gender(models.TextChoices):
        MALE = "male", "Мужской"
        FEMALE = "female", "Женский"
        OTHER = "other", "Другой"

    clinic = models.ForeignKey(Clinic, on_delete=models.CASCADE, related_name="patients")
    card_number = models.CharField(max_length=30)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=30, db_index=True)
    email = models.EmailField(blank=True)
    birth_date = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=10, choices=Gender.choices, blank=True)
    address = models.CharField(max_length=300, blank=True)
    notes = models.TextField(blank=True)
    medical_info = models.TextField(blank=True)
    allergies = models.TextField(blank=True)
    chronic_diseases = models.TextField(blank=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=["clinic", "card_number"], name="unique_patient_card")]
        ordering = ["last_name", "first_name"]

    @property
    def full_name(self):
        return " ".join(filter(None, [self.last_name, self.first_name, self.middle_name]))

    def __str__(self):
        return f"{self.card_number} · {self.full_name}"


class Appointment(TimeStampedModel):
    class Status(models.TextChoices):
        SCHEDULED = "scheduled", "Запланирован"
        CONFIRMED = "confirmed", "Подтвержден"
        IN_PROGRESS = "in_progress", "Идет прием"
        COMPLETED = "completed", "Завершен"
        CANCELLED = "cancelled", "Отменен"
        NO_SHOW = "no_show", "Не явился"

    clinic = models.ForeignKey(Clinic, on_delete=models.CASCADE, related_name="appointments")
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="appointments")
    doctor = models.ForeignKey(User, on_delete=models.PROTECT, related_name="appointments")
    starts_at = models.DateTimeField(db_index=True)
    ends_at = models.DateTimeField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SCHEDULED)
    reason = models.CharField(max_length=240, blank=True)
    room = models.CharField(max_length=40, blank=True)
    comment = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="created_appointments")

    class Meta:
        ordering = ["starts_at"]


class TreatmentRecord(TimeStampedModel):
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE, related_name="treatment")
    diagnosis = models.TextField(blank=True)
    procedures = models.TextField(blank=True)
    tooth_map = models.JSONField(default=dict, blank=True)
    comment = models.TextField(blank=True)
    cost = models.DecimalField(max_digits=12, decimal_places=2, default=0, validators=[MinValueValidator(0)])


class Invoice(TimeStampedModel):
    class Status(models.TextChoices):
        UNPAID = "unpaid", "Не оплачен"
        PARTIAL = "partial", "Частично оплачен"
        PAID = "paid", "Оплачен"
        CANCELLED = "cancelled", "Отменен"

    clinic = models.ForeignKey(Clinic, on_delete=models.CASCADE, related_name="invoices")
    patient = models.ForeignKey(Patient, on_delete=models.PROTECT, related_name="invoices")
    appointment = models.ForeignKey(Appointment, on_delete=models.SET_NULL, null=True, blank=True, related_name="invoices")
    number = models.CharField(max_length=30)
    amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.UNPAID)
    due_date = models.DateField(null=True, blank=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=["clinic", "number"], name="unique_invoice_number")]
        ordering = ["-created_at"]

    @property
    def paid_amount(self):
        return sum(payment.amount for payment in self.payments.all())

    @property
    def balance(self):
        return self.amount - self.paid_amount


class Payment(TimeStampedModel):
    class Method(models.TextChoices):
        CARD = "card", "Карта"
        CASH = "cash", "Наличные"
        TRANSFER = "transfer", "Перевод"

    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="payments")
    amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0.01)])
    method = models.CharField(max_length=12, choices=Method.choices)
    paid_at = models.DateTimeField()
    accepted_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name="accepted_payments")
    comment = models.CharField(max_length=240, blank=True)


class Attachment(TimeStampedModel):
    class Kind(models.TextChoices):
        DOCUMENT = "document", "Документ"
        PHOTO = "photo", "Фотография"

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="attachments")
    treatment = models.ForeignKey(TreatmentRecord, on_delete=models.SET_NULL, null=True, blank=True, related_name="attachments")
    kind = models.CharField(max_length=10, choices=Kind.choices)
    file = models.FileField(upload_to="patients/%Y/%m/")
    name = models.CharField(max_length=220)
    uploaded_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name="uploaded_files")


class Notification(TimeStampedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    title = models.CharField(max_length=180)
    message = models.TextField(blank=True)
    read = models.BooleanField(default=False)
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, null=True, blank=True)


class AuditLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    method = models.CharField(max_length=10)
    path = models.CharField(max_length=500)
    status_code = models.PositiveSmallIntegerField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
