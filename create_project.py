# python 3.11+, playwright, drives a real lovable.dev session via a captured Firebase token
# and creates a project while traffic is captured by mitm_capture.py.
#
# setup:
#   pip install playwright
#   playwright install chromium
#   mitmdump -s mitm_capture.py -p 8080        (run this in a separate terminal first)
#
# usage:
#   python create_project.py --tokens tokens_capturados.txt --line 0 --prompt "landing page para uma cafeteria"
#
# how auth injection works: Lovable's frontend is a Firebase JS SDK app. On load it reads
# localStorage key "firebase:authUser:<API_KEY>:[DEFAULT]" to restore a session instead of
# redirecting to login, as long as the id_token inside hasn't expired (tokens here are ~1h TTL,
# refresh_token is long-lived — the SDK auto-refreshes once loaded if refresh_token is valid).
# FILL: FIREBASE_API_KEY below — grab it from lovable.dev page source (search "apiKey") or from
# the first identitytoolkit.googleapis.com request mitm_capture.py logs.

import argparse
import json
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

FIREBASE_API_KEY = "FILL_ME"  # per-build: see note above
FIREBASE_PROJECT_ID = "gpt-engineer-390607"
LOVABLE_URL = "https://lovable.dev/"
PROXY_SERVER = "http://127.0.0.1:8080"  # must match mitmdump -p


def load_token_line(path: Path, idx: int) -> tuple[str, str, str]:
    lines = [l for l in path.read_text(encoding="utf-8").splitlines() if l.strip()]
    email, id_token, refresh_token = lines[idx].split("|")
    return email, id_token, refresh_token


def build_auth_user_blob(email: str, id_token: str, refresh_token: str, local_id: str) -> dict:
    # shape mirrors what firebase/auth persists; expirationTime is advisory, SDK re-validates via id_token exp claim
    now_ms = int(time.time() * 1000)
    return {
        "uid": local_id,
        "email": email,
        "emailVerified": True,
        "isAnonymous": False,
        "providerData": [
            {
                "uid": email,
                "email": email,
                "providerId": "password",
            }
        ],
        "stsTokenManager": {
            "refreshToken": refresh_token,
            "accessToken": id_token,
            "expirationTime": now_ms + 60 * 60 * 1000,
        },
        "createdAt": str(now_ms),
        "lastLoginAt": str(now_ms),
        "apiKey": FIREBASE_API_KEY,
        "appName": "[DEFAULT]",
    }


def decode_jwt_field(token: str, field: str):
    import base64

    payload_b64 = token.split(".")[1]
    padded = payload_b64 + "=" * (-len(payload_b64) % 4)
    payload = json.loads(base64.urlsafe_b64decode(padded))
    return payload.get(field)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--tokens", required=True, type=Path)
    ap.add_argument("--line", type=int, default=0)
    ap.add_argument("--prompt", required=True)
    ap.add_argument("--headless", action="store_true")
    args = ap.parse_args()

    if FIREBASE_API_KEY == "FILL_ME":
        print("set FIREBASE_API_KEY first (grab from lovable.dev page source or captured traffic)", file=sys.stderr)
        sys.exit(1)

    email, id_token, refresh_token = load_token_line(args.tokens, args.line)
    local_id = decode_jwt_field(id_token, "user_id") or decode_jwt_field(id_token, "sub")
    auth_blob = build_auth_user_blob(email, id_token, refresh_token, local_id)
    storage_key = f"firebase:authUser:{FIREBASE_API_KEY}:[DEFAULT]"

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=args.headless,
            proxy={"server": PROXY_SERVER},
            args=["--ignore-certificate-errors"],  # needed to trust mitmproxy's CA without installing it
        )
        ctx = browser.new_context(ignore_https_errors=True)
        page = ctx.new_page()

        # must land on the real origin once before localStorage write takes effect
        page.goto(LOVABLE_URL, wait_until="domcontentloaded")
        page.evaluate(
            "([k, v]) => window.localStorage.setItem(k, v)",
            [storage_key, json.dumps(auth_blob)],
        )
        page.reload(wait_until="networkidle")

        print(f"[+] injected session for {email}, reloaded, waiting for app to settle")
        page.wait_for_timeout(3000)

        # FILL: selector for the prompt textbox on lovable.dev's home/new-project screen —
        # inspect with devtools once a real session loads (it changes across Lovable redesigns)
        prompt_box = page.locator("textarea").first
        prompt_box.fill(args.prompt)
        prompt_box.press("Enter")

        print("[+] prompt submitted, waiting for project workspace to load")
        page.wait_for_timeout(8000)
        print(f"[+] current url: {page.url}")

        if not args.headless:
            input("press enter to close browser (traffic is being logged to traffic.jsonl)...")

        browser.close()


if __name__ == "__main__":
    main()
