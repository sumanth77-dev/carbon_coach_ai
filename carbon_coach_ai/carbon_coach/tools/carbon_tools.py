"""
carbon_tools.py - Python tools for Google ADK agents.
Plain typed Python functions with clear docstrings.
"""
from carbon_coach.carbon import engine

_QTY = ("distance_km", "mileage_kmpl", "hours", "power_kw", "tonnage", "meals", "items", "kg")


def _build(category: str, activity_type: str, **q) -> dict:
    return {
        "category": str(category).strip().lower(),
        "type": str(activity_type).strip().lower(),
        "params": {k: float(v) for k, v in q.items() if k in _QTY and v is not None and float(v) > 0}
    }


def extract_activity_details(
    category: str,
    activity_type: str,
    distance_km: float = 0.0,
    mileage_kmpl: float = 0.0,
    hours: float = 0.0,
    power_kw: float = 0.0,
    tonnage: float = 0.0,
    meals: float = 0.0,
    items: float = 0.0,
    kg: float = 0.0
) -> dict:
    """Validate a structured activity record and report which required details are missing.

    Args:
        category: Activity category: transport, electricity, food, shopping, or waste.
        activity_type: Specific activity (e.g. bus, train, petrol_bike, petrol_car, diesel_car,
            ev_bike, ev_car, flight, walk, cycle, ac, fan, refrigerator, light, washing_machine,
            geyser, tv, laptop, vegetarian, chicken, mutton, beef, fish, dairy, food_waste,
            clothing, electronics_phone, plastic_product, plastic, paper, organic).
        distance_km: Trip distance in km.
        mileage_kmpl: Vehicle fuel efficiency in km/L (optional).
        hours: Appliance duration in hours.
        power_kw: Appliance power in kW (optional).
        tonnage: AC cooling capacity in tons (e.g. 1.0, 1.5).
        meals: Number of meals (food category).
        items: Number of items purchased (shopping category).
        kg: Weight in kilograms (waste or food_waste category).

    Returns:
        dict with status 'complete' or 'needs_info', validated activity parameters,
        and follow-up questions for any missing required data.
    """
    try:
        rec = _build(
            category, activity_type,
            distance_km=distance_km, mileage_kmpl=mileage_kmpl, hours=hours,
            power_kw=power_kw, tonnage=tonnage, meals=meals, items=items, kg=kg
        )
        res = engine.calculate(rec)
    except Exception as e:
        return {"status": "error", "error": str(e)}

    if res.get("status") == "error":
        return res

    questions = res.get("missing", []) + ([res["follow_up"]] if res.get("follow_up") else [])
    optional = [k for k in ("mileage_kmpl",) if res.get("status") == "ok" and any("mileage" in x for x in res.get("assumptions", []))]
    
    return {
        "status": "needs_info" if res.get("status") == "needs_info" else "complete",
        "activity": rec,
        "questions": questions,
        "optional_refinements": optional
    }


def calculate_carbon_emissions(
    category: str,
    activity_type: str,
    distance_km: float = 0.0,
    mileage_kmpl: float = 0.0,
    hours: float = 0.0,
    power_kw: float = 0.0,
    tonnage: float = 0.0,
    meals: float = 0.0,
    items: float = 0.0,
    kg: float = 0.0
) -> dict:
    """Calculate kg CO2e for one activity using deterministic emission factors.
    Gemini must NEVER invent numbers; always use this tool output.

    Args:
        category: Activity category: transport, electricity, food, shopping, or waste.
        activity_type: Specific activity type.
        distance_km: Distance in km (transport).
        mileage_kmpl: Vehicle km/L (optional).
        hours: Usage in hours (electricity).
        power_kw: Power in kW (optional).
        tonnage: AC tons (optional).
        meals: Number of meals (food).
        items: Number of items (shopping).
        kg: Kilograms (waste or food waste).

    Returns:
        dict with kg_co2e, formula, emission_factor, source, assumptions, data_quality.
    """
    try:
        rec = _build(
            category, activity_type,
            distance_km=distance_km, mileage_kmpl=mileage_kmpl, hours=hours,
            power_kw=power_kw, tonnage=tonnage, meals=meals, items=items, kg=kg
        )
        return engine.calculate(rec)
    except Exception as e:
        return {"status": "error", "error": str(e)}


def get_emission_factors(category: str) -> dict:
    """Return verified emission factors, units, sources and confidence for a category.

    Args:
        category: One of transport, electricity, food, shopping, or waste.

    Returns:
        dict with factors, units, and cited sources.
    """
    m = {
        "transport": ["fuel", "default_mileage_kmpl", "ev_kwh_per_km", "public_kg_per_pkm", "grid_india"],
        "electricity": ["grid_india", "appliance_watts", "ac_kw_per_ton"],
        "food": ["food_kg_per_meal", "food_waste_kg_per_kg"],
        "shopping": ["shopping_kg_per_item"],
        "waste": ["waste_kg_per_kg"]
    }
    raw_cat = str(category).strip().lower()
    norm_cat = engine.ALIASES.get(raw_cat, raw_cat)
    keys = m.get(norm_cat)
    if not keys:
        return {"status": "error", "error": f"Unknown category: {category}"}
    return {
        "status": "ok",
        "category": category,
        "factors": {k: engine.F[k] for k in keys if k in engine.F}
    }


def simulate_alternative_activity(
    category: str,
    current_type: str,
    alternative_type: str,
    distance_km: float = 0.0,
    hours: float = 0.0,
    meals: float = 0.0,
    items: float = 0.0,
    kg: float = 0.0,
    times_per_day: float = 1.0
) -> dict:
    """Compare two ways of doing an activity (e.g. petrol_bike vs bus for 20 km) and compute exact savings.

    Args:
        category: transport, electricity, food, shopping or waste.
        current_type: Baseline activity type (e.g. petrol_bike).
        alternative_type: Greener alternative type (e.g. bus).
        distance_km: Trip distance in km.
        hours: Duration in hours.
        meals: Number of meals.
        items: Number of items.
        kg: Kilograms.
        times_per_day: Frequency per day (default 1.0 for daily).

    Returns:
        dict with current_kg_per_day, alternative_kg_per_day, saved_kg_per_day,
        percent_reduction, monthly_kg_saved, yearly_kg_saved, assumptions.
    """
    try:
        q = dict(distance_km=distance_km, hours=hours, meals=meals, items=items, kg=kg)
        curr = _build(category, current_type, **q)
        alt = _build(category, alternative_type, **q)
        return engine.simulate(curr, alt, times_per_day or 1.0)
    except Exception as e:
        return {"status": "error", "error": str(e)}


def calculate_total_footprint(emission_values: list[float]) -> dict:
    """Calculate the exact sum of individual activity emissions (kg CO2e) in Python.
    Prevents LLM from doing arithmetic or hallucinating totals.

    Args:
        emission_values: List of numerical kg CO2e emission results from individual activities.

    Returns:
        dict with total_emissions_kg_co2e, activity_count, and calculation formula.
    """
    clean_values = [float(v) for v in emission_values if v is not None and float(v) >= 0]
    total = round(sum(clean_values), 3)
    formula = " + ".join([f"{v} kg" for v in clean_values]) + f" = {total} kg CO2e" if clean_values else "0 kg CO2e"
    return {
        "status": "success",
        "total_emissions_kg_co2e": total,
        "activity_count": len(clean_values),
        "formula": formula
    }
