from rest_framework import serializers
from .models import Placement


class PlacementSerializer(serializers.ModelSerializer):

    student_name = serializers.CharField(
        source="student.student_name",
        read_only=True
    )

    company_name = serializers.CharField(
        source="company.name",
        read_only=True
    )

    class Meta:
        model = Placement

        fields = [
            "id",
            "student",
            "student_name",
            "student_photo",
            "company",
            "company_name",
            "job_role",
            "package",
            "placement_date",
            "success_story",
            "featured",
            "created_at",
        ]