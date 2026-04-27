from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views


router = DefaultRouter()
router.register(r'quizzes', views.QuizViewSet, basename='quiz')
router.register(r'questions', views.QuestionViewSet, basename='question')

urlpatterns = [
    # =========================
    # Authentication & JWT
    # =========================
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', views.LogoutView.as_view(), name='auth_logout'),

    # =========================
    # DB-backed Quizzes
    # =========================
    path('submit/', views.SubmitQuizView.as_view(), name='submit-quiz'),
    path('performance/', views.PerformanceHistoryView.as_view(), name='performance-history'),

    # =========================
    # JSON-based quizzes
    # =========================
    path('question-list/', views.QuestionListView.as_view(), name='question-list'),
    path('questions/json/', views.QuestionListView.as_view(), name='json-questions'),

    # =========================
    # DB Mock Test Questions
    # =========================
    path('mocktest/<int:mocktest_id>/questions/', views.MockTestQuestionView.as_view(), name='mocktest-questions'),

    # =========================
    # JSON Mock Test Endpoints
    # =========================
    path('mocktest/<slug:slug>/start/', views.start_attempt, name='mocktest-start'),
    path('mocktest/<slug:slug>/questions/', views.get_questions, name='mocktest-questions-json'),
   path('mocktest/attempts/<uuid:attempt_id>/submit/', views.submit_attempt, name='mocktest-submit'),
path('mocktest/attempts/<uuid:attempt_id>/result/', views.get_result, name='mocktest-result'),
    # =========================
    # DRF Router
    # =========================
    path('', include(router.urls)),
]
