from django.urls import path

from .views import (
    CompanyListCreateAPIView,
    CompanyDetailAPIView,

    PlacementDriveListCreateAPIView,
    PlacementDriveDetailAPIView,

    JobListCreateAPIView,
    JobDetailAPIView,

    JobApplicationCreateAPIView,
    PlacementJobApplicationsAPIView,

    StudentPlacementDriveListAPIView,

    StudentJobListAPIView,
    StudentJobDetailAPIView,
    ApplyJobAPIView,
    StudentMyApplicationsAPIView,
    PlacementApplicationsAPIView,
)

urlpatterns = [

    # ==========================================
    # Company APIs
    # ==========================================

    path(
        "",
        CompanyListCreateAPIView.as_view(),
    ),

    path(
        "<int:id>/",
        CompanyDetailAPIView.as_view(),
    ),

    # ==========================================
    # Placement Drive APIs
    # ==========================================

    path(
        "drives/",
        PlacementDriveListCreateAPIView.as_view(),
    ),

    path(
        "drives/<int:pk>/",
        PlacementDriveDetailAPIView.as_view(),
    ),

    # ==========================================
    # Placement Job APIs (Placement Officer)
    # ==========================================

    path(
        "jobs/",
        JobListCreateAPIView.as_view(),
    ),

    path(
        "jobs/<int:pk>/",
        JobDetailAPIView.as_view(),
    ),

    path(
        "jobs/<int:pk>/apply/",
        JobApplicationCreateAPIView.as_view(),
    ),

    path(
        "jobs/<int:pk>/applications/",
        PlacementJobApplicationsAPIView.as_view(),
    ),

    # ==========================================
    # Student APIs
    # ==========================================

    path(
        "student/drives/",
        StudentPlacementDriveListAPIView.as_view(),
    ),

    path(
        "student/jobs/",
        StudentJobListAPIView.as_view(),
    ),

    path(
        "student/jobs/<int:pk>/",
        StudentJobDetailAPIView.as_view(),
    ),

    path(
        "student/jobs/<int:pk>/apply/",
        ApplyJobAPIView.as_view(),
    ),
    path(
        "student/my-applications/",
        StudentMyApplicationsAPIView.as_view(),
    ),
    path(
        "applications/",
        PlacementApplicationsAPIView.as_view(),
    ),
]