"""
Top-level agent.py wrapper for backward compatibility.
Exports carbon_coach_root, root_agent, activity_understanding_agent,
carbon_measurement_agent, tracker_agent, and carbon_coach_agent.
"""
from carbon_coach.agent import carbon_coach_root, root_agent
from carbon_coach.agents.activity_agent import activity_understanding_agent
from carbon_coach.agents.measurement_agent import carbon_measurement_agent
from carbon_coach.agents.tracker_agent import tracker_agent
from carbon_coach.agents.coach_agent import carbon_coach_agent

__all__ = [
    "carbon_coach_root",
    "root_agent",
    "activity_understanding_agent",
    "carbon_measurement_agent",
    "tracker_agent",
    "carbon_coach_agent"
]
