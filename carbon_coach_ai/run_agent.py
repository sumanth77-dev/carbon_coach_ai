"""
run_agent.py - Dedicated CLI Runner for Carbon Coach AI Agent (Phase 10).
Start the Google ADK multi-agent system directly from your terminal.

Usage:
    python run_agent.py
"""

import sys
import asyncio
from pathlib import Path
from dotenv import load_dotenv

# Ensure project root is in sys.path
PROJECT_ROOT = Path(__file__).resolve().parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

load_dotenv(PROJECT_ROOT / ".env")

from google.genai import types
from google.adk.runners import InMemoryRunner
from carbon_coach.agent import carbon_coach_root
from carbon_coach.tracker.db import init_db


def main():
    print("=" * 65)
    print("  🌱 CARBON COACH AI - Google ADK Multi-Agent System")
    print("  Measure, understand, track & reduce your carbon footprint.")
    print("  Type your activity (e.g. 'I travelled 12 km by bus'), or 'quit'.")
    print("=" * 65)

    # Initialize SQLite database
    init_db()

    # Initialize ADK Runner
    runner = InMemoryRunner(agent=carbon_coach_root, app_name="carbon_coach")
    user_id = "default_user"
    session_id = "cli_session_1"

    async def _setup_session():
        try:
            await runner.session_service.create_session(
                user_id=user_id,
                session_id=session_id,
                app_name=runner.app_name
            )
        except Exception:
            pass

    asyncio.run(_setup_session())

    async def _ask_agent(user_text: str) -> str:
        msg = types.Content(parts=[types.Part(text=user_text)])
        parts = []
        async for event in runner.run_async(
            user_id=user_id,
            session_id=session_id,
            new_message=msg
        ):
            if event.content and event.content.parts:
                for p in event.content.parts:
                    if p.text:
                        parts.append(p.text)
        return " ".join(parts).strip()

    while True:
        try:
            user_input = input("\nYou: ").strip()
            if not user_input:
                continue
            if user_input.lower() in ("exit", "quit", "q"):
                print("\nGoodbye! Keep making eco-friendly choices 🌱\n")
                break

            print("\nThinking and calculating emissions with verified Python tools...")
            response = asyncio.run(_ask_agent(user_input))
            print(f"\nCarbon Coach:\n{response}")

        except KeyboardInterrupt:
            print("\nExiting Carbon Coach...")
            break
        except Exception as e:
            print(f"\n[Error]: {e}")


if __name__ == "__main__":
    main()
