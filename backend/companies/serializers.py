from rest_framework import serializers
from .models import Company, PlacementDrive, Job, JobApplication


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = "__all__"


class PlacementDriveSerializer(serializers.ModelSerializer):

    company_name = serializers.CharField(
        source="company.name",
        read_only=True
    )

    class Meta:
        model = PlacementDrive

        fields = [
            "id",

            "company",
            "company_name",

            "title",
            "description",
            "eligibility",

            "notice_image",

            "package",
            "available_positions",
            "openings",

            "drive_datetime",
            "registration_deadline",
            "registration_link",

            "mode",
            "venue",
            "city",
            "state",

            "coordinator_name",
            "coordinator_email",
            "coordinator_phone",

            "status",

            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "company_name",
            "created_at",
            "updated_at",
        ]


class JobSerializer(serializers.ModelSerializer):

    company_name = serializers.CharField(
        source="company.name",
        read_only=True
    )

    class Meta:
        model = Job
        fields = "__all__"


# ============================================================
# STUDENT JOB LIST / DETAIL SERIALIZER
# ============================================================

class StudentJobSerializer(serializers.ModelSerializer):

    company_name = serializers.CharField(
        source="company.name",
        read_only=True
    )

    is_applied = serializers.SerializerMethodField()

    profile_approved = serializers.SerializerMethodField()

    class Meta:
        model = Job

        fields = [
            "id",
            "company_name",
            "title",
            "description",
            "eligibility",
            "package",
            "location",
            "vacancies",
            "deadline",
            "status",
            "is_applied",
            "profile_approved",
        ]

    def get_is_applied(self, obj):
        student = self.context.get("student_profile")

        if not student:
            return False

        return JobApplication.objects.filter(
            job=obj,
            student=student
        ).exists()

    def get_profile_approved(self, obj):
        student = self.context.get("student_profile")

        if not student:
            return False

        return student.status == "APPROVED"


class JobApplicationSerializer(serializers.ModelSerializer):

    student_name = serializers.CharField(
        source="student.user.get_full_name",
        read_only=True
    )

    student_email = serializers.CharField(
        source="student.user.email",
        read_only=True
    )

    job_title = serializers.CharField(
        source="job.title",
        read_only=True
    )

    company_name = serializers.CharField(
        source="job.company.name",
        read_only=True
    )

    resume = serializers.FileField(
        source="student.resume",
        read_only=True
    )

    qualification = serializers.CharField(
        source="student.qualification",
        read_only=True
    )

    skills = serializers.CharField(
        source="student.skills",
        read_only=True
    )

    class Meta:
        model = JobApplication
        fields = "__all__"

class StudentMyApplicationSerializer(
    serializers.ModelSerializer
):

    company_name = serializers.CharField(
        source="job.company.name",
        read_only=True
    )

    job_title = serializers.CharField(
        source="job.title",
        read_only=True
    )

    package = serializers.CharField(
        source="job.package",
        read_only=True
    )

    location = serializers.CharField(
        source="job.location",
        read_only=True
    )

    deadline = serializers.DateField(
        source="job.deadline",
        read_only=True
    )

    class Meta:
        model = JobApplication

        fields = [
            "id",

            "job",

            "job_title",

            "company_name",

            "package",

            "location",

            "deadline",

            "status",

            "applied_at",
        ]