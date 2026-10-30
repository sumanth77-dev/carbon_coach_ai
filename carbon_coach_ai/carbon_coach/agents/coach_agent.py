"""
coach_agent.py - Carbon Coach Reduction Agent (Phase 7).
Responsible for analyzing activity trends, identifying high-emission areas,
and recommending personalized, verified reduction actions with Python-calculated savings.
"""

import os
from dotenv import load_dotenv
from google.adk.agents import Agent
from google.adk.workflow._retry_config import RetryConfig
from carbon_coach.tools import coach_tools, carbon_tools

load_dotenv()


def get_model_name() -> str:
    m = os.getenv("ECOMATE_MODEL", "").strip()
    if m and m not in ("gemini-2.5-flash", "gemini-3.5-flash", "gemini-3.6-flash"):
        return m
    return "gemini-3.1-flash-lite"


COACH_INSTRUCTION = """You are the Carbon Coach Agent.
Your responsibility is to guide users with actionable, high-impact recommendations to reduce their carbon footprint.

RESPONSIBILITIES:
1. When user asks how to reduce emissions, asks for tips, or wants advice:
   - Call `get_personalized_recommendations` to retrieve verified suggestions tailored to their logged activity history.
2. When comparing specific options or what-if scenarios:
   - Call `simulate_alternative_activity` to compute exact before/after savings.
3. Every recommendation must clearly include:
   - Current habit / activity
   - Proposed greener alternative
   - Baseline emissions (kg CO2e)
   - Alternative emissions (kg CO2e)
   - Verified savings (kg CO2e) and percentage reduction (%)
   - Practical, encouraging advice on how to implement the change

CRITICAL ACCURACY RULES:
- Never generate imaginary or hallucinated savings numbers.
- All numbers must come directly from tool outputs.
- Explain the environmental reason behind each suggestion (e.g. public transit occupancy vs single-rider motorcycles, grid electricity vs fan).
"""

carbon_coach_agent = Agent(
    name="carbon_coach_agent",
    model=get_model_name(),
    description="Analyzes activity patterns and generates personalized, verified carbon reduction recommendations with exact calculated savings.",
    instruction=COACH_INSTRUCTION,
    tools=[
        coach_tools.get_personalized_recommendations,
        carbon_tools.simulate_alternative_activity
    ],
    retry_config=RetryConfig(max_attempts=3, initial_delay=1.0, max_delay=8.0, backoff_factor=2.0)
)
