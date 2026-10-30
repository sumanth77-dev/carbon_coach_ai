"""
test_full_suite.py - Complete Evaluation Test Suite (Phase 9).
Tests all 16 required hackathon scenarios covering:
1. Petrol bike travel
2. Diesel car travel
3. Electricity consumption
4. AC usage
5. Food consumption
6. Multiple activities in one message
7. Missing activity information
8. Unsupported activity
9. Daily carbon summary
10. Weekly carbon summary
11. Monthly carbon summary
12. Activity history retrieval
13. Personalized recommendations
14. What-if simulation
15. Invalid inputs
16. Database errors
"""

import unittest
import tempfile
import os
import sys
from pathlib import Path

# Add project root to path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from carbon_coach.carbon import engine
from carbon_coach.tools import carbon_tools, tracker_tools, coach_tools
from carbon_coach.tracker import db
from carbon_coach.coach import recommendations
from carbon_coach.agent import carbon_coach_root


class TestFullHackathonSuite(unittest.TestCase):
    """Complete 16-Scenario Test Suite for Carbon Coach AI."""

    def setUp(self):
        # Create an isolated temporary SQLite database for each test run
        self.temp_db_file = tempfile.NamedTemporaryFile(delete=False, suffix=".db")
        self.temp_db_path = Path(self.temp_db_file.name)
        db.init_db(self.temp_db_path)

    def tearDown(self):
        try:
            self.temp_db_file.close()
            if self.temp_db_path.exists():
                os.remove(self.temp_db_path)
        except Exception:
            pass

    # SCENARIO 1: Petrol bike travel
    def test_01_petrol_bike_travel(self):
        res = carbon_tools.calculate_carbon_emissions("transport", "petrol_bike", distance_km=20)
        self.assertEqual(res["status"], "ok")
        # 20 km / 45 km/L * 2.31 kg/L = 1.0266... -> 1.027 kg CO2e
        self.assertEqual(res["kg_co2e"], 1.027)
        self.assertTrue(any("45 km/L" in a for a in res["assumptions"]))
        self.assertIn("IPCC 2006", res["source"])

    # SCENARIO 2: Diesel car travel
    def test_02_diesel_car_travel(self):
        res = carbon_tools.calculate_carbon_emissions("transport", "diesel_car", distance_km=36)
        self.assertEqual(res["status"], "ok")
        # 36 km / 18 km/L * 2.68 kg/L = 5.36 kg CO2e
        self.assertEqual(res["kg_co2e"], 5.36)
        self.assertTrue(any("18 km/L" in a for a in res["assumptions"]))
        self.assertIn("diesel", res["emission_factor"])

    # SCENARIO 3: Electricity consumption (e.g. Fan 10 hours)
    def test_03_electricity_consumption(self):
        res = carbon_tools.calculate_carbon_emissions("electricity", "fan", hours=10)
        self.assertEqual(res["status"], "ok")
        # 60 W = 0.06 kW * 10 h * 0.71 kg/kWh = 0.426 kg CO2e
        self.assertEqual(res["kg_co2e"], 0.426)
        self.assertTrue(any("60 W" in a for a in res["assumptions"]))
        self.assertIn("CEA CO2 Baseline", res["source"])

    # SCENARIO 4: AC usage
    def test_04_ac_usage(self):
        res = carbon_tools.calculate_carbon_emissions("electricity", "ac", hours=4)
        self.assertEqual(res["status"], "ok")
        # 1200 W = 1.2 kW * 4 h * 0.71 kg/kWh = 3.408 kg CO2e
        self.assertEqual(res["kg_co2e"], 3.408)
        self.assertTrue(any("1200 W" in a for a in res["assumptions"]))
        self.assertIn("follow_up", res)
        self.assertEqual(res["follow_up"]["field"], "tonnage")

    # SCENARIO 5: Food consumption (Chicken lunch vs Veg)
    def test_05_food_consumption(self):
        chicken = carbon_tools.calculate_carbon_emissions("food", "chicken", meals=1)
        self.assertEqual(chicken["status"], "ok")
        self.assertEqual(chicken["kg_co2e"], 1.2)
        self.assertIn("Poore & Nemecek", chicken["source"])

        mutton = carbon_tools.calculate_carbon_emissions("food", "mutton", meals=1)
        self.assertEqual(mutton["kg_co2e"], 3.6)

    # SCENARIO 6: Multiple activities in one message
    def test_06_multiple_activities(self):
        bus = carbon_tools.calculate_carbon_emissions("transport", "bus", distance_km=12)
        ac = carbon_tools.calculate_carbon_emissions("electricity", "ac", hours=4)
        food = carbon_tools.calculate_carbon_emissions("food", "chicken", meals=1)

        total_res = carbon_tools.calculate_total_footprint([bus["kg_co2e"], ac["kg_co2e"], food["kg_co2e"]])
        self.assertEqual(total_res["status"], "success")
        self.assertEqual(total_res["total_emissions_kg_co2e"], 4.968)
        self.assertEqual(total_res["activity_count"], 3)
        self.assertIn("0.36 kg + 3.408 kg + 1.2 kg = 4.968 kg CO2e", total_res["formula"])

    # SCENARIO 7: Missing activity information
    def test_07_missing_information(self):
        # Transport missing distance
        no_dist = carbon_tools.extract_activity_details("transport", "bus", distance_km=0)
        self.assertEqual(no_dist["status"], "needs_info")
        self.assertEqual(no_dist["questions"][0]["field"], "distance_km")

        # Electricity missing hours
        no_hours = carbon_tools.extract_activity_details("electricity", "ac", hours=0)
        self.assertEqual(no_hours["status"], "needs_info")
        self.assertEqual(no_hours["questions"][0]["field"], "hours")

    # SCENARIO 8: Unsupported activity
    def test_08_unsupported_activity(self):
        res = carbon_tools.calculate_carbon_emissions("transport", "spaceship", distance_km=500)
        self.assertEqual(res["status"], "error")
        self.assertIn("Unknown transport type: spaceship", res["error"])

    # SCENARIO 9: Daily carbon summary
    def test_09_daily_carbon_summary(self):
        db.log_activity("transport", "bus", 10, "km", 0.30, user_id="u1", db_path=self.temp_db_path)
        db.log_activity("electricity", "light", 5, "hours", 0.032, user_id="u1", db_path=self.temp_db_path)
        
        daily = db.get_daily_summary(user_id="u1", db_path=self.temp_db_path)
        self.assertEqual(daily["status"], "success")
        self.assertEqual(daily["activity_count"], 2)
        self.assertEqual(daily["total_emissions_kg_co2e"], 0.332)
        self.assertIn("transport", daily["category_breakdown"])

    # SCENARIO 10: Weekly carbon summary
    def test_10_weekly_carbon_summary(self):
        db.log_activity("transport", "bus", 10, "km", 0.30, user_id="u1", db_path=self.temp_db_path)
        db.log_activity("food", "chicken", 1, "meals", 1.20, user_id="u1", db_path=self.temp_db_path)
        
        weekly = db.get_weekly_summary(user_id="u1", db_path=self.temp_db_path)
        self.assertEqual(weekly["status"], "success")
        self.assertEqual(weekly["total_emissions_kg_co2e"], 1.50)
        self.assertTrue(weekly["average_daily_kg_co2e"] > 0)

    # SCENARIO 11: Monthly carbon summary
    def test_11_monthly_carbon_summary(self):
        db.log_activity("electricity", "ac", 4, "hours", 3.408, user_id="u1", db_path=self.temp_db_path)
        monthly = db.get_monthly_summary(user_id="u1", db_path=self.temp_db_path)
        self.assertEqual(monthly["status"], "success")
        self.assertEqual(monthly["total_emissions_kg_co2e"], 3.408)
        self.assertEqual(monthly["active_days"], 1)

    # SCENARIO 12: Activity history retrieval
    def test_12_activity_history_retrieval(self):
        db.log_activity("transport", "bus", 12, "km", 0.36, user_id="u_hist", db_path=self.temp_db_path)
        db.log_activity("food", "chicken", 1, "meals", 1.20, user_id="u_hist", db_path=self.temp_db_path)
        
        hist = db.get_activity_history(user_id="u_hist", limit=10, db_path=self.temp_db_path)
        self.assertEqual(hist["status"], "success")
        self.assertEqual(hist["count"], 2)
        self.assertEqual(hist["total_emissions_kg_co2e"], 1.56)

    # SCENARIO 13: Personalized recommendations
    def test_13_personalized_recommendations(self):
        # Log frequent petrol bike trips
        for _ in range(3):
            db.log_activity("transport", "petrol_bike", 20, "km", 1.027, user_id="u_rec", db_path=self.temp_db_path)
            
        recs = recommendations.generate_recommendations(user_id="u_rec", db_path=self.temp_db_path)
        self.assertEqual(recs["status"], "success")
        self.assertTrue(recs["recommendation_count"] > 0)
        first_rec = recs["recommendations"][0]
        self.assertEqual(first_rec["category"], "transport")
        self.assertIn("Bus", first_rec["title"])
        self.assertEqual(first_rec["potential_savings_kg_co2e"], 0.427)

    # SCENARIO 14: What-if simulation
    def test_14_what_if_simulation(self):
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

    # SCENARIO 15: Invalid inputs
    def test_15_invalid_inputs(self):
        # Negative distance
        neg = carbon_tools.calculate_carbon_emissions("transport", "bus", distance_km=-10)
        self.assertEqual(neg["status"], "needs_info")

        # Unknown category
        bad_cat = carbon_tools.calculate_carbon_emissions("crypto_mining", "bitcoin", hours=5)
        self.assertEqual(bad_cat["status"], "error")
        self.assertIn("Unknown category", bad_cat["error"])

    # SCENARIO 16: Database error handling & duplicate prevention
    def test_16_database_reliability_and_duplicates(self):
        # 1. Log an activity
        first = db.log_activity("transport", "bus", 15, "km", 0.45, user_id="u_dup", db_path=self.temp_db_path)
        self.assertEqual(first["status"], "success")

        # 2. Immediate duplicate attempt within 60s
        dup = db.log_activity("transport", "bus", 15, "km", 0.45, user_id="u_dup", db_path=self.temp_db_path)
        self.assertEqual(dup["status"], "duplicate_skipped")

        # 3. Invalid negative emission
        bad = db.log_activity("transport", "bus", 15, "km", -5.0, user_id="u_dup", db_path=self.temp_db_path)
        self.assertEqual(bad["status"], "error")


if __name__ == "__main__":
    unittest.main()
