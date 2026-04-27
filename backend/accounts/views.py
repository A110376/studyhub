import os
import json
from django.http import JsonResponse
from django.conf import settings
from django.utils import timezone
from django.shortcuts import get_object_or_404

from rest_framework import status, viewsets, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework.filters import SearchFilter
from rest_framework.decorators import api_view, permission_classes

from .models import Quiz, Question, QuizResult, MockAttempt, MockTest
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    QuizSerializer,
    QuestionSerializer,
    QuizSubmitSerializer,
    QuizResultSerializer,
    StartAttemptSerializer,
    SubmitSerializer,
)

# =========================
# Helpers
# =========================

def _tests_base_dir():
    """Return the mock tests directory from settings."""
    return settings.MOCK_TESTS_DIR


def load_test_json(slug: str):
    """Load a mock-test JSON by slug."""
    slug = (slug or "").strip()
    if not slug:
        return None

    file_path = os.path.join(_tests_base_dir(), f"{slug}.json")
    if not os.path.exists(file_path):
        return None

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception:
        return None

    # Old list-only format को dict में wrap करना
    if isinstance(data, list):
        data = {
            "title": slug.replace("-", " ").title(),
            "duration_minutes": 90,
            "marks_per_correct": 1,
            "negative_mark_per_wrong": 0.25,
            "questions": data,
        }
    else:
        data.setdefault("duration_minutes", 90)
        data.setdefault("marks_per_correct", 1)
        data.setdefault("negative_mark_per_wrong", 0.25)

    # हर question को unique ID assign करना
    if "questions" in data and isinstance(data["questions"], list):
        for idx, q in enumerate(data["questions"], start=1):
            q.setdefault("id", idx)

    return data


# =====================
# Authentication Views
# =====================

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            refresh = RefreshToken.for_user(user)
            return Response({"refresh": str(refresh), "access": str(refresh.access_token)})
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response({"message": "Refresh token required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logged out successfully"}, status=status.HTTP_205_RESET_CONTENT)
        except TokenError as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# =================
# Quiz ViewSets
# =================

class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all().order_by("-created_at")
    serializer_class = QuizSerializer
    permission_classes = [permissions.AllowAny]


class QuestionViewSet(viewsets.ModelViewSet):
    serializer_class = QuestionSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [SearchFilter]
    search_fields = ["subject"]

    def get_queryset(self):
        subject = self.request.query_params.get("subject")
        if subject:
            return Question.objects.filter(subject__iexact=subject)
        return Question.objects.all()


# ===================
# Quiz Submission
# ===================

class SubmitQuizView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = QuizSubmitSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            responses = serializer.validated_data["responses"]

            score = sum(1 for item in responses if item["selected_option"] == item["correct_answer"])
            total_questions = len(responses)

            QuizResult.objects.create(
                user=user,
                subject=serializer.validated_data["subject"],
                score=score,
                total=total_questions,
                date_taken=timezone.now(),
            )

            return Response({"message": "Quiz submitted successfully", "score": score, "total": total_questions})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SubmitQuizResultView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = QuizResultSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({"message": "Result saved", "data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PerformanceHistoryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        results = QuizResult.objects.filter(user=request.user).order_by("-date_taken")
        serializer = QuizResultSerializer(results, many=True)
        return Response(serializer.data)


# =================
# JSON-based Quizzes
# =================

class QuestionListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        subject = request.GET.get("subject", "").lower().replace(" ", "-")
        file_path = os.path.join(settings.BASE_DIR, "static", "data", f"{subject}.json")

        if not os.path.exists(file_path):
            return JsonResponse({"message": "Subject not found"}, status=404)

        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                for idx, item in enumerate(data):
                    item.setdefault("id", idx + 1)
        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON format"}, status=500)

        return JsonResponse(data, safe=False)


# =================
# MockTest DB Questions
# =================

class MockTestQuestionView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, mocktest_id):
        try:
            mocktest = MockTest.objects.get(id=mocktest_id)
            questions = Question.objects.filter(mock_test=mocktest)
            serializer = QuestionSerializer(questions, many=True)
            return Response(serializer.data)
        except MockTest.DoesNotExist:
            return Response({"error": "Mock test not found"}, status=404)


# =================
# MockTest JSON Endpoints
# =================

TOLERANCE_SECONDS = 10


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def start_attempt(request, slug):
    data = load_test_json(slug)
    if not data:
        return Response({"detail": "Test not found"}, status=404)

    duration = data.get("duration_minutes", 90)
    attempt = MockAttempt.objects.create(slug=slug, duration_minutes=duration)
    serializer = StartAttemptSerializer(attempt)
    return Response(serializer.data, status=201)


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def get_questions(request, slug):
    data = load_test_json(slug)
    if not data:
        return Response({"detail": "Test not found"}, status=404)

    sanitized = [
        {"id": q.get("id"), "question": q.get("question"), "options": q.get("options", [])}
        for q in data.get("questions", [])
    ]

    return Response({
        "slug": slug,
        "title": data.get("title"),
        "duration_minutes": data.get("duration_minutes", 90),
        "questions": sanitized,
    })

@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def submit_attempt(request, attempt_id):
    attempt = get_object_or_404(MockAttempt, pk=attempt_id)
    if attempt.submitted:
        return Response({"detail": "Attempt already submitted"}, status=400)

    ser = SubmitSerializer(data=request.data)
    ser.is_valid(raise_exception=True)
    answers = ser.validated_data.get("answers", {})

    data = load_test_json(attempt.slug)
    if not data:
        return Response({"detail": "Test data missing on server"}, status=500)

    marks_corr = data.get("marks_per_correct", 1)
    neg_wrong = data.get("negative_mark_per_wrong", 0.25)

    correct = wrong = unattempted = 0
    for q in data.get("questions", []):
        qid = str(q.get("id"))
        if not qid or qid not in answers:
            unattempted += 1
            continue

        selected = str(answers[qid]).strip()
        correct_ans = str(q.get("correct")).strip()

        if selected == correct_ans:
            correct += 1
        else:
            wrong += 1

    score = (correct * marks_corr) - (wrong * neg_wrong)

    attempt.submitted = True
    attempt.submit_time = timezone.now()
    attempt.total_questions = len([q for q in data.get("questions", []) if "id" in q])
    attempt.correct = correct
    attempt.wrong = wrong
    attempt.unattempted = unattempted
    attempt.score = float(score)
    attempt.raw_answers = answers
    attempt.save()

    return Response({
        "attempt_id": str(attempt.id),
        "total_questions": attempt.total_questions,
        "correct": correct,
        "wrong": wrong,
        "unattempted": unattempted,
        "score": attempt.score,
    })


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def get_result(request, attempt_id):
    attempt = get_object_or_404(MockAttempt, pk=attempt_id)
    if not attempt.submitted:
        return Response({"detail": "Attempt not yet submitted"}, status=400)

    return Response({
        "attempt_id": str(attempt.id),
        "slug": attempt.slug,
        "total_questions": attempt.total_questions,
        "correct": attempt.correct,
        "wrong": attempt.wrong,
        "unattempted": attempt.unattempted,
        "score": attempt.score,
        "start_time": attempt.start_time,
        "submit_time": attempt.submit_time,
    })
