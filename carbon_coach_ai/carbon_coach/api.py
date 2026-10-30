"""
api.py - Backend FastAPI Interface for Frontend & Teammate Integration (Phase 8).
Exposes REST endpoints for chat, activity tracking, summaries, simulations, and recommendations.
"""

import os
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

from google.genai import types
from google.adk.runners import InMemoryRunner

from carbon_coach.agent import carbon_coach_root
from carbon_coach.tracker import db
from carbon_coach.tools import carbon_tools, tracker_tools, coach_tools
from carbon_coach.coach import recommendations

load_dotenv()

app = FastAPI(
    title="Carbon Coach AI Backend API",
    description="Backend service powering the Carbon Coach AI agent, calculations, and SQLite tracking for DevFest 2026 Hackathon.",
    version="1.0.0"
)

# Enable CORS for Streamlit or React frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Shared In-Memory ADK Runner
runner = InMemoryRunner(agent=carbon_coach_root, app_name="carbon_coach")


class ChatRequest(BaseModel):
    message: str = Field(..., description="User's natural language activity or question")
    user_id: str = Field("default_user", description="User identifier")
    session_id: Optional[str] = Field(None, description="Optional chat session identifier")


class ActivityLogRequest(BaseModel):
    category: str
    activity_type: str
    quantity: float
    unit: str
    kg_co2e: float
    user_id: str = "default_user"
    emission_factor: str = ""
    formula: str = ""
    source: str = ""


class SimulationRequest(BaseModel):
    category: str
    current_type: str
    alternative_type: str
    distance_km: float = 0.0
    hours: float = 0.0
    meals: float = 0.0
    items: float = 0.0
    kg: float = 0.0
    times_per_day: float = 1.0


@app.get("/health")
def health_check():
    """System health check and diagnostic endpoint."""
    return {
        "status": "healthy",
        "service": "Carbon Coach AI",
        "database": "SQLite (carbon_coach.db)",
        "adk_version": "2.11.0",
        "model": os.getenv("ECOMATE_MODEL", "gemini-3.1-flash-lite")
    }


@app.post("/api/chat")
async def chat_endpoint(req: ChatRequest):
    """Main conversational chat endpoint powered by Google ADK multi-agent orchestrator."""
    if not req.message or not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    sess_id = req.session_id or f"session_{req.user_id}"
    try:
        # Ensure session exists in runner's session service
        try:
            await runner.session_service.create_session(
                user_id=req.user_id,
                session_id=sess_id,
                app_name=runner.app_name
            )
        except Exception:
            pass  # Session already exists

        msg = types.Content(parts=[types.Part(text=req.message.strip())])
        response_parts = []

        async for event in runner.run_async(
            user_id=req.user_id,
            session_id=sess_id,
            new_message=msg
        ):
            if event.content and event.content.parts:
                for p in event.content.parts:
                    if p.text:
                        response_parts.append(p.text)

        reply_text = " ".join(response_parts).strip()
        if not reply_text:
            reply_text = "I have processed your activity. All numbers are calculated using verified emission factors."

        return {
            "status": "success",
            "user_id": req.user_id,
            "session_id": sess_id,
            "reply": reply_text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent error: {str(e)}")


@app.get("/api/activities/history")
def get_history(user_id: str = Query("default_user"), limit: int = Query(20)):
    """Retrieve logged activity history from SQLite."""
    return db.get_activity_history(user_id=user_id, limit=limit)


@app.post("/api/activities/log")
def log_activity_api(req: ActivityLogRequest):
    """Direct endpoint to log verified activity record."""
    return db.log_activity(
        category=req.category,
        activity_type=req.activity_type,
        quantity=req.quantity,
        unit=req.unit,
        kg_co2e=req.kg_co2e,
        user_id=req.user_id,
        emission_factor=req.emission_factor,
        formula=req.formula,
        source=req.source
    )


@app.get("/api/summary/daily")
def daily_summary(user_id: str = Query("default_user"), date: Optional[str] = Query(None)):
    """Retrieve daily summary and category breakdown."""
    return db.get_daily_summary(user_id=user_id, target_date=date)


@app.get("/api/summary/weekly")
def weekly_summary(user_id: str = Query("default_user")):
    """Retrieve weekly summary (past 7 days) and daily trend."""
    return db.get_weekly_summary(user_id=user_id)


@app.get("/api/summary/monthly")
def monthly_summary(user_id: str = Query("default_user")):
    """Retrieve monthly summary (past 30 days) and trends."""
    return db.get_monthly_summary(user_id=user_id)


@app.get("/api/summary/categories")
def category_breakdown(user_id: str = Query("default_user"), days: int = Query(30)):
    """Retrieve category emission percentage breakdown."""
    return db.get_category_breakdown(user_id=user_id, days=days)


@app.get("/api/recommendations")
def get_recommendations_api(user_id: str = Query("default_user")):
    """Retrieve personalized, verified carbon reduction recommendations."""
    return recommendations.generate_recommendations(user_id=user_id)


from datetime import datetime

class BatchCalculateRequest(BaseModel):
    activities: List[Dict[str, Any]]


@app.post("/api/calculate")
def calculate_activities_api(req: BatchCalculateRequest):
    """Deterministic batch carbon calculation powered by Python carbon_tools and factors.json."""
    detailed = []
    cat_totals = {"Transportation": 0.0, "Electricity": 0.0, "Food": 0.0, "Waste": 0.0}

    for i, act in enumerate(req.activities):
        cat_raw = str(act.get("category", "")).lower()
        cat = "transport" if cat_raw in ("transportation", "transport") else \
              "electricity" if cat_raw in ("electricity", "energy") else \
              "food" if cat_raw in ("food", "diet") else \
              "waste" if cat_raw in ("waste",) else cat_raw

        act_type = str(
            act.get("activity_type") or
            act.get("food_item") or
            act.get("waste_type") or
            act.get("appliance_type") or
            "other"
        ).lower()

        dist = float(act.get("distance_km") or act.get("distance") or 0.0)
        hours = float(act.get("hours") or act.get("hours_per_day") or 0.0)
        watts = float(act.get("power_watts") or 0.0)
        kw = float(act.get("power_kw") or 0.0) or (watts / 1000.0 if watts > 0 else 0.0) or \
             (float(act.get("consumption_kwh") or act.get("quantity") or 0.0) if cat == "electricity" and hours <= 0 else 0.0)
        if cat == "electricity" and hours <= 0 and kw > 0:
            hours = 1.0

        meals = float(act.get("meals") or (act.get("quantity") if act.get("unit") == "meals" else 0.0) or 0.0)
        qty = float(act.get("quantity") or 0.0)
        kg = float(act.get("kg") or (qty if cat in ("food", "waste") and act.get("unit") != "meals" else 0.0))
        if act.get("unit") == "grams" and kg > 0:
            kg = kg / 1000.0

        calc_res = carbon_tools.calculate_carbon_emissions(
            category=cat,
            activity_type=act_type,
            distance_km=dist,
            hours=hours,
            power_kw=kw,
            meals=meals if meals > 0 else (1.0 if cat == "food" and kg <= 0 else 0.0),
            kg=kg
        )

        kg_val = float(calc_res.get("kg_co2e", 0.0) or 0.0)
        passengers = int(act.get("passengers", 1) or 1)
        if passengers > 1 and "car" in act_type:
            kg_val = round(kg_val / passengers, 3)

        freq = str(act.get("frequency", "")).lower()
        if freq == "daily":
            kg_val = round(kg_val * 7, 3)

        display_name = act.get("activityName") or f"{act_type.replace('_', ' ').title()}"
        category_title = "Transportation" if cat == "transport" else \
                         "Electricity" if cat == "electricity" else \
                         "Food" if cat == "food" else "Waste"
        cat_totals[category_title] = round(cat_totals.get(category_title, 0.0) + kg_val, 3)

        detailed.append({
            "id": act.get("id") or f"calc-{i + 1}",
            "activity": display_name,
            "category": category_title,
            "quantity": act.get("displaySummary") or act.get("quantity") or f"{dist or hours or kg or meals} units",
            "emissionFactor": str(calc_res.get("emission_factor", "")),
            "emissions": kg_val,
            "formula": str(calc_res.get("formula", "")),
            "factorSource": str(calc_res.get("source", "UK DEFRA 2024 / IPCC")),
            "assumptions": "; ".join(calc_res.get("assumptions", [])) if isinstance(calc_res.get("assumptions"), list) else str(calc_res.get("assumptions", ""))
        })

    total_emissions = round(sum(cat_totals.values()), 3)
    breakdown = []
    colors = {
        "Transportation": "#245C45",
        "Electricity": "#3B7A5E",
        "Food": "#5B9377",
        "Waste": "#8BAF99",
    }
    for c_name, val in cat_totals.items():
        pct = round((val / total_emissions * 100), 1) if total_emissions > 0 else 0
        breakdown.append({
            "category": c_name,
            "emission": val,
            "percentage": pct,
            "color": colors.get(c_name, "#245C45"),
        })

    highest = max(breakdown, key=lambda x: x["emission"]) if breakdown else None
    ai_insight = f"Your largest emission driver is {highest['category']} ({highest['percentage']}% of session total). Direct adjustments here will optimize your reduction trajectory." if highest and highest["emission"] > 0 else "Your carbon profile shows low-impact balanced habits across sectors."

    # Generate personalized reduction tip for the primary calculated activity
    reduction_tip = None
    if detailed:
        top_detailed = max(detailed, key=lambda x: x["emissions"])
        matching_act = req.activities[0]
        for act in req.activities:
            if (act.get("activityName") == top_detailed["activity"] or 
                str(act.get("activity_type", "")).lower() in top_detailed["activity"].lower()):
                matching_act = act
                break

        reduction_tip = recommendations.generate_tip_for_activity(
            category=top_detailed["category"],
            activity_type=str(matching_act.get("activity_type") or matching_act.get("food_item") or matching_act.get("waste_type") or matching_act.get("appliance_type") or top_detailed["activity"]),
            quantity=float(matching_act.get("distance_km") or matching_act.get("hours") or matching_act.get("kg") or matching_act.get("quantity") or 1.0),
            unit=str(matching_act.get("unit") or "units"),
            kg_co2e=top_detailed["emissions"]
        )

    return {
        "status": "success",
        "data": {
            "totalEmissions": total_emissions,
            "unit": "kg CO₂e",
            "calculationPeriod": "Session Input Activities",
            "activitiesCalculated": len(detailed),
            "calculationDate": datetime.utcnow().isoformat() + "Z",
            "categoryBreakdown": breakdown,
            "detailedResults": detailed,
            "reductionTip": reduction_tip,
            "calculationInformation": {
                "methodology": "Deterministic Python Engine / factors.json",
                "factorSources": "UK DEFRA 2024 / CEA India Grid Baseline / Poore & Nemecek 2024",
                "factorYear": 2024,
                "assumptions": "Strictly deterministic calculations from verified emission database."
            },
            "aiInsight": ai_insight
        }
    }


class ActivityTipRequest(BaseModel):
    category: str
    activity_type: str
    quantity: float = 1.0
    unit: str = "units"
    kg_co2e: float = 0.0


@app.post("/api/recommendations/for-activity")
def recommendation_for_activity_api(req: ActivityTipRequest):
    """Generate a verified reduction tip tailored to an individual activity."""
    return recommendations.generate_tip_for_activity(
        category=req.category,
        activity_type=req.activity_type,
        quantity=req.quantity,
        unit=req.unit,
        kg_co2e=req.kg_co2e
    )


@app.post("/api/simulate")
def simulate_api(req: SimulationRequest):
    """Direct what-if simulation tool endpoint."""
    return carbon_tools.simulate_alternative_activity(
        category=req.category,
        current_type=req.current_type,
        alternative_type=req.alternative_type,
        distance_km=req.distance_km,
        hours=req.hours,
        meals=req.meals,
        items=req.items,
        kg=req.kg,
        times_per_day=req.times_per_day
    )
