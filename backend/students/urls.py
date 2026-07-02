from django.urls import path
from .views import (
    StudentProfileAPIView,
    TrainerListAPIView,
    TrainerStudentsAPIView,
    TrainerStudentDetailAPIView,
    TrainerApproveAPIView,
    TrainerRejectAPIView,
    StudentDashboardAPIView,
    ApprovedStudentsAPIView,
    PlacementStudentDetailAPIView
    
)

urlpatterns = [
    path(
        "profile/",
        StudentProfileAPIView.as_view(),
        name="student-profile",
    ),

    path(
        "trainers/",
        TrainerListAPIView.as_view(),
        name="trainer-list",
    ),
    path(
        "trainer/students/",
        TrainerStudentsAPIView.as_view(),
        name="trainer-students",
    ),
    path(
        "trainer/students/<int:id>/",
        TrainerStudentDetailAPIView.as_view(),
    ),
    path(
    "trainer/approve/",
    TrainerApproveAPIView.as_view(),
    ),

    path(
        "trainer/reject/",
        TrainerRejectAPIView.as_view(),
    ),
    path(
        "dashboard/student/",
        StudentDashboardAPIView.as_view(),
    ),
    path(
        "approved/",
        ApprovedStudentsAPIView.as_view()
    ),
    path(
        "placement/student/<int:pk>/",
        PlacementStudentDetailAPIView.as_view()
    ),path(
        "placement/<int:pk>/",
        PlacementStudentDetailAPIView.as_view(),
    ),
]