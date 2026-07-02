from django.db import models
from students.models import StudentProfile

# Create your models here.


class Company(models.Model):
    name = models.CharField(max_length=255)

    website = models.URLField(
        blank=True,
        null=True
    )

    location = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    description = models.TextField(
        blank=True,
        null=True
    )

    contact_person = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    email = models.EmailField(
        blank=True,
        null=True
    )

    phone = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.name
    
from django.db import models


class PlacementDrive(models.Model):

    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        PUBLISHED = "PUBLISHED", "Published"
        CLOSED = "CLOSED", "Closed"

    class Mode(models.TextChoices):
        OFFLINE = "OFFLINE", "Offline"
        ONLINE = "ONLINE", "Online"
        HYBRID = "HYBRID", "Hybrid"

    company = models.ForeignKey(
        "Company",
        on_delete=models.CASCADE,
        related_name="drives"
    )

    # Basic Details
    title = models.CharField(max_length=255)

    description = models.TextField()

    eligibility = models.TextField(
        blank=True,
        null=True
    )

    notice_image = models.ImageField(
        upload_to="drive_notices/",
        blank=True,
        null=True
    )

    # Job Information
    package = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    available_positions = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Example: Python Developer, QA Engineer"
    )

    openings = models.PositiveIntegerField(
        default=1
    )

    # Drive Schedule
    drive_datetime = models.DateTimeField(null=True,
    blank=True)

    registration_deadline = models.DateTimeField(null=True,
    blank=True)

    registration_link = models.URLField(
        blank=True,
        null=True
    )

    # Venue
    mode = models.CharField(
        max_length=20,
        choices=Mode.choices,
        default=Mode.OFFLINE
    )

    venue = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    city = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    state = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    # Contact Person
    coordinator_name = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    coordinator_email = models.EmailField(
        blank=True,
        null=True
    )

    coordinator_phone = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )

    # Status
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        null=True,
        blank=True
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.company.name} - {self.title}"  
      
class Job(models.Model):

    class Status(models.TextChoices):
        OPEN = "OPEN", "Open"
        CLOSED = "CLOSED", "Closed"

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="jobs"
    )

    title = models.CharField(max_length=255)

    description = models.TextField()

    eligibility = models.TextField(
        blank=True,
        null=True
    )

    package = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    location = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    vacancies = models.PositiveIntegerField(
        default=1
    )

    deadline = models.DateField()

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.OPEN
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.title

class JobApplication(models.Model):

    class Status(models.TextChoices):
        APPLIED = "APPLIED", "Applied"
        SHORTLISTED = "SHORTLISTED", "Shortlisted"
        REJECTED = "REJECTED", "Rejected"
        HIRED = "HIRED", "Hired"

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name="applications"
    )

    student = models.ForeignKey(
        StudentProfile,
        on_delete=models.CASCADE,
        related_name="job_applications"
    )

    applied_at = models.DateTimeField(
        auto_now_add=True
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.APPLIED
    )

    class Meta:
        unique_together = ("job", "student")