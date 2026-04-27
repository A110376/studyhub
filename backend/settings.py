from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=8),  # valid for 8 days
    'REFRESH_TOKEN_LIFETIME': timedelta(days=10),  # optional: 10 days for refresh
    'AUTH_HEADER_TYPES': ('Bearer',),
}
