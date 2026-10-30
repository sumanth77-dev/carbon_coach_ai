"""
db.py - SQLite Persistence Layer for Carbon Coach Activity Tracking (Phase 6).
Provides persistent activity storage, duplicate prevention, and historical summaries.
"""

import sqlite3
import uuid
import json
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional, List, Dict, Any

DEFAULT_DB_PATH = Path(__file__).resolve().parent.parent.parent / "carbon_coach.db"


def get_connection(db_path: Optional[Path] = None) -> sqlite3.Connection:
    path = db_path or DEFAULT_DB_PATH
    conn = sqlite3.connect(str(path))
    conn.row_factory = sqlite3.Row
    return conn


def init_db(db_path: Optional[Path] = None) -> None:
    """Initialize SQLite database tables and indexes."""
    with get_connection(db_path) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS activities (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                activity_id TEXT UNIQUE NOT NULL,
                user_id TEXT NOT NULL,
                session_id TEXT,
                category TEXT NOT NULL,
                activity_type TEXT NOT NULL,
                quantity REAL NOT NULL,
                unit TEXT NOT NULL,
                kg_co2e REAL NOT NULL,
                emission_factor TEXT,
                formula TEXT,
                source TEXT,
                assumptions TEXT,
                data_quality TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_user_created ON activities(user_id, created_at)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_category ON activities(category)")
        conn.commit()


def canonicalize_category(category: str) -> str:
    """Map any category variation into a strict standard taxonomy."""
    c = (category or "").lower().strip()
    if c in ("transport", "transportation", "transit", "commute", "travel"):
        return "transportation"
    if c in ("electricity", "energy", "power", "utility"):
        return "electricity"
    if c in ("food", "diet", "meal", "groceries"):
        return "food"
    if c in ("waste", "trash", "garbage", "recycling"):
        return "waste"
    if c in ("shopping", "goods", "purchases"):
        return "shopping"
    return c or "general"


def log_activity(
    category: str,
    activity_type: str,
    quantity: float,
    unit: str,
    kg_co2e: float,
    user_id: str = "default_user",
    session_id: Optional[str] = None,
    emission_factor: str = "",
    formula: str = "",
    source: str = "",
    assumptions: Optional[List[str]] = None,
    data_quality: str = "calculated",
    db_path: Optional[Path] = None
) -> Dict[str, Any]:
    """Store a valid calculated carbon activity record into SQLite.
    Prevents duplicate submissions within a short window.
    """
    init_db(db_path)
    if kg_co2e is None or float(kg_co2e) < 0:
        return {"status": "error", "error": "Invalid kg_co2e emission value."}

    norm_category = canonicalize_category(category)
    assumptions_str = json.dumps(assumptions or [])
    act_id = str(uuid.uuid4())

    with get_connection(db_path) as conn:
        cursor = conn.cursor()
        
        # Check for duplicate entry within the last 60 seconds
        cursor.execute("""
            SELECT activity_id, created_at FROM activities
            WHERE user_id = ? AND category = ? AND activity_type = ? AND quantity = ?
            AND datetime(created_at) >= datetime('now', '-60 seconds')
            LIMIT 1
        """, (user_id, norm_category, activity_type.lower().strip(), float(quantity)))
        
        existing = cursor.fetchone()
        if existing:
            return {
                "status": "duplicate_skipped",
                "message": "Activity already logged moments ago; skipped to prevent duplicate counting.",
                "activity_id": existing["activity_id"]
            }

        cursor.execute("""
            INSERT INTO activities (
                activity_id, user_id, session_id, category, activity_type,
                quantity, unit, kg_co2e, emission_factor, formula,
                source, assumptions, data_quality
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            act_id, user_id, session_id or "session_1",
            norm_category, activity_type.lower().strip(),
            float(quantity), unit.strip(), round(float(kg_co2e), 3),
            str(emission_factor), str(formula), str(source),
            assumptions_str, data_quality
        ))
        conn.commit()

    return {
        "status": "success",
        "activity_id": act_id,
        "category": norm_category,
        "activity_type": activity_type,
        "quantity": quantity,
        "unit": unit,
        "kg_co2e": round(float(kg_co2e), 3),
        "message": f"Successfully logged {kg_co2e:.3f} kg CO2e for {activity_type}."
    }


def get_activity_history(
    user_id: str = "default_user",
    limit: int = 50,
    db_path: Optional[Path] = None
) -> Dict[str, Any]:
    """Retrieve historical activity records for a user."""
    init_db(db_path)
    with get_connection(db_path) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT activity_id, category, activity_type, quantity, unit,
                   kg_co2e, emission_factor, formula, source, assumptions,
                   data_quality, created_at
            FROM activities
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT ?
        """, (user_id, max(1, int(limit))))
        rows = cursor.fetchall()

    activities = []
    total_kg = 0.0
    for r in rows:
        item = dict(r)
        item["category"] = canonicalize_category(item.get("category", ""))
        try:
            item["assumptions"] = json.loads(item["assumptions"])
        except Exception:
            item["assumptions"] = []
        activities.append(item)
        total_kg += item["kg_co2e"]

    return {
        "status": "success",
        "user_id": user_id,
        "count": len(activities),
        "total_emissions_kg_co2e": round(total_kg, 3),
        "activities": activities
    }


def get_category_breakdown(
    user_id: str = "default_user",
    days: Optional[int] = None,
    db_path: Optional[Path] = None
) -> Dict[str, Any]:
    """Compute carbon emissions breakdown by canonical category without duplicates."""
    init_db(db_path)
    time_filter = ""
    params: List[Any] = [user_id]
    if days:
        time_filter = "AND datetime(created_at) >= datetime('now', ?)"
        params.append(f"-{int(days)} days")

    with get_connection(db_path) as conn:
        cursor = conn.cursor()
        cursor.execute(f"""
            SELECT category, SUM(kg_co2e) as total_kg, COUNT(*) as count
            FROM activities
            WHERE user_id = ? {time_filter}
            GROUP BY category
            ORDER BY total_kg DESC
        """, tuple(params))
        rows = cursor.fetchall()

    merged_breakdown: Dict[str, Dict[str, Any]] = {}
    overall = 0.0
    for r in rows:
        cat_canonical = canonicalize_category(r["category"])
        kg = round(r["total_kg"], 3)
        count = r["count"]
        if cat_canonical not in merged_breakdown:
            merged_breakdown[cat_canonical] = {
                "kg_co2e": 0.0,
                "activity_count": 0,
                "percentage": 0.0
            }
        merged_breakdown[cat_canonical]["kg_co2e"] = round(merged_breakdown[cat_canonical]["kg_co2e"] + kg, 3)
        merged_breakdown[cat_canonical]["activity_count"] += count
        overall += kg

    overall = round(overall, 3)
    for cat_name, data in merged_breakdown.items():
        data["percentage"] = round((data["kg_co2e"] / overall * 100), 1) if overall > 0 else 0.0

    return {
        "status": "success",
        "user_id": user_id,
        "days": days,
        "total_emissions_kg_co2e": overall,
        "categories": merged_breakdown
    }


def get_daily_summary(
    user_id: str = "default_user",
    target_date: Optional[str] = None,
    db_path: Optional[Path] = None
) -> Dict[str, Any]:
    """Retrieve total emissions and activity breakdown for a specific date (YYYY-MM-DD or today)."""
    init_db(db_path)
    date_str = target_date or datetime.utcnow().strftime("%Y-%m-%d")

    with get_connection(db_path) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT category, activity_type, quantity, unit, kg_co2e, formula, source, created_at
            FROM activities
            WHERE user_id = ? AND date(created_at) = date(?)
            ORDER BY created_at ASC
        """, (user_id, date_str))
        rows = cursor.fetchall()

    activities = [dict(r) for r in rows]
    total_kg = round(sum(r["kg_co2e"] for r in activities), 3)

    cat_breakdown = {}
    for a in activities:
        c = canonicalize_category(a["category"])
        cat_breakdown[c] = round(cat_breakdown.get(c, 0.0) + a["kg_co2e"], 3)

    return {
        "status": "success",
        "date": date_str,
        "user_id": user_id,
        "activity_count": len(activities),
        "total_emissions_kg_co2e": total_kg,
        "category_breakdown": cat_breakdown,
        "activities": activities
    }


def get_weekly_summary(
    user_id: str = "default_user",
    db_path: Optional[Path] = None
) -> Dict[str, Any]:
    """Calculate weekly carbon summary (past 7 days) with daily trend and category breakdown."""
    init_db(db_path)
    with get_connection(db_path) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT date(created_at) as log_date, SUM(kg_co2e) as day_kg, COUNT(*) as count
            FROM activities
            WHERE user_id = ? AND datetime(created_at) >= datetime('now', '-7 days')
            GROUP BY date(created_at)
            ORDER BY log_date ASC
        """, (user_id,))
        daily_rows = cursor.fetchall()

    daily_trend = {r["log_date"]: round(r["day_kg"], 3) for r in daily_rows}
    total_kg = round(sum(daily_trend.values()), 3)
    highest_day = max(daily_trend.items(), key=lambda x: x[1]) if daily_trend else None

    cat_res = get_category_breakdown(user_id=user_id, days=7, db_path=db_path)

    return {
        "status": "success",
        "timeframe": "past_7_days",
        "user_id": user_id,
        "total_emissions_kg_co2e": total_kg,
        "average_daily_kg_co2e": round(total_kg / 7.0, 3),
        "highest_day": {"date": highest_day[0], "kg_co2e": highest_day[1]} if highest_day else None,
        "daily_trend": daily_trend,
        "category_breakdown": cat_res["categories"]
    }


def get_monthly_summary(
    user_id: str = "default_user",
    db_path: Optional[Path] = None
) -> Dict[str, Any]:
    """Calculate monthly carbon summary (past 30 days)."""
    init_db(db_path)
    with get_connection(db_path) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT date(created_at) as log_date, SUM(kg_co2e) as day_kg, COUNT(*) as count
            FROM activities
            WHERE user_id = ? AND datetime(created_at) >= datetime('now', '-30 days')
            GROUP BY date(created_at)
            ORDER BY log_date ASC
        """, (user_id,))
        daily_rows = cursor.fetchall()

    daily_trend = {r["log_date"]: round(r["day_kg"], 3) for r in daily_rows}
    total_kg = round(sum(daily_trend.values()), 3)
    cat_res = get_category_breakdown(user_id=user_id, days=30, db_path=db_path)

    return {
        "status": "success",
        "timeframe": "past_30_days",
        "user_id": user_id,
        "total_emissions_kg_co2e": total_kg,
        "average_daily_kg_co2e": round(total_kg / 30.0, 3),
        "active_days": len(daily_trend),
        "daily_trend": daily_trend,
        "category_breakdown": cat_res["categories"]
    }


def get_summary(
    user_id: str = "default_user",
    timeframe: str = "today",
    db_path: Optional[Path] = None
) -> Dict[str, Any]:
    """Unified summary function supporting 'today', 'daily', 'weekly', 'monthly', or 'all'."""
    tf = (timeframe or "today").strip().lower()
    if tf in ("today", "daily", "day"):
        return get_daily_summary(user_id=user_id, db_path=db_path)
    elif tf in ("weekly", "week", "7days"):
        return get_weekly_summary(user_id=user_id, db_path=db_path)
    elif tf in ("monthly", "month", "30days"):
        return get_monthly_summary(user_id=user_id, db_path=db_path)
    else:
        return get_category_breakdown(user_id=user_id, db_path=db_path)
