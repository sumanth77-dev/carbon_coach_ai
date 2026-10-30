"""
setup_test.py - Environment & Gemini Connection Verification Script
Hackathon: Carbon Coach – AI-Powered Carbon Footprint Management Agent
Phase 1: Environment Setup Verification
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

def mask_key(key: str) -> str:
    """Mask API key for safe display."""
    if not key or len(key) < 8:
        return "***"
    return f"{key[:4]}...{key[-4:]}"

def verify_environment():
    print("=" * 60)
    print("  Carbon Coach AI - Phase 1 Environment Verification")
    print("=" * 60)
    
    # 1. Virtual Environment Check
    in_venv = sys.prefix != sys.base_prefix
    print(f"[1/4] Python Version    : {sys.version.split()[0]}")
    print(f"      Virtual Env Active: {'YES (' + sys.prefix + ')' if in_venv else 'NO (Running in global Python!)'}")
    if not in_venv:
        print("      [WARNING] Script is not running inside a virtual environment (.venv).")
    
    # 2. Package Import Checks
    print("\n[2/4] Verifying Installed Libraries...")
    try:
        import google.adk as adk
        adk_version = getattr(adk, "__version__", "installed")
        print(f"      [OK] google.adk (v{adk_version}) successfully imported.")
    except ImportError as e:
        print(f"      [ERROR] Failed to import google.adk: {e}")
        return False

    try:
        from google import genai
        from google.genai.errors import APIError, ClientError, ServerError
        print(f"      [OK] google.genai successfully imported.")
    except ImportError as e:
        print(f"      [ERROR] Failed to import google.genai: {e}")
        return False

    # 3. Configuration Check (.env)
    print("\n[3/4] Checking Environment Configuration (.env)...")
    env_path = Path(__file__).resolve().parent / ".env"
    if env_path.exists():
        load_dotenv(dotenv_path=env_path)
        print("      [OK] Found .env file.")
    else:
        print("      [WARNING] .env file not found in project root.")
        load_dotenv()

    api_key = os.getenv("GOOGLE_API_KEY", "").strip()
    model_name = os.getenv("ECOMATE_MODEL", "gemini-2.5-flash").strip()

    print(f"      Configured Model  : {model_name}")
    print(f"      API Key Status    : {'Configured (' + mask_key(api_key) + ')' if api_key and api_key != 'YOUR_API_KEY' else 'NOT SET / PLACEHOLDER'}")

    if not api_key or api_key == "YOUR_API_KEY":
        print("\n" + "!" * 60)
        print("  ACTION REQUIRED: Missing Gemini API Key")
        print("  Please update .env with your valid Gemini API key:")
        print("    GOOGLE_API_KEY=your_actual_api_key_here")
        print("!" * 60)
        return False

    # 4. Gemini Connection Check
    print("\n[4/4] Testing Gemini API Connection...")
    client = genai.Client(api_key=api_key)
    
    # Models to try: configured model first, followed by available active Flash fallbacks if retired or rate-limited
    models_to_try = [model_name]
    for fallback in ["gemini-3.1-flash-lite", "gemini-3.5-flash", "gemini-3.8-flash"]:
        if fallback not in models_to_try:
            models_to_try.append(fallback)
            
    active_model = None
    response = None
    last_error = None

    for m in models_to_try:
        try:
            resp = client.models.generate_content(
                model=m,
                contents="Say 'Hello Carbon Coach!' and confirm connection is ready."
            )
            if resp and resp.text:
                active_model = m
                response = resp
                break
        except ClientError as e:
            last_error = e
            if e.code in (404, 429) and ("no longer available" in str(e.message) or "not found" in str(e.message) or "quota" in str(e.message).lower()):
                print(f"      [INFO] Model '{m}' returned {e.code} (unavailable/quota exceeded); checking active alternative...")
                continue
            else:
                print(f"      [ERROR] Client Error ({e.code}): {e.message}")
                if e.code == 400 or "API key" in str(e.message):
                    print("      -> Reason: The provided GOOGLE_API_KEY appears to be invalid or unauthorized.")
                return False
        except ServerError as e:
            last_error = e
            print(f"      [INFO] Model '{m}' returned {e.code}; checking alternative...")
            continue
        except Exception as e:
            last_error = e
            error_name = type(e).__name__
            print(f"      [ERROR] Connection failed ({error_name}): {e}")
            if "connect" in str(e).lower() or "timeout" in str(e).lower() or "resolution" in str(e).lower():
                print("      -> Reason: Network error. Please check your internet connection or proxy settings.")
            return False

    if active_model and response:
        if active_model != model_name:
            print(f"      [NOTE] '{model_name}' was automatically upgraded to active '{active_model}'.")
        print("      [SUCCESS] Gemini API connection established!")
        print(f"      Response from {active_model}: {response.text.strip()}")
        print("\n" + "=" * 60)
        print("  Phase 1 Environment & Connection Verification: PASSED")
        print("=" * 60)
        return True
    else:
        print(f"      [ERROR] Unable to establish connection. Last error: {last_error}")
        return False

if __name__ == "__main__":
    success = verify_environment()
    sys.exit(0 if success else 1)
