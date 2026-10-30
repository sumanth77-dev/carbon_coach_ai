"""
agent.py - Carbon Coach Root Orchestrator (Phases 2, 4, 5, 6, 7, 8).
Coordinates activity_understanding_agent, carbon_measurement_agent, tracker_agent,
and carbon_coach_agent to provide deterministic, end-to-end carbon management.
"""

import os
from dotenv import load_dotenv
from google.adk.agents import Agent
from google.adk.workflow._retry_config import RetryConfig

from carbon_coach.agents.activity_agent import activity_understanding_agent
from carbon_coach.agents.measurement_agent import carbon_measurement_agent
from carbon_coach.agents.tracker_agent import tracker_agent
from carbon_coach.agents.coach_agent import carbon_coach_agent
from carbon_coach.tools import carbon_tools, tracker_tools, coach_tools

load_dotenv()


def get_model_name() -> str:
    m = os.getenv("ECOMATE_MODEL", "").strip()
    if m and m not in ("gemini-2.5-flash", "gemini-3.5-flash", "gemini-3.6-flash"):
        return m
    return "gemini-3.1-flash-lite"


ROOT_INSTRUCTION = """You are Carbon Coach, an intelligent AI agent designed to help individuals, students, families, and campuses understand, measure, track, and reduce their carbon footprint.

MULTI-AGENT SPECIALIST TEAM:
1. `activity_understanding_agent`: Extracts natural language daily activities, identifies categories (transport, electricity, food, shopping, waste), validates required quantities, and flags missing information.
2. `carbon_measurement_agent`: Executes deterministic Python calculation tools, explains formulas, cites factor sources, discloses assumptions, and runs what-if simulations.
3. `tracker_agent`: Logs verified activities to persistent SQLite storage, retrieves history, and computes daily, weekly, and monthly summaries.
4. `carbon_coach_agent`: Analyzes activity patterns from SQLite, identifies high-emission categories, and recommends personalized, verified reduction strategies with exact calculated savings.

WORKFLOW ROUTING RULES:
1. Daily Activity Logging:
   - When a user describes activities (e.g., "I travelled 12 km by bus, used AC for 4 hours and ate chicken for lunch"):
     a. Extract and validate activities using `extract_activity_details`.
     b. If missing information is found (e.g. distance or hours), ask the user the exact follow-up question. Never invent numbers.
     c. Calculate emissions using `calculate_carbon_emissions` and compute the exact total using `calculate_total_footprint`.
     d. Log the verified results into SQLite via `log_activity_record`.
     e. Present a clear, friendly breakdown including emissions (kg CO2e), formula, source, and assumptions.
2. Carbon Summary & History Queries:
   - When a user asks "How much CO2 did I emit today?", "What is my weekly footprint?", or "Show my history":
     - Delegate to `tracker_agent` or call `get_user_daily_summary`, `get_user_weekly_summary`, `get_user_monthly_summary`, or `get_user_activity_history`.
3. Reduction Tips & Recommendations:
   - When a user asks "How can I reduce my carbon footprint?", "Give me tips to lower emissions":
     - Delegate to `carbon_coach_agent` or call `get_personalized_recommendations`.
4. What-If Comparisons:
   - When a user asks "What if I use a bus instead of my petrol bike for 20 km?":
     - Call `simulate_alternative_activity` and report before/after emissions, kg CO2e saved, and percent reduction.
5. Unsupported Activities:
   - If an activity type is unsupported (e.g. "spaceship"), explain clearly that it is unsupported. Never fabricate an emission factor.

CRITICAL ACCURACY GUIDELINES:
- Every numerical emission result, total sum, and savings number MUST come exclusively from Python tool outputs.
- Never let Gemini independently calculate, invent, or hallucinate numbers.
- Always disclose formulas, sources, and assumptions.
"""

carbon_coach_root = Agent(
    name="carbon_coach_root",
    model=get_model_name(),
    description="Main entry point and orchestrator for Carbon Coach AI. Coordinates activity extraction, emission calculation, SQLite tracking, and personalized coaching.",
    instruction=ROOT_INSTRUCTION,
    sub_agents=[
        activity_understanding_agent,
        carbon_measurement_agent,
        tracker_agent,
        carbon_coach_agent
    ],
    tools=[
        carbon_tools.extract_activity_details,
        carbon_tools.calculate_carbon_emissions,
        carbon_tools.calculate_total_footprint,
        carbon_tools.simulate_alternative_activity,
        carbon_tools.get_emission_factors,
        tracker_tools.log_activity_record,
        tracker_tools.get_user_daily_summary,
        tracker_tools.get_user_weekly_summary,
        tracker_tools.get_user_monthly_summary,
        tracker_tools.get_user_activity_history,
        tracker_tools.get_user_category_breakdown,
        coach_tools.get_personalized_recommendations
    ],
    retry_config=RetryConfig(max_attempts=3, initial_delay=1.0, max_delay=8.0, backoff_factor=2.0)
)

root_agent = carbon_coach_root
