from rest_framework import serializers
from .models import StudentProfile
from accounts.models import User



class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = [
            "student_name",
            "phone",
            "address",
            "qualification",
            "passout_year",
            "skills",
            "resume",
            "trainer",
            "status",
        ]
        read_only_fields = ["status"]

class TrainerListSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "name"]

    def get_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()
    
    
class TrainerStudentSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = StudentProfile
        fields = [
            "id",
            "name",
            "status",
        ]

    def get_name(self, obj):
        return (
            f"{obj.user.first_name} {obj.user.last_name}"
        ).strip()



class TrainerStudentDetailSerializer(serializers.ModelSerializer):
    resume = serializers.SerializerMethodField()

    class Meta:
        model = StudentProfile
        fields = [
            "id",
            "student_name",
            "phone",
            "address",
            "qualification",
            "passout_year",
            "skills",
            "resume",
            "status",
        ]

    def get_resume(self, obj):
        if obj.resume:
            return obj.resume.url
        return None

class TrainerActionSerializer(serializers.Serializer):
    student_profile_id = serializers.IntegerField()
    remark = serializers.CharField()

class StudentDashboardSerializer(serializers.Serializer):
    student_name = serializers.CharField()
    profile_status = serializers.CharField()
    trainer_name = serializers.CharField(
        allow_null=True
    )
    latest_remark = serializers.CharField(
        allow_null=True
    )