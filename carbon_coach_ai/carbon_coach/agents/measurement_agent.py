"""
measurement_agent.py - Carbon Measurement Agent (Phase 2 & Phase 5)
Responsible for executing deterministic Python carbon calculation tools,
explaining formulas, retrieving emission factors, and simulating what-if alternatives.
"""
import os
from dotenv import load_dotenv
from google.adk.agents import Agent
from google.adk.workflow._retry_config import RetryConfig
from carbon_coach.tools import carbon_tools

load_dotenv()


def get_model_name() -> str:
    m = os.getenv("ECOMATE_MODEL", "").strip()
    if m and m not in ("gemini-2.5-flash", "gemini-3.5-flash", "gemini-3.6-flash"):
        return m
    return "gemini-3.1-flash-lite"


MEASUREMENT_INSTRUCTION = """You are the Carbon Measurement Agent for Carbon Coach.
Your primary role is to calculate exact carbon emissions (kg CO2e) and evaluate what-if reduction alternatives using Python calculation tools.

CRITICAL ACCURACY RULES:
1. Gemini must NEVER calculate, estimate, or invent carbon emission numbers or savings independently.
2. Every numerical emission figure must come directly from tool outputs.
3. For individual activities, always call `calculate_carbon_emissions`.
4. When calculating emissions for multiple activities, collect all individual `kg_co2e` values and call `calculate_total_footprint` to compute the deterministic sum in Python.
5. For what-if comparisons (e.g., "What if I take the bus instead of petrol bike for 20 km?"), call `simulate_alternative_activity` and report the exact savings, percent reduction, monthly and yearly kg CO2e saved from the tool.
6. For emission factors or source questions, call `get_emission_factors`.
7. Always disclose:
   - Calculated emissions (kg CO2e)
   - Emission factor used and its unit
   - Cited source of the emission factor
   - Any assumptions applied (e.g. default vehicle mileage, typical appliance wattage)
   - Data quality (calculated vs estimated)
8. If an activity is missing required info or returns an error, do not fabricate results.
"""

carbon_measurement_agent = Agent(
    name="carbon_measurement_agent",
    model=get_model_name(),
    description="Calculates deterministic carbon emissions (kg CO2e), discloses formulas and sources, and runs what-if simulations.",
    instruction=MEASUREMENT_INSTRUCTION,
    tools=[
        carbon_tools.calculate_carbon_emissions,
        carbon_tools.calculate_total_footprint,
        carbon_tools.get_emission_factors,
        carbon_tools.simulate_alternative_activity
    ],
    retry_config=RetryConfig(max_attempts=3, initial_delay=1.0, max_delay=8.0, backoff_factor=2.0)
)
