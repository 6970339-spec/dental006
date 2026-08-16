from .models import AuditLog


class AuditMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if request.path.startswith("/api/") and request.method not in {"GET", "HEAD", "OPTIONS"}:
            forwarded = request.META.get("HTTP_X_FORWARDED_FOR")
            ip_address = forwarded.split(",")[0].strip() if forwarded else request.META.get("REMOTE_ADDR")
            AuditLog.objects.create(
                user=request.user if getattr(request, "user", None) and request.user.is_authenticated else None,
                method=request.method,
                path=request.path[:500],
                status_code=response.status_code,
                ip_address=ip_address,
            )
        return response

