# python, mitmproxy addon, captures Lovable/gpt-engineer API traffic to jsonl
# run: mitmdump -s mitm_capture.py -p 8080
# target domains below are best-guess for Lovable's stack (gpt-engineer backend + lovable.dev frontend);
# widen/narrow DOMAINS after first capture once you see the real hosts in traffic.jsonl
import json
import time
from pathlib import Path
from mitmproxy import http

OUT_PATH = Path(__file__).parent / "traffic.jsonl"
DOMAINS = (
    "lovable.dev",
    "gptengineer.app",
    "gpt-engineer-390607",
    "googleapis.com",
    "identitytoolkit.googleapis.com",
    "securetoken.googleapis.com",
    "supabase.co",
)


def _matches(host: str) -> bool:
    return any(d in host for d in DOMAINS)


def _body(flow_part) -> str | None:
    try:
        raw = flow_part.get_text(strict=False)
    except Exception:
        return None
    if raw is None:
        return None
    return raw[:20000]  # cap payload size in log


def response(flow: http.HTTPFlow) -> None:
    host = flow.request.pretty_host
    if not _matches(host):
        return

    record = {
        "ts": time.time(),
        "method": flow.request.method,
        "url": flow.request.pretty_url,
        "req_headers": dict(flow.request.headers),
        "req_body": _body(flow.request),
        "status": flow.response.status_code if flow.response else None,
        "resp_headers": dict(flow.response.headers) if flow.response else None,
        "resp_body": _body(flow.response) if flow.response else None,
    }

    with OUT_PATH.open("a", encoding="utf-8") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")
