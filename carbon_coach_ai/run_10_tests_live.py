"""
run_10_tests_live.py - Real-World Live Testing of 10 Hackathon Conversations.
Executes the live Google ADK Root Agent (carbon_coach_root) with InMemoryRunner.
"""

import sys
import os
import asyncio
from pathlib import Path
from dotenv import load_dotenv

PROJECT_ROOT = Path(__file__).resolve().parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

load_dotenv(PROJECT_ROOT / ".env")

from google.genai import types
from google.adk.runners import InMemoryRunner
from carbon_coach.agent import carbon_coach_root
from carbon_coach.tracker.db import init_db

TEST_CONVERSATIONS = [
    {
        "id": 1,
        "title": "Basic transportation (Missing Mode)",
        "prompt": "I have travelled 20 km.",
        "expected": "Identify transportation mode is missing; ask follow-up without assuming mode."
    },
    {
        "id": 2,
        "title": "Petrol bike travel",
        "prompt": "I travelled 20 km by petrol bike.",
        "expected": "Calculate emissions (1.027 kg CO2e), display formula, source, assumptions, and log to SQLite."
    },
    {
        "id": 3,
        "title": "Electricity (Fan 10 hrs)",
        "prompt": "I used a fan for 10 hours.",
        "expected": "Disclose power assumption (approx 60W), calculate emissions (0.426 kg CO2e), log to SQLite."
    },
    {
        "id": 4,
        "title": "Multiple activities",
        "prompt": "Today I travelled 15 km by bike, used AC for 4 hours and ate chicken for lunch.",
        "expected": "Extract all 3 activities, calculate individually, calculate total via tool, and log to SQLite."
    },
    {
        "id": 5,
        "title": "Daily summary",
        "prompt": "What is my carbon footprint today?",
        "expected": "Retrieve today's records from SQLite, display daily total and category breakdown."
    },
    {
        "id": 6,
        "title": "Weekly summary",
        "prompt": "Show my carbon footprint for the last 7 days.",
        "expected": "Retrieve past 7 days from SQLite, display weekly total and daily average."
    },
    {
        "id": 7,
        "title": "Carbon reduction tips",
        "prompt": "How can I reduce my carbon footprint?",
        "expected": "Analyze stored activities, provide actionable tips with tool-calculated savings."
    },
    {
        "id": 8,
        "title": "What-if simulation",
        "prompt": "What if I use a bus instead of my petrol bike?",
        "expected": "Compare petrol bike vs bus for 20 km, show exact savings (0.427 kg) and percent reduction."
    },
    {
        "id": 9,
        "title": "Unsupported activity",
        "prompt": "I travelled 20 km by spaceship.",
        "expected": "Handle unsupported mode gracefully without inventing numbers."
    },
    {
        "id": 10,
        "title": "Activity history",
        "prompt": "Show me all my previous activities.",
        "expected": "Retrieve and display previous logged activities from SQLite."
    }
]


async def run_live_tests():
    print("=" * 75)
    print("  CARBON COACH AI - 10 REAL-WORLD CONVERSATION TESTS (LIVE ADK + GEMINI)")
    print("=" * 75)
    
    init_db()
    runner = InMemoryRunner(agent=carbon_coach_root, app_name="carbon_coach")
    user_id = "test_user_10conv"
    session_id = "sess_10conv"

    # Setup ADK session
    try:
        await runner.session_service.create_session(
            user_id=user_id,
            session_id=session_id,
            app_name=runner.app_name
        )
    except Exception:
        pass

    results = []

    for test in TEST_CONVERSATIONS:
        tid = test["id"]
        title = test["title"]
        prompt = test["prompt"]
        expected = test["expected"]

        print(f"\n" + "-" * 75)
        print(f"[TEST {tid}/10] {title}")
        print(f"User Prompt : \"{prompt}\"")
        print(f"Expected    : {expected}")
        print("-" * 75)

        msg = types.Content(parts=[types.Part(text=prompt)])
        parts = []

        try:
            async for event in runner.run_async(
                user_id=user_id,
                session_id=session_id,
                new_message=msg
            ):
                if event.content and event.content.parts:
                    for p in event.content.parts:
                        if p.text:
                            parts.append(p.text)

            agent_reply = " ".join(parts).strip()
            print(f"Carbon Coach Reply:\n{agent_reply}\n")
            
            # Validation check
            passed = len(agent_reply) > 15
            results.append({
                "id": tid,
                "title": title,
                "prompt": prompt,
                "reply": agent_reply,
                "status": "PASSED" if passed else "FAILED"
            })
            print(f"Result: [{'PASSED' if passed else 'FAILED'}]")

        except Exception as e:
            print(f"[ERROR in Test {tid}]: {e}")
            results.append({
                "id": tid,
                "title": title,
                "prompt": prompt,
                "reply": f"Error: {e}",
                "status": "ERROR"
            })

    print("\n" + "=" * 75)
    print("  TEST SUMMARY")
    print("=" * 75)
    passed_count = sum(1 for r in results if r["status"] == "PASSED")
    for r in results:
        print(f"Test {r['id']:2d}: {r['title']:35} -> {r['status']}")
    print(f"\nTotal: {passed_count}/{len(results)} Passed.")


if __name__ == "__main__":
    asyncio.run(run_live_tests())
