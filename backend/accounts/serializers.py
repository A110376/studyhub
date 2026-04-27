from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from .models import Quiz, Question, QuizResult, MockAttempt, MockTest

User = get_user_model()

# ----------------- Auth -----------------
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = [
            'email', 'full_name', 'phone', 'gender',
            'city', 'education_level', 'ppsc_niche', 'password'
        ]

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(email=data.get('email'), password=data.get('password'))
        if user is None:
            raise serializers.ValidationError("Invalid email or password")
        if not user.is_active:
            raise serializers.ValidationError("User account is disabled")
        data['user'] = user
        return data

# ----------------- Quiz -----------------
class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'question_text', 'options']
        # correct_answer intentionally removed for security


class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'created_at', 'questions']


class QuizSubmitSerializer(serializers.Serializer):
    subject = serializers.CharField()
    responses = serializers.DictField(
        child=serializers.CharField(),
        help_text="Format: {question_id: selected_option}"
    )


class QuizResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizResult
        fields = ['id', 'user', 'subject', 'score', 'total', 'date_taken']
        read_only_fields = ['user', 'date_taken']

# ----------------- Mock Test -----------------
class StartAttemptSerializer(serializers.ModelSerializer):
    mock_test = serializers.SlugRelatedField(
        slug_field='slug',
        queryset=MockTest.objects.all()
    )
    duration_minutes = serializers.IntegerField(read_only=True)

    class Meta:
        model = MockAttempt
        fields = ['id', 'mock_test', 'start_time', 'duration_minutes']

    def create(self, validated_data):
        mock_test = validated_data['mock_test']
        validated_data['duration_minutes'] = mock_test.duration_minutes
        return super().create(validated_data)

class SubmitSerializer(serializers.Serializer):
    answers = serializers.DictField(
        child=serializers.CharField(),
        allow_empty=False,
        help_text="Format: {question_id: option_text}"
    )

