"""
tracker_agent.py - Tracker Agent (Phase 6).
Responsible for managing persistent SQLite carbon records, activity logging,
and generating daily, weekly, and monthly footprint summaries.
"""

import os
from dotenv import load_dotenv
from google.adk.agents import Agent
from google.adk.workflow._retry_config import RetryConfig
from carbon_coach.tools import tracker_tools

load_dotenv()


def get_model_name() -> str:
    m = os.getenv("ECOMATE_MODEL", "").strip()
    if m and m not in ("gemini-2.5-flash", "gemini-3.5-flash", "gemini-3.6-flash"):
        return m
    return "gemini-3.1-flash-lite"


TRACKER_INSTRUCTION = """You are the Tracker Agent for Carbon Coach.
Your primary role is to log verified carbon emission activities and provide historical summaries using persistent SQLite storage tools.

RESPONSIBILITIES:
1. Log verified activities: Call `log_activity_record` whenever a calculated activity needs to be recorded.
2. Answer daily summary queries ("How much CO2 did I emit today?", "Show my daily emissions"): Call `get_user_daily_summary`.
3. Answer weekly summary queries ("What is my weekly carbon footprint?", "Weekly summary"): Call `get_user_weekly_summary`.
4. Answer monthly summary queries ("What is my monthly footprint?", "Monthly summary"): Call `get_user_monthly_summary`.
5. Answer category breakdown queries ("Which category produces the most emissions?", "Category breakdown"): Call `get_user_category_breakdown`.
6. Answer history queries ("Show my previous activities", "List my activity log"): Call `get_user_activity_history`.

CRITICAL ACCURACY RULES:
- Never fabricate historical totals, counts, or dates.
- All numbers must come directly from tracker tool outputs.
- Clearly present totals in kg CO2e, active days, highest emission day, and category contributions.
"""

tracker_agent = Agent(
    name="tracker_agent",
    model=get_model_name(),
    description="Tracks daily carbon activities in SQLite, retrieves history, and computes daily, weekly, and monthly summaries.",
    instruction=TRACKER_INSTRUCTION,
    tools=[
        tracker_tools.log_activity_record,
        tracker_tools.get_user_activity_history,
        tracker_tools.get_user_daily_summary,
        tracker_tools.get_user_weekly_summary,
        tracker_tools.get_user_monthly_summary,
        tracker_tools.get_user_category_breakdown
    ],
    retry_config=RetryConfig(max_attempts=3, initial_delay=1.0, max_delay=8.0, backoff_factor=2.0)
)
