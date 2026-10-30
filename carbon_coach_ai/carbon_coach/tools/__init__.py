"""
Google ADK tools package for Carbon Coach.
"""
from carbon_coach.tools.carbon_tools import (
    extract_activity_details,
    calculate_carbon_emissions,
    get_emission_factors,
    simulate_alternative_activity,
    calculate_total_footprint
)

__all__ = [
    "extract_activity_details",
    "calculate_carbon_emissions",
    "get_emission_factors",
    "simulate_alternative_activity",
    "calculate_total_footprint"
]
