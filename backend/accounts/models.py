from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils.text import slugify
from django.conf import settings
import uuid
from django.contrib.auth import get_user_model


# -------------------------
# Custom User Manager
# -------------------------
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


# -------------------------
# Custom User Model
# -------------------------
class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=15, blank=True)
    gender = models.CharField(max_length=10, blank=True)
    city = models.CharField(max_length=100, blank=True)
    education_level = models.CharField(max_length=100, blank=True)
    ppsc_niche = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email


# -------------------------
# Quiz Models
# -------------------------
class Quiz(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Question(models.Model):
    quiz = models.ForeignKey(Quiz, related_name='questions', on_delete=models.CASCADE)
    question_text = models.TextField()
    options = models.JSONField()  # ["A", "B", "C", "D"]
    correct_answer = models.CharField(max_length=200)

    def __str__(self):
        return self.question_text


class QuizResult(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    subject = models.CharField(max_length=100)
    score = models.IntegerField()
    total = models.IntegerField()
    date_taken = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.subject} - {self.score}/{self.total}"


# -------------------------
# Mock Test Models
# -------------------------
User = get_user_model()
class MockTest(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, null=True, blank=True)
    description = models.TextField(blank=True)
    total_marks = models.IntegerField(default=0)
    duration_minutes = models.IntegerField(default=30)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class MockAttempt(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.SlugField(null=True, blank=True)
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    mock_test = models.ForeignKey(
    MockTest,
    on_delete=models.CASCADE,
    related_name="attempts",
    null=True,
    blank=True
)
    start_time = models.DateTimeField(auto_now_add=True)
    duration_minutes = models.IntegerField()
    submitted = models.BooleanField(default=False)
    submit_time = models.DateTimeField(null=True, blank=True)
    total_questions = models.IntegerField(default=0)
    correct = models.IntegerField(default=0)
    wrong = models.IntegerField(default=0)
    unattempted = models.IntegerField(default=0)
    score = models.FloatField(default=0.0)
    raw_answers = models.JSONField(null=True, blank=True)

    def __str__(self):
        return f"Attempt {self.id} - {self.mock_test.title}"

