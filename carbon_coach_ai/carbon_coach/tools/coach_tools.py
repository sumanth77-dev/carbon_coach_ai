"""
coach_tools.py - Google ADK tools for the Carbon Coach Agent (Phase 7).
Provides personalized reduction suggestions based on SQLite history and Python simulations.
"""

from carbon_coach.coach import recommendations


def get_personalized_recommendations(user_id: str = "default_user") -> dict:
    """Analyze a user's logged activity history in SQLite and calculate prioritized,
    actionable carbon reduction opportunities with verified emission savings.

    Args:
        user_id: User identifier.

    Returns:
        dict containing tailored recommendations, emissions before and after,
        potential kg CO2e savings, and percentage reductions calculated strictly by Python tools.
    """
    return recommendations.generate_recommendations(user_id=user_id)
