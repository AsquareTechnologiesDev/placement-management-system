from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Placement
from .serializers import PlacementSerializer


class PlacementListCreateAPIView(generics.ListCreateAPIView):
    """
    GET  -> List all placements
    POST -> Create a placement
    """

    queryset = Placement.objects.all().order_by("-placement_date")
    serializer_class = PlacementSerializer
    permission_classes = [IsAuthenticated]


class PlacementDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    -> Retrieve placement
    PUT    -> Update placement
    PATCH  -> Partial update
    DELETE -> Delete placement
    """

    queryset = Placement.objects.all()
    serializer_class = PlacementSerializer
    permission_classes = [IsAuthenticated]