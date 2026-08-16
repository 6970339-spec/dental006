from rest_framework.permissions import BasePermission, SAFE_METHODS


class RolePermission(BasePermission):
    """Role defaults with optional per-user access rights managed by clinic leadership."""

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if user.role in {"super_admin", "director"} or user.is_superuser:
            return True
        resource = getattr(view, "resource_name", "")
        if resource and resource in (user.access_rights or []):
            return True
        if user.role == "deputy_director":
            return resource != "audit"
        if user.role == "administrator":
            return resource not in {"audit"}
        if user.role == "accountant":
            return resource in {"finances", "reports", "patients"} and (request.method in SAFE_METHODS or resource == "finances")
        if user.role == "doctor":
            if request.method in SAFE_METHODS:
                return resource not in {"users", "audit", "clinic"}
            return resource in {"treatments", "attachments", "notifications"}
        return False
