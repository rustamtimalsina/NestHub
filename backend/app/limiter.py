from slowapi import Limiter
from slowapi.util import get_remote_address


def client_ip(request):
    # Behind Render's proxy, the visitor's address is in this header
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return get_remote_address(request)


limiter = Limiter(key_func=client_ip)