from django.contrib import admin
from .models import StudentProfile,TrainerRemark

@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "phone",
        "qualification",
        "trainer",
        "status",
    )

    list_filter = (
        "status",
        "trainer",
    )

    search_fields = (
        "user__email",
        "user__first_name",
        "user__last_name",
        "phone",
        "qualification",
    )

@admin.register(TrainerRemark)
class TrainerRemarkAdmin(admin.ModelAdmin):
    list_display = (
        "student_profile",
        "trainer",
        "action",
        "created_at",
    )

    list_filter = (
        "action",
        "created_at",
    )

    search_fields = (
        "student_profile__user__email",
        "trainer__email",
        "remark",
    )