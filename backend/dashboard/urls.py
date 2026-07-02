from django.urls import path

from .views import (
    PlacementDashboardAPIView,
)

urlpatterns = [

    path(
        "placement/",
        PlacementDashboardAPIView.as_view()
    ),
]