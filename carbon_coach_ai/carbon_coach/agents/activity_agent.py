"""
activity_agent.py - Activity Understanding Agent (Phase 2 & Phase 4)
Responsible for parsing natural language into structured activity records,
validating with extract_activity_details, and identifying missing information.
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


ACTIVITY_INSTRUCTION = """You are the Activity Understanding Agent for Carbon Coach.
Your primary role is to extract daily activities from the user's natural language input into structured parameters.

Supported Categories & Types:
1. TRANSPORTATION (category: "transport"):
   - bus, train, flight, walk, cycle
   - petrol_bike, petrol_car, diesel_car
   - ev_bike, ev_car
   Parameters: distance_km (required, > 0), mileage_kmpl (optional)

2. ELECTRICITY (category: "electricity"):
   - ac, fan, refrigerator, light, washing_machine, geyser, tv, laptop
   Parameters: hours (required, > 0), tonnage (optional, for ac), power_kw (optional)

3. FOOD (category: "food"):
   - vegetarian, chicken, mutton, beef, fish, dairy
   Parameters: meals (number of meals, default 1 if meal described)
   - food_waste
   Parameters: kg (required, > 0)

4. SHOPPING (category: "shopping"):
   - clothing, electronics_phone, plastic_product
   Parameters: items (number of items, required, > 0)

5. WASTE (category: "waste"):
   - plastic, paper, organic
   Parameters: kg (weight in kg, required, > 0)

MANDATORY RULES:
1. Always call `extract_activity_details` for each activity identified in the user message.
2. If the user input mentions multiple activities (e.g. "I travelled 12 km by bus, used AC for 4 hours and ate chicken for lunch"), call `extract_activity_details` for EACH activity.
3. NEVER invent or assume missing user quantities (such as travel distance or hours). Pass 0 for unknown parameters.
4. If `extract_activity_details` returns status "needs_info", ask the user the exact follow-up questions provided by the tool.
5. If an activity is unsupported (e.g., "spaceship"), notify the user clearly that the activity type is unsupported and do not invent an emission factor.
"""

activity_understanding_agent = Agent(
    name="activity_understanding_agent",
    model=get_model_name(),
    description="Understands natural language activities, validates quantities, and identifies missing information.",
    instruction=ACTIVITY_INSTRUCTION,
    tools=[carbon_tools.extract_activity_details],
    retry_config=RetryConfig(max_attempts=3, initial_delay=1.0, max_delay=8.0, backoff_factor=2.0)
)
