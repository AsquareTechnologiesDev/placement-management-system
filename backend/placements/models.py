from django.db import models
from students.models import StudentProfile
from companies.models import Company


class Placement(models.Model):

    student = models.ForeignKey(
        StudentProfile,
        on_delete=models.CASCADE,
        related_name="placements"
    )

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="placements"
    )

    student_photo = models.ImageField(
        upload_to="placement_students/",
        blank=True,
        null=True
    )

    job_role = models.CharField(
        max_length=200
    )

    package = models.CharField(
        max_length=100
    )

    placement_date = models.DateField()

    success_story = models.TextField(
        blank=True,
        null=True
    )

    featured = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["-placement_date"]

    def __str__(self):
        return f"{self.student.student_name} - {self.company.name}"