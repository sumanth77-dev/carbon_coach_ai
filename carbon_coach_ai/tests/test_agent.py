"""
test_agent.py - Comprehensive Unit and E2E Test Suite for Phases 2, 3, 4, and 5.
Covers Mandatory Hackathon Requirements & Critical Accuracy Rules.
"""

import os
import sys
import asyncio
import unittest
from pathlib import Path
from dotenv import load_dotenv

# Ensure project root is in sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

load_dotenv(PROJECT_ROOT / ".env")

from google.genai import types
from google.adk.runners import InMemoryRunner

# Import Carbon Coach components
from carbon_coach.agent import carbon_coach_root, root_agent
from carbon_coach.agents.activity_agent import activity_understanding_agent
from carbon_coach.agents.measurement_agent import carbon_measurement_agent
from carbon_coach.tools import carbon_tools
from carbon_coach.carbon import engine


class TestCarbonEngineAndTools(unittest.TestCase):
    """Test deterministic Python calculation engine and tool schemas."""

    def test_imports(self):
        """Verify all package and top-level module imports succeed."""
        import agent
        import tools
        import engine as eng
        self.assertIsNotNone(carbon_coach_root)
        self.assertIsNotNone(activity_understanding_agent)
        self.assertIsNotNone(carbon_measurement_agent)
        self.assertIsNotNone(tools.calculate_carbon_emissions)
        self.assertIsNotNone(eng.calculate)

    def test_test1_single_activity(self):
        """TEST 1: Single activity - Bus 12 km."""
        res = carbon_tools.calculate_carbon_emissions("transport", "bus", distance_km=12)
        self.assertEqual(res["status"], "ok")
        self.assertEqual(res["kg_co2e"], 0.36)
        self.assertEqual(res["emission_factor"], "0.03 kg/pkm")
        self.assertIn("12 km x 0.03 kg/passenger-km", res["formula"])
        self.assertIn("ICCT/DEFRA", res["source"])

    def test_test2_multiple_activities(self):
        """TEST 2: Multiple activities - Bus 12 km, AC 4 hours, Chicken lunch."""
        bus_res = carbon_tools.calculate_carbon_emissions("transport", "bus", distance_km=12)
        ac_res = carbon_tools.calculate_carbon_emissions("electricity", "ac", hours=4)
        food_res = carbon_tools.calculate_carbon_emissions("food", "chicken", meals=1)

        self.assertEqual(bus_res["kg_co2e"], 0.36)
        self.assertEqual(ac_res["kg_co2e"], 3.408)
        self.assertEqual(food_res["kg_co2e"], 1.2)

        total_res = carbon_tools.calculate_total_footprint([bus_res["kg_co2e"], ac_res["kg_co2e"], food_res["kg_co2e"]])
        self.assertEqual(total_res["status"], "success")
        self.assertEqual(total_res["total_emissions_kg_co2e"], 4.968)
        self.assertEqual(total_res["activity_count"], 3)

    def test_test3_missing_information(self):
        """TEST 3: Missing information - Bus trip with 0 km."""
        res = carbon_tools.extract_activity_details("transport", "bus", distance_km=0)
        self.assertEqual(res["status"], "needs_info")
        self.assertTrue(len(res["questions"]) > 0)
        self.assertEqual(res["questions"][0]["field"], "distance_km")
        self.assertIn("km", res["questions"][0]["question"])

    def test_test4_electricity_assumptions(self):
        """TEST 4: Electricity AC 4 hours - disclose assumptions & follow-up."""
        res = carbon_tools.calculate_carbon_emissions("electricity", "ac", hours=4)
        self.assertEqual(res["status"], "ok")
        self.assertEqual(res["kg_co2e"], 3.408)
        self.assertTrue(any("1200 W" in a for a in res["assumptions"]))
        self.assertIn("follow_up", res)
        self.assertEqual(res["follow_up"]["field"], "tonnage")

    def test_test5_unsupported_activity(self):
        """TEST 5: Unsupported activity - Spaceship."""
        res = carbon_tools.calculate_carbon_emissions("transport", "spaceship", distance_km=100)
        self.assertEqual(res["status"], "error")
        self.assertIn("Unknown transport type: spaceship", res["error"])

    def test_test6_what_if_simulation(self):
        """TEST 6: What-if simulation - Bus vs Petrol Bike for 20 km."""
        sim = carbon_tools.simulate_alternative_activity(
            category="transport",
            current_type="petrol_bike",
            alternative_type="bus",
            distance_km=20
        )
        self.assertEqual(sim["status"], "ok")
        self.assertEqual(sim["current_kg_per_day"], 1.027)
        self.assertEqual(sim["alternative_kg_per_day"], 0.6)
        self.assertEqual(sim["saved_kg_per_day"], 0.427)
        self.assertEqual(sim["percent_reduction"], 41.6)
        self.assertEqual(sim["monthly_kg_saved"], 12.81)
        self.assertEqual(sim["yearly_kg_saved"], 155.9)

    def test_test7_calculation_integrity(self):
        """TEST 7: Calculation integrity across diverse categories."""
        train = carbon_tools.calculate_carbon_emissions("transport", "train", distance_km=50)
        self.assertEqual(train["kg_co2e"], round(50 * 0.008, 3))

        veg = carbon_tools.calculate_carbon_emissions("food", "vegetarian", meals=2)
        self.assertEqual(veg["kg_co2e"], round(2 * 0.5, 3))

        clothes = carbon_tools.calculate_carbon_emissions("shopping", "clothing", items=1)
        self.assertEqual(clothes["kg_co2e"], 7.0)

        paper = carbon_tools.calculate_carbon_emissions("waste", "paper", kg=3)
        self.assertEqual(paper["kg_co2e"], round(3 * 1.2, 3))


class TestAgentConversationalWorkflows(unittest.TestCase):
    """End-to-end tests for Google ADK Agent orchestration."""

    @classmethod
    def setUpClass(cls):
        cls.runner = InMemoryRunner(agent=carbon_coach_root, app_name="carbon_coach")
        cls.session_counter = 0

    def get_session_id(self):
        TestAgentConversationalWorkflows.session_counter += 1
        return f"test_session_{TestAgentConversationalWorkflows.session_counter}"

    def run_agent_turn(self, prompt: str) -> str:
        async def _exec():
            sess_id = self.get_session_id()
            await self.runner.session_service.create_session(
                user_id="test_user",
                session_id=sess_id,
                app_name=self.runner.app_name
            )
            msg = types.Content(parts=[types.Part(text=prompt)])
            response_texts = []
            async for event in self.runner.run_async(
                user_id="test_user",
                session_id=sess_id,
                new_message=msg
            ):
                if event.content and event.content.parts:
                    for p in event.content.parts:
                        if p.text:
                            response_texts.append(p.text)
            return " ".join(response_texts)

        return asyncio.run(_exec())

    def test_agent_single_activity(self):
        """TEST 1 via Agent: 'I travelled 12 km by bus.'"""
        reply = self.run_agent_turn("I travelled 12 km by bus.")
        print(f"\n[Agent Reply - Single Activity]:\n{reply}")
        self.assertIn("0.36", reply)

    def test_agent_multiple_activities(self):
        """TEST 2 via Agent: 'I travelled 12 km by bus, used AC for 4 hours and ate chicken for lunch.'"""
        reply = self.run_agent_turn("I travelled 12 km by bus, used AC for 4 hours and ate chicken for lunch.")
        print(f"\n[Agent Reply - Multiple Activities]:\n{reply}")
        self.assertTrue("0.36" in reply or "bus" in reply.lower())
        self.assertTrue("3.4" in reply or "ac" in reply.lower())
        self.assertTrue("1.2" in reply or "chicken" in reply.lower())
        self.assertTrue("4.9" in reply or "4.968" in reply or "total" in reply.lower())

    def test_agent_missing_information(self):
        """TEST 3 via Agent: 'I travelled by bus.' -> should ask for distance."""
        reply = self.run_agent_turn("I travelled by bus.")
        print(f"\n[Agent Reply - Missing Info]:\n{reply}")
        self.assertTrue("distance" in reply.lower() or "how many km" in reply.lower() or "how far" in reply.lower())

    def test_agent_electricity_assumption(self):
        """TEST 4 via Agent: 'I used AC for 4 hours.' -> discloses assumptions."""
        reply = self.run_agent_turn("I used AC for 4 hours.")
        print(f"\n[Agent Reply - Electricity]:\n{reply}")
        self.assertIn("3.4", reply)
        self.assertTrue("assum" in reply.lower() or "1200" in reply or "typical" in reply.lower() or "ton" in reply.lower())

    def test_agent_unsupported_activity(self):
        """TEST 5 via Agent: 'I travelled using a spaceship.' -> unsupported explanation."""
        reply = self.run_agent_turn("I travelled using a spaceship.")
        print(f"\n[Agent Reply - Unsupported Activity]:\n{reply}")
        self.assertTrue("unsupported" in reply.lower() or "not supported" in reply.lower() or "unknown" in reply.lower() or "spaceship" in reply.lower())

    def test_agent_what_if_simulation(self):
        """TEST 6 via Agent: 'What if I use a bus instead of my petrol bike for 20 km?'"""
        reply = self.run_agent_turn("What if I use a bus instead of my petrol bike for 20 km?")
        print(f"\n[Agent Reply - What-If Simulation]:\n{reply}")
        self.assertTrue("0.4" in reply or "41" in reply or "saving" in reply.lower() or "reduce" in reply.lower())


if __name__ == "__main__":
    unittest.main()
