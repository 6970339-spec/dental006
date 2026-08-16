from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Appointment, Attachment, AuditLog, Clinic, Invoice, Notification, Patient, Payment, TreatmentRecord, User

admin.site.register(User, UserAdmin)
admin.site.register([Clinic, Patient, Appointment, TreatmentRecord, Invoice, Payment, Attachment, Notification, AuditLog])

