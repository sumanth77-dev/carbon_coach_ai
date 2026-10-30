"""
main.py - Production Entry Point for Carbon Coach AI (Phase 10).
Suitable for Google Cloud Run deployment and local execution.
"""

import os
import sys
import argparse
import uvicorn
from pathlib import Path
from dotenv import load_dotenv

# Ensure project root in sys.path
PROJECT_ROOT = Path(__file__).resolve().parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

load_dotenv(PROJECT_ROOT / ".env")

from carbon_coach.api import app
from carbon_coach.tracker.db import init_db


def run_cli():
    """Interactive command-line interface for Carbon Coach AI."""
    import asyncio
    from google.genai import types
    from google.adk.runners import InMemoryRunner
    from carbon_coach.agent import carbon_coach_root

    print("=" * 60)
    print("  Carbon Coach AI - Interactive Shell")
    print("  Type 'exit' or 'quit' to end.")
    print("=" * 60)

    runner = InMemoryRunner(agent=carbon_coach_root, app_name="carbon_coach")
    user_id = "cli_user"
    session_id = "cli_session"

    async def _init_session():
        try:
            await runner.session_service.create_session(
                user_id=user_id,
                session_id=session_id,
                app_name=runner.app_name
            )
        except Exception:
            pass

    asyncio.run(_init_session())

    while True:
        try:
            user_input = input("\nYou: ").strip()
            if not user_input:
                continue
            if user_input.lower() in ("exit", "quit", "q"):
                print("Goodbye! Keep reducing your footprint 🌱")
                break

            async def _chat(text):
                msg = types.Content(parts=[types.Part(text=text)])
                parts = []
                async for event in runner.run_async(user_id=user_id, session_id=session_id, new_message=msg):
                    if event.content and event.content.parts:
                        for p in event.content.parts:
                            if p.text:
                                parts.append(p.text)
                return " ".join(parts).strip()

            reply = asyncio.run(_chat(user_input))
            print(f"\nCarbon Coach:\n{reply}")

        except KeyboardInterrupt:
            print("\nExiting...")
            break
        except Exception as e:
            print(f"\n[Error]: {e}")


def main():
    parser = argparse.ArgumentParser(description="Carbon Coach AI Service")
    parser.add_argument("--cli", action="store_true", help="Launch interactive CLI shell instead of HTTP server")
    parser.add_argument("--host", default=os.getenv("HOST", "0.0.0.0"), help="Host to bind HTTP server")
    parser.add_argument("--port", type=int, default=int(os.getenv("PORT", "8080")), help="Port to bind HTTP server")
    args = parser.parse_args()

    # Initialize SQLite database
    init_db()

    if args.cli:
        run_cli()
    else:
        print(f"Starting Carbon Coach AI Backend on {args.host}:{args.port}...")
        uvicorn.run("carbon_coach.api:app", host=args.host, port=args.port, reload=False)


if __name__ == "__main__":
    main()
