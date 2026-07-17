from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from accounts.models import User
from .models import StudentProfile, TrainerRemark
from .serializers import  (
    StudentProfileSerializer,
    TrainerListSerializer,
    TrainerStudentSerializer,
    TrainerStudentDetailSerializer,
    TrainerActionSerializer,
    
)
from rest_framework.parsers import MultiPartParser, FormParser

# Create your views here.


class StudentProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        profile, created = StudentProfile.objects.get_or_create(
            user=request.user
        )

        serializer = StudentProfileSerializer(profile)

        return Response(serializer.data)

    def post(self, request):
        print("REQUEST DATA:", request.data)
        print("REQUEST FILES:", request.FILES)

        profile, created = StudentProfile.objects.get_or_create(
            user=request.user
        )

        serializer = StudentProfileSerializer(
            profile,
            data=request.data,
            partial=True
        )

        serializer.is_valid(raise_exception=True)

        print("VALIDATED DATA:", serializer.validated_data)

        serializer.save(status="PENDING")

        return Response(serializer.data)

    def put(self, request):
        print("REQUEST DATA:", request.data)
        print("REQUEST FILES:", request.FILES)

        profile, created = StudentProfile.objects.get_or_create(
            user=request.user
        )

        serializer = StudentProfileSerializer(
            profile,
            data=request.data,
            partial=True
        )

        serializer.is_valid(raise_exception=True)

        print("VALIDATED DATA:", serializer.validated_data)

        serializer.save()

        return Response(serializer.data)

class TrainerListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        trainers = User.objects.filter(
            role=User.Role.TRAINER,
            is_active=True
        )

        serializer = TrainerListSerializer(
            trainers,
            many=True
        )

        return Response(serializer.data)

class TrainerStudentsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        students = StudentProfile.objects.filter(
            trainer=request.user
        )

        serializer = TrainerStudentSerializer(
            students,
            many=True
        )

        return Response(serializer.data)
class TrainerStudentDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        trainer = request.user

        try:
            student = StudentProfile.objects.get(
                id=id,
                trainer=trainer
            )

            serializer = TrainerStudentDetailSerializer(student)

            return Response(serializer.data)

        except StudentProfile.DoesNotExist:
            return Response(
                {"error": "Student not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
class TrainerApproveAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = TrainerActionSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        trainer = request.user

        student_profile = StudentProfile.objects.get(
            id=serializer.validated_data["student_profile_id"],
            trainer=trainer
        )

        student_profile.status = (
            StudentProfile.Status.APPROVED
        )
        student_profile.save()

        TrainerRemark.objects.create(
            student_profile=student_profile,
            trainer=trainer,
            remark=serializer.validated_data["remark"],
            action=TrainerRemark.Action.APPROVED
        )

        return Response(
            {"message": "Student approved"}
        )

class TrainerRejectAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = TrainerActionSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        trainer = request.user

        student_profile = StudentProfile.objects.get(
            id=serializer.validated_data["student_profile_id"],
            trainer=trainer
        )

        student_profile.status = (
            StudentProfile.Status.REJECTED
        )
        student_profile.save()

        TrainerRemark.objects.create(
            student_profile=student_profile,
            trainer=trainer,
            remark=serializer.validated_data["remark"],
            action=TrainerRemark.Action.REJECTED
        )

        return Response(
            {"message": "Student rejected"}
        )

class StudentDashboardAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = StudentProfile.objects.filter(
            user=request.user
        ).first()

        if not profile:
            return Response({
                "student_name": (
                    f"{request.user.first_name} "
                    f"{request.user.last_name}"
                ).strip(),
                "profile_status": None,
                "trainer_name": None,
                "latest_remark": None,
                "has_profile": False,
            })

        latest_remark = (
            TrainerRemark.objects.filter(
                student_profile=profile
            )
            .order_by("-created_at")
            .first()
        )

        trainer_name = None

        if profile.trainer:
            trainer_name = (
                f"{profile.trainer.first_name} "
                f"{profile.trainer.last_name}"
            ).strip()

        return Response({
            "student_name": (
                f"{request.user.first_name} "
                f"{request.user.last_name}"
            ).strip(),

            "profile_status": profile.status,

            "trainer_name": trainer_name,

            "latest_remark": (
                latest_remark.remark
                if latest_remark
                else None
            ),

            "has_profile": True
        })
    
class ApprovedStudentsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        students = StudentProfile.objects.filter(
            status=StudentProfile.Status.APPROVED
        )

        data = []

        for student in students:
            data.append({
                "id": student.id,
                "student_name": student.student_name,
                "qualification": student.qualification,
                "skills": student.skills,
            })

        return Response(data)

class PlacementStudentDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        profile = StudentProfile.objects.get(
            id=pk,
            status=StudentProfile.Status.APPROVED
        )

        return Response({
            "id": profile.id,
            "student_name": profile.user.get_full_name(),
            "email": profile.user.email,
            "phone": profile.phone,
            "qualification": profile.qualification,
            "passout_year": profile.passout_year,
            "address": profile.address,
            "skills": profile.skills,
            "resume": (
                profile.resume.url
                if profile.resume
                else None
            ),
            "trainer": (
                profile.trainer.get_full_name()
                if profile.trainer
                else None
            ),
            "status": profile.status,
        })
