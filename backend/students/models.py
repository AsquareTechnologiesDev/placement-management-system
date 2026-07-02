from django.db import models
from django.conf import settings


class StudentProfile(models.Model):
    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        PENDING = "PENDING", "Pending"
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="student_profile"
    )

    student_name = models.CharField(
        max_length=255,
        blank=True
    )

    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    qualification = models.CharField(max_length=255, blank=True)
    passout_year = models.PositiveIntegerField(null=True, blank=True)
    skills = models.TextField(blank=True)

    # Should point to a User with role=TRAINER
    # Validation will be added later.
    trainer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_students"
    )

    resume = models.FileField(
        upload_to="resumes/",
        null=True,
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.email




class TrainerRemark(models.Model):
    class Action(models.TextChoices):
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"

    student_profile = models.ForeignKey(
        StudentProfile,
        on_delete=models.CASCADE,
        related_name="trainer_remarks"
    )

    trainer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="trainer_remarks"
    )

    remark = models.TextField()

    action = models.CharField(
        max_length=20,
        choices=Action.choices
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return (
            f"{self.student_profile.user.email} - "
            f"{self.action} by {self.trainer.email}"
        )