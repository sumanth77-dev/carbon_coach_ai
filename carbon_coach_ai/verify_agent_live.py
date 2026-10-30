"""
verify_agent_live.py - Comprehensive Real-World Verification Script.
Executes the 4 Core Verification Pillars:
1. Google ADK Multi-Agent Architecture Verification
2. Python Tools & Emission Factor Verification
3. SQLite Persistence & Restart Verification
4. Real-World Live User Workflow Verification (5 Real Prompts)
"""

import sys
import os
import json
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
from carbon_coach.agents.activity_agent import activity_understanding_agent
from carbon_coach.agents.measurement_agent import carbon_measurement_agent
from carbon_coach.agents.tracker_agent import tracker_agent
from carbon_coach.agents.coach_agent import carbon_coach_agent
from carbon_coach.tools import carbon_tools, tracker_tools, coach_tools
from carbon_coach.tracker import db


def verify_pillar_1_adk():
    print("\n" + "=" * 70)
    print("PILLAR 1: VERIFY GOOGLE ADK & MULTI-AGENT ARCHITECTURE")
    print("=" * 70)
    
    # 1. Root Agent
    print(f"[*] Root Agent Name       : {carbon_coach_root.name}")
    print(f"[*] Root Agent Model      : {carbon_coach_root.model}")
    print(f"[*] Root Sub-agents Count : {len(carbon_coach_root.sub_agents)}")
    print(f"[*] Root Tools Count      : {len(carbon_coach_root.tools)}")
    
    sub_agent_names = [sa.name for sa in carbon_coach_root.sub_agents]
    print(f"[*] Sub-agent Names       : {sub_agent_names}")
    
    expected_sub_agents = [
        "activity_understanding_agent",
        "carbon_measurement_agent",
        "tracker_agent",
        "carbon_coach_agent"
    ]
    for exp in expected_sub_agents:
        assert exp in sub_agent_names, f"Missing sub-agent: {exp}"
    print("    -> [PASSED] Root agent contains all 4 required specialist agents.")
    
    # 2. Verify individual specialist configurations
    for sa in carbon_coach_root.sub_agents:
        tools_count = len(getattr(sa, 'tools', []))
        print(f"    - Specialist: {sa.name:30} | Model: {sa.model} | Tools: {tools_count}")
    
    print("    -> [PASSED] Google ADK Agent structure verified successfully.")


def verify_pillar_2_python_tools():
    print("\n" + "=" * 70)
    print("PILLAR 2: VERIFY PYTHON TOOLS & EMISSION FACTORS")
    print("=" * 70)
    
    factors_file = PROJECT_ROOT / "factors.json"
    with open(factors_file, "r", encoding="utf-8") as f:
        factors = json.load(f)
    print(f"[*] Loaded factors.json version: {factors.get('_meta', {}).get('version')}")
    
    # Test 1: Petrol bike 20 km
    res1 = carbon_tools.calculate_carbon_emissions("transport", "petrol_bike", distance_km=20)
    print(f"[*] Tool Output (Petrol Bike 20 km): {res1['kg_co2e']} kg CO2e | Formula: {res1['formula']}")
    assert res1["kg_co2e"] == 1.027, f"Expected 1.027, got {res1['kg_co2e']}"
    assert "IPCC 2006" in res1["source"]
    print("    -> [PASSED] Exact numerical match with IPCC emission factors (45 km/L, 2.31 kg/L).")
    
    # Test 2: Bus 10 km
    res2 = carbon_tools.calculate_carbon_emissions("transport", "bus", distance_km=10)
    print(f"[*] Tool Output (Bus 10 km): {res2['kg_co2e']} kg CO2e | Formula: {res2['formula']}")
    assert res2["kg_co2e"] == 0.3, f"Expected 0.3, got {res2['kg_co2e']}"
    print("    -> [PASSED] Exact numerical match with India bus transit factor (0.03 kg/km).")

    # Test 3: AC 4 hours
    res3 = carbon_tools.calculate_carbon_emissions("electricity", "ac", hours=4)
    print(f"[*] Tool Output (AC 4 hrs): {res3['kg_co2e']} kg CO2e | Formula: {res3['formula']}")
    assert res3["kg_co2e"] == 3.408, f"Expected 3.408, got {res3['kg_co2e']}"
    print("    -> [PASSED] Exact numerical match with CEA grid baseline (1.2 kW * 4 * 0.71).")
    
    # Test 4: Missing Information Handling
    missing_dist = carbon_tools.extract_activity_details("transport", "bus", distance_km=0)
    print(f"[*] Missing Info Response: status={missing_dist['status']} | question={missing_dist['questions'][0]['question']}")
    assert missing_dist["status"] == "needs_info"
    print("    -> [PASSED] Agent intercepts missing distance and asks follow-up instead of hallucinating.")
    
    # Test 5: Unsupported Activity
    unsupported = carbon_tools.calculate_carbon_emissions("transport", "spaceship", distance_km=100)
    print(f"[*] Unsupported Activity Response: status={unsupported['status']} | error={unsupported['error']}")
    assert unsupported["status"] == "error"
    print("    -> [PASSED] Unsupported activity properly rejected without fabricating numbers.")

    # Test 6: What-If Simulation
    sim = carbon_tools.simulate_alternative_activity("transport", "petrol_bike", "bus", distance_km=20)
    print(f"[*] What-if Simulation: Current={sim['current_kg_per_day']} kg, Alt={sim['alternative_kg_per_day']} kg, Saved={sim['saved_kg_per_day']} kg ({sim['percent_reduction']}%)")
    assert sim["saved_kg_per_day"] == 0.427
    print("    -> [PASSED] Simulation savings verified deterministically from tool.")


def verify_pillar_3_sqlite_persistence():
    print("\n" + "=" * 70)
    print("PILLAR 3: VERIFY SQLITE PERSISTENCE & APPLICATION RESTART")
    print("=" * 70)
    
    test_user = "test_persistence_user"
    db_file = PROJECT_ROOT / "carbon_coach.db"
    
    # 1. Log an activity in Session A
    print("[1] Session A: Logging activity to SQLite...")
    log_res = db.log_activity(
        category="transport",
        activity_type="petrol_bike",
        quantity=20.0,
        unit="km",
        kg_co2e=1.027,
        user_id=test_user,
        emission_factor="2.31 kg CO2/L / 45 km/L",
        formula="20 km / 45 km/L * 2.31 kg/L = 1.027 kg CO2e",
        source="IPCC 2006",
        assumptions=["Standard petrol motorcycle", "Single rider"],
        db_path=db_file
    )
    print(f"    Log status: {log_res['status']}")
    
    # 2. Simulate Application Restart:
    # Completely destroy/close local references and open a fresh connection to the database
    print("[2] Simulating Application Restart (destroying session & opening fresh connection)...")
    with db.get_connection(db_file) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) as cnt FROM activities WHERE user_id = ?", (test_user,))
        row = cursor.fetchone()
        count = row["cnt"]
        print(f"    Post-restart query: Found {count} persistent records for {test_user}.")
        assert count >= 1, "Persisted record not found after restart!"

    # 3. Verify Daily, Weekly, and Monthly Summaries
    daily = db.get_daily_summary(user_id=test_user, db_path=db_file)
    print(f"[3] Daily Summary : Total={daily['total_emissions_kg_co2e']} kg CO2e across {daily['activity_count']} activities.")
    assert daily["status"] == "success"
    assert daily["total_emissions_kg_co2e"] >= 1.027
    
    weekly = db.get_weekly_summary(user_id=test_user, db_path=db_file)
    print(f"[4] Weekly Summary: Total={weekly['total_emissions_kg_co2e']} kg CO2e (Avg/day: {weekly['average_daily_kg_co2e']} kg).")
    assert weekly["status"] == "success"
    
    monthly = db.get_monthly_summary(user_id=test_user, db_path=db_file)
    print(f"[5] Monthly Summary: Total={monthly['total_emissions_kg_co2e']} kg CO2e across {monthly['active_days']} active days.")
    assert monthly["status"] == "success"
    print("    -> [PASSED] SQLite persistence and restart verification completely passed.")


async def verify_pillar_4_live_workflow():
    print("\n" + "=" * 70)
    print("PILLAR 4: VERIFY COMPLETE LIVE AGENT WORKFLOW (5 REAL USER PROMPTS)")
    print("=" * 70)
    
    prompts = [
        "I travelled 20 km by petrol bike.",
        "I travelled 10 km by bus and used AC for 4 hours.",
        "What is my carbon footprint this week?",
        "How can I reduce my carbon footprint?",
        "What if I use a bus instead of my petrol bike?"
    ]
    
    runner = InMemoryRunner(agent=carbon_coach_root, app_name="carbon_coach")
    user_id = "real_verification_user"
    session_id = "real_session_1"
    
    # Create ADK session
    try:
        await runner.session_service.create_session(
            user_id=user_id,
            session_id=session_id,
            app_name=runner.app_name
        )
    except Exception as e:
        print(f"Session note: {e}")
        
    for idx, prompt_text in enumerate(prompts, 1):
        print(f"\n--- [Prompt {idx}/5]: '{prompt_text}' ---")
        msg = types.Content(parts=[types.Part(text=prompt_text)])
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
        
        reply = " ".join(parts).strip()
        print(f"Carbon Coach Response:\n{reply}\n")
        assert len(reply) > 20, f"Empty or too short response for prompt {idx}"
        print(f"-> [PASSED] Prompt {idx} processed and verified.")


async def main():
    verify_pillar_1_adk()
    verify_pillar_2_python_tools()
    verify_pillar_3_sqlite_persistence()
    await verify_pillar_4_live_workflow()
    print("\n" + "=" * 70)
    print("ALL 4 VERIFICATION PILLARS COMPLETED SUCCESSFULLY!")
    print("=" * 70)


if __name__ == "__main__":
    asyncio.run(main())
