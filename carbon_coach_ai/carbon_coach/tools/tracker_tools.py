"""
tracker_tools.py - Google ADK tools for the Tracker Agent (Phase 6).
Plain typed Python functions with docstrings for activity logging and summaries.
"""

from typing import Optional, List
from carbon_coach.tracker import db


def log_activity_record(
    category: str,
    activity_type: str,
    quantity: float,
    unit: str,
    kg_co2e: float,
    user_id: str = "default_user",
    emission_factor: str = "",
    formula: str = "",
    source: str = ""
) -> dict:
    """Log a verified carbon emission activity record into persistent SQLite storage.

    Args:
        category: Activity category (transport, electricity, food, shopping, waste).
        activity_type: Specific activity name (e.g. bus, petrol_bike, ac, chicken).
        quantity: Numerical amount (km, hours, meals, items, kg).
        unit: Unit of measurement (km, hours, meals, items, kg).
        kg_co2e: Exact calculated emissions in kg CO2e from Python tools.
        user_id: User identifier (default 'default_user').
        emission_factor: Factor string used in calculation.
        formula: Explanation formula.
        source: Cited factor database source.

    Returns:
        dict with status, activity_id, and confirmation message.
    """
    return db.log_activity(
        category=category,
        activity_type=activity_type,
        quantity=quantity,
        unit=unit,
        kg_co2e=kg_co2e,
        user_id=user_id,
        emission_factor=emission_factor,
        formula=formula,
        source=source
    )


def get_user_activity_history(user_id: str = "default_user", limit: int = 15) -> dict:
    """Retrieve historical carbon activity records for a user from SQLite storage.

    Args:
        user_id: User identifier.
        limit: Maximum number of recent records to return (default 15).

    Returns:
        dict with count, total emissions, and list of historical activity records.
    """
    return db.get_activity_history(user_id=user_id, limit=limit)


def get_user_daily_summary(user_id: str = "default_user", target_date: str = "") -> dict:
    """Retrieve total carbon emissions and activity breakdown for a specific date or today.

    Args:
        user_id: User identifier.
        target_date: Optional date string in YYYY-MM-DD format (empty string for today).

    Returns:
        dict with date, activity_count, total_emissions_kg_co2e, and category_breakdown.
    """
    return db.get_daily_summary(user_id=user_id, target_date=target_date or None)


def get_user_weekly_summary(user_id: str = "default_user") -> dict:
    """Retrieve weekly carbon footprint summary (past 7 days) with daily trend and category breakdown.

    Args:
        user_id: User identifier.

    Returns:
        dict with total_emissions_kg_co2e, average_daily_kg_co2e, highest_day, and category_breakdown.
    """
    return db.get_weekly_summary(user_id=user_id)


def get_user_monthly_summary(user_id: str = "default_user") -> dict:
    """Retrieve monthly carbon footprint summary (past 30 days) with trends and category breakdown.

    Args:
        user_id: User identifier.

    Returns:
        dict with total_emissions_kg_co2e, average_daily_kg_co2e, active_days, and category_breakdown.
    """
    return db.get_monthly_summary(user_id=user_id)


def get_user_category_breakdown(user_id: str = "default_user", days: int = 30) -> dict:
    """Retrieve carbon emission percentage breakdown by category over the specified timeframe.

    Args:
        user_id: User identifier.
        days: Timeframe in days (default 30).

    Returns:
        dict with category breakdown percentages and total emissions.
    """
    return db.get_category_breakdown(user_id=user_id, days=days)
