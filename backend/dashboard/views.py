from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from students.models import StudentProfile,TrainerRemark
from companies.models import Company, PlacementDrive, Job, JobApplication

# Create your views here.

class PlacementDashboardAPIView(APIView):

    def get(self, request):

        data = {
            "companies": Company.objects.count(),

            "approved_students": StudentProfile.objects.filter(
                status="APPROVED"
            ).count(),

            "jobs": Job.objects.count(),

            "drives": PlacementDrive.objects.count(),

            "applications": JobApplication.objects.count(),

            "placements":0, 
            # StudentProfile.objects.filter(
            #     placement_status=True
            # ).count(),
        }

        return Response(data)