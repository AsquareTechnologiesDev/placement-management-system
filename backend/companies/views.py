from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from students.models import StudentProfile
from django.utils import timezone
from datetime import date
from django.shortcuts import get_object_or_404
from rest_framework.generics import ListAPIView
from .models import Company,PlacementDrive,Job, JobApplication
from .serializers import (
    CompanySerializer, 
    PlacementDriveSerializer,
    JobSerializer,
    JobApplicationSerializer,
    StudentJobSerializer,
    StudentMyApplicationSerializer,
)
from rest_framework import status

from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView
)

# Create your views here.
class CompanyListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        companies = Company.objects.all()

        serializer = CompanySerializer(
            companies,
            many=True
        )

        return Response(serializer.data)

    def post(self, request):
        serializer = CompanySerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            serializer.data,
            status=201
        )




class CompanyDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, id):
        return get_object_or_404(
            Company,
            id=id
        )

    def get(self, request, id):
        company = self.get_object(id)

        serializer = CompanySerializer(company)

        return Response(serializer.data)

    def put(self, request, id):
        company = self.get_object(id)

        serializer = CompanySerializer(
            company,
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(serializer.data)

    def delete(self, request, id):
        company = self.get_object(id)

        company.delete()

        return Response(
            {
                "message": "Company deleted successfully."
            },
            status=status.HTTP_200_OK
        )
        
class PlacementDriveListCreateAPIView(
    ListCreateAPIView
):
    queryset = (
        PlacementDrive.objects
        .select_related("company")
        .order_by("-created_at")
    )

    serializer_class = PlacementDriveSerializer


class PlacementDriveDetailAPIView(
    RetrieveUpdateDestroyAPIView
):
    permission_classes = [IsAuthenticated]

    queryset = (
        PlacementDrive.objects
        .select_related("company")
    )

    serializer_class = PlacementDriveSerializer

    def destroy(self, request, *args, **kwargs):
        drive = self.get_object()

        title = drive.title

        drive.delete()

        return Response(
            {
                "message": f'Placement Drive "{title}" deleted successfully.'
            },
            status=status.HTTP_200_OK
        )
    
class JobListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        jobs = Job.objects.all().order_by("-created_at")

        serializer = JobSerializer(
            jobs,
            many=True
        )

        return Response(serializer.data)

    def post(self, request):
        serializer = JobSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

class JobDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        return Job.objects.get(pk=pk)

    def get(self, request, pk):
        job = self.get_object(pk)

        serializer = JobSerializer(job)

        return Response(serializer.data)

    def put(self, request, pk):
        job = self.get_object(pk)

        serializer = JobSerializer(
            job,
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(serializer.data)

    def delete(self, request, pk):
        job = self.get_object(pk)

        job.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )

class JobApplicationCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):

        student = StudentProfile.objects.get(
            user=request.user
        )

        job = Job.objects.get(pk=pk)

        if JobApplication.objects.filter(
            student=student,
            job=job
        ).exists():

            return Response(
                {
                    "message":
                    "Already applied."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        application = JobApplication.objects.create(
            student=student,
            job=job
        )

        serializer = JobApplicationSerializer(
            application
        )

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

class PlacementJobApplicationsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        applications = JobApplication.objects.filter(
            job_id=pk
        ).order_by("-applied_at")

        serializer = JobApplicationSerializer(
            applications,
            many=True
        )

        return Response(serializer.data)
    
class StudentDriveListAPIView(ListAPIView):

    serializer_class = PlacementDriveSerializer

    def get_queryset(self):

        now = timezone.now()

        return (
            PlacementDrive.objects
            .select_related("company")
            .filter(
                status=PlacementDrive.Status.PUBLISHED,
                registration_deadline__gte=now,
            )
            .order_by("drive_datetime")
        )
    
class StudentPlacementDriveListAPIView(
    ListAPIView
):
    serializer_class = PlacementDriveSerializer

    def get_queryset(self):
        return (
            PlacementDrive.objects
            .select_related("company")
            .filter(
                status=PlacementDrive.Status.PUBLISHED,
                registration_deadline__gte=timezone.now(),
            )
            .order_by("registration_deadline")
        )
    
class StudentJobListAPIView(
    ListAPIView
):
    serializer_class = JobSerializer

    def get_queryset(self):
        return (
            Job.objects
            .select_related("company")
            .filter(
                status=Job.Status.OPEN,
                deadline__gte=timezone.localdate(),
            )
            .order_by("deadline")
        )

class StudentJobListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        today = date.today()

        jobs = Job.objects.filter(
            status=Job.Status.OPEN,
            deadline__gte=today
        ).select_related("company").order_by("deadline")

        student_profile = StudentProfile.objects.filter(
            user=request.user
        ).first()

        serializer = StudentJobSerializer(
            jobs,
            many=True,
            context={
                "student_profile": student_profile
            }
        )

        return Response(serializer.data)

class StudentJobDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        today = date.today()

        try:

            job = Job.objects.select_related(
                "company"
            ).get(
                pk=pk,
                status=Job.Status.OPEN,
                deadline__gte=today
            )

        except Job.DoesNotExist:

            return Response(
                {
                    "error": "Job not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        student_profile = StudentProfile.objects.filter(
            user=request.user
        ).first()

        serializer = StudentJobSerializer(
            job,
            context={
                "student_profile": student_profile
            }
        )

        return Response(serializer.data)
    
class ApplyJobAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):

        # -----------------------------
        # Student Profile
        # -----------------------------
        try:
            student = StudentProfile.objects.get(
                user=request.user
            )
        except StudentProfile.DoesNotExist:
            return Response(
                {
                    "error": "Please complete your student profile first."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -----------------------------
        # Profile Approval Check
        # -----------------------------
        if student.status != StudentProfile.Status.APPROVED:
            return Response(
                {
                    "error": (
                        "Only trainer approved students "
                        "can apply for jobs."
                    )
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # -----------------------------
        # Job Exists
        # -----------------------------
        try:
            job = Job.objects.get(pk=pk)
        except Job.DoesNotExist:
            return Response(
                {
                    "error": "Job not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # -----------------------------
        # Job Status
        # -----------------------------
        if job.status != Job.Status.OPEN:
            return Response(
                {
                    "error": "This job is closed."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -----------------------------
        # Deadline Check
        # -----------------------------
        if job.deadline < date.today():
            return Response(
                {
                    "error": "Application deadline has passed."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -----------------------------
        # Already Applied
        # -----------------------------
        if JobApplication.objects.filter(
            student=student,
            job=job
        ).exists():

            return Response(
                {
                    "error": "You have already applied for this job."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -----------------------------
        # Apply
        # -----------------------------
        application = JobApplication.objects.create(
            student=student,
            job=job
        )

        serializer = JobApplicationSerializer(
            application
        )

        return Response(
            {
                "message": "Application submitted successfully.",
                "application": serializer.data,
            },
            status=status.HTTP_201_CREATED
        )

class StudentMyApplicationsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        try:
            student = StudentProfile.objects.get(
                user=request.user
            )

        except StudentProfile.DoesNotExist:

            return Response(
                [],
                status=status.HTTP_200_OK
            )

        applications = (
            JobApplication.objects
            .filter(student=student)
            .select_related(
                "job",
                "job__company"
            )
            .order_by("-applied_at")
        )

        serializer = StudentMyApplicationSerializer(
            applications,
            many=True
        )

        return Response(serializer.data)

class PlacementApplicationsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        applications = (
            JobApplication.objects
            .select_related(
                "student__user",
                "job",
                "job__company",
            )
            .order_by("-applied_at")
        )

        serializer = JobApplicationSerializer(
            applications,
            many=True,
            context={"request": request},   # <-- Add this
        )

        return Response(serializer.data)