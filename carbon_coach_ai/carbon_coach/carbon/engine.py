"""
Deterministic carbon engine. No LLM code here; every number comes from factors.json.
Phase 3 & Phase 5 Carbon Calculation Engine.
"""
import json
from pathlib import Path

# Locate factors.json
_here = Path(__file__).resolve().parent
_factors_candidates = [
    _here / "factors.json",
    _here.parent / "carbon" / "factors.json",
    _here.parent.parent / "factors.json",
    Path("factors.json").resolve()
]

_factors_path = next((p for p in _factors_candidates if p.exists()), _here / "factors.json")
F = json.loads(_factors_path.read_text(encoding="utf-8"))

ALIASES = {
    "transportation": "transport",
    "electric": "electricity",
    "shopping_purchases": "shopping",
}

TYPE_MAP = {
    # Transport synonyms
    "walking": "walk",
    "cycling": "cycle",
    "bicycle": "cycle",
    "electric_bike": "ev_bike",
    "e_bike": "ev_bike",
    "electric_car": "ev_car",
    "ev": "ev_car",
    "plane": "flight",
    "airplane": "flight",
    "bike": "petrol_bike",
    "motorcycle": "petrol_bike",
    "car": "petrol_car",
    # Shopping synonyms
    "clothes": "clothing",
    "shirt": "clothing",
    "electronics": "electronics_phone",
    "phone": "electronics_phone",
    "smartphone": "electronics_phone",
    "plastic_product": "plastic_product",
    "plastic_products": "plastic_product",
    # Waste synonyms
    "organic_waste": "organic",
    "food_scraps": "organic",
    "paper_waste": "paper",
    "plastic_waste": "plastic",
}


def _need(field, question):
    return {"field": field, "question": question}


def _ok(activity, kg, formula, factor, source, assumptions, extra=None):
    out = {
        "status": "ok",
        "activity": activity,
        "inputs": activity.get("params", {}),
        "emission_factor": factor,
        "formula": formula,
        "kg_co2e": round(kg, 3),
        "emissions_kg_co2e": round(kg, 3),
        "source": source,
        "assumptions": assumptions,
        "data_quality": "estimated" if assumptions else "calculated"
    }
    return {**out, **(extra or {})}


def _fmt(val):
    if isinstance(val, (int, float)):
        return int(val) if val == int(val) else val
    return val


def _transport(a, p):
    raw_type = a.get("type", "").strip().lower()
    t = TYPE_MAP.get(raw_type, raw_type)
    d = p.get("distance_km", 0)
    
    if d <= 0:
        return {"status": "needs_info", "missing": [_need("distance_km", "How many km was the trip?")]}
        
    df = _fmt(d)
    if t in F["default_mileage_kmpl"]:
        fuel = "diesel" if t.startswith("diesel") else "petrol"
        m = p.get("mileage_kmpl", 0)
        asm = []
        if m <= 0:
            m = F["default_mileage_kmpl"][t]
            asm.append(f"Assumed mileage {m} km/L (typical {t.replace('_', ' ')}); confirm actual value")
        mf = _fmt(m)
        f = F["fuel"][fuel]
        kg = (d / m) * f["value"]
        formula = f"{df} km / {mf} km/L x {f['value']} kg/L"
        return _ok(a, kg, formula, f"{f['value']} kg/L {fuel}", f["source"], asm)
        
    if t in F["ev_kwh_per_km"]:
        k = F["ev_kwh_per_km"][t]
        g = F["grid_india"]
        kg = d * k * g["value"]
        formula = f"{df} km x {k} kWh/km x {g['value']} kg/kWh"
        return _ok(a, kg, formula, f"{g['value']} kg/kWh grid", g["source"], [f"Assumed {k} kWh/km"])
        
    f = F["public_kg_per_pkm"].get(t)
    if not f:
        return {"status": "error", "error": f"Unknown transport type: {t}"}
        
    kg = d * f["value"]
    formula = f"{df} km x {f['value']} kg/passenger-km"
    asm = [] if f["value"] == 0 else ["Average occupancy assumed"]
    return _ok(a, kg, formula, f"{f['value']} kg/pkm", f["source"], asm)


def _electricity(a, p):
    raw_type = a.get("type", "").strip().lower()
    t = TYPE_MAP.get(raw_type, raw_type)
    h = p.get("hours", 0)
    
    if h <= 0:
        return {"status": "needs_info", "missing": [_need("hours", "For how many hours was it used?")]}
        
    kw = p.get("power_kw", 0)
    asm = []
    follow = None
    
    if kw <= 0 and t == "ac" and p.get("tonnage", 0) > 0:
        kw = p["tonnage"] * F["ac_kw_per_ton"]
        asm.append(f"Estimated {kw:.2f} kW from {p['tonnage']}-ton rating")
        
    if kw <= 0:
        w = F["appliance_watts"].get(t)
        if not w:
            return {"status": "error", "error": f"Unknown appliance: {t}"}
        kw = w / 1000
        asm.append(f"Assumed typical {w} W for {t}")
        if t == "ac":
            follow = _need("tonnage", "What is your AC tonnage or power rating (e.g. 1.5 ton)?")
            
    g = F["grid_india"]
    kg = kw * h * g["value"]
    hf = _fmt(h)
    kwf = _fmt(kw)
    formula = f"{kwf} kW x {hf} h x {g['value']} kg/kWh"
    return _ok(a, kg, formula, f"{g['value']} kg/kWh grid", g["source"], asm,
               {"follow_up": follow} if follow else None)


def _table_calc(table, key, qty_field, label):
    def fn(a, p):
        raw_type = a.get("type", "").strip().lower()
        t = TYPE_MAP.get(raw_type, raw_type)
        if label == "shopping" and t == "plastic":
            t = "plastic_product"
            
        f = table.get(t)
        if not f:
            return {"status": "error", "error": f"Unknown {label} type: {a.get('type')}"}
            
        q = p.get(qty_field, 0)
        if q <= 0:
            return {"status": "needs_info", "missing": [_need(qty_field, f"What {qty_field} for {a.get('type')}?")]}
            
        kg = q * f["value"]
        qf = _fmt(q)
        formula = f"{qf} {qty_field} x {f['value']}"
        asm = ["Standard serving/average item assumed"] if label != "waste" else ["Disposal phase only; recycling credits excluded"]
        return _ok(a, kg, formula, str(f["value"]), f["source"], asm)
    return fn


def _food(a, p):
    raw_type = a.get("type", "").strip().lower()
    t = TYPE_MAP.get(raw_type, raw_type)
    if t == "food_waste":
        f = F["food_waste_kg_per_kg"]
        q = p.get("kg", 0)
        if q <= 0:
            return {"status": "needs_info", "missing": [_need("kg", "Roughly how many kg of food was wasted?")]}
        kg = q * f["value"]
        formula = f"{q} kg x {f['value']}"
        return _ok(a, kg, formula, str(f["value"]), f["source"], [])
        
    return _table_calc(F["food_kg_per_meal"], "meals", "meals", "food")(a, {"meals": p.get("meals", 1) or 1})


CALC = {
    "transport": _transport,
    "electricity": _electricity,
    "food": _food,
    "shopping": _table_calc(F["shopping_kg_per_item"], "items", "items", "shopping"),
    "waste": _table_calc(F["waste_kg_per_kg"], "kg", "kg", "waste")
}


def calculate(activity: dict) -> dict:
    raw_cat = activity.get("category", "").strip().lower()
    cat = ALIASES.get(raw_cat, raw_cat)
    fn = CALC.get(cat)
    if not fn:
        return {"status": "error", "error": f"Unknown category: {activity.get('category')}"}
    activity = {**activity, "category": cat}
    return fn(activity, activity.get("params", {}))


def calculate_total(results: list[dict]) -> dict:
    """Calculate total emissions deterministically in Python from individual activity results."""
    successful = []
    total_kg = 0.0
    for r in results:
        if isinstance(r, dict) and r.get("status") == "ok":
            successful.append(r)
            total_kg += float(r.get("kg_co2e", 0.0))
    return {
        "status": "success",
        "activities": successful,
        "total_emissions_kg_co2e": round(total_kg, 3)
    }


def simulate(current: dict, alternative: dict, times_per_day: float = 1.0) -> dict:
    a, b = calculate(current), calculate(alternative)
    if a["status"] != "ok" or b["status"] != "ok":
        return {"status": "needs_info", "current": a, "alternative": b}
    da, db = a["kg_co2e"] * times_per_day, b["kg_co2e"] * times_per_day
    s = da - db
    return {
        "status": "ok",
        "current_kg_per_day": round(da, 3),
        "alternative_kg_per_day": round(db, 3),
        "saved_kg_per_day": round(s, 3),
        "percent_reduction": round(s / da * 100, 1) if da else 0.0,
        "monthly_kg_saved": round(s * 30, 2),
        "yearly_kg_saved": round(s * 365, 1),
        "assumptions": a.get("assumptions", []) + b.get("assumptions", [])
    }
