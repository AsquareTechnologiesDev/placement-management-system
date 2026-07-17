from django.urls import path

from .views import (
    PlacementListCreateAPIView,
    PlacementDetailAPIView,
)

urlpatterns = [
    path(
        "",
        PlacementListCreateAPIView.as_view(),
        name="placement-list-create",
    ),

    path(
        "<int:pk>/",
        PlacementDetailAPIView.as_view(),
        name="placement-detail",
    ),
]