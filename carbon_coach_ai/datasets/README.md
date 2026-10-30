# Carbon Coach AI – Emission Factor Datasets Repository

This directory organizes all external emission-factor datasets (in `.xlsx` or `.csv` format) used by the Carbon Coach AI project.

---

## Folder Organization & Placement Guide

Place your downloaded Excel (`.xlsx`) datasets into the matching subfolder based on activity category:

### 1. `datasets/transport/`
* **Target Datasets:**
  - Vehicle emission factors (petrol/diesel cars, motorcycles/scooters, autorickshaws, electric vehicles).
  - Fuel emission factors (kg CO₂e per liter of petrol, diesel, CNG, LPG).
  - Public transit factors (city bus, bus rapid transit, metro, suburban train, long-distance railway per passenger-km).
  - Aviation factors (domestic and international flights per passenger-km).
  - Fuel economy / vehicle mileage reference tables (km/L, kWh/100km).
* **Common Sources:** IPCC Guidelines, UK DEFRA/DESNZ GHG Conversion Factors, India MoRTH/ARAI, ICCT.

### 2. `datasets/electricity/`
* **Target Datasets:**
  - National and regional electricity grid emission factors (kg CO₂e / kWh).
  - India CEA (Central Electricity Authority) CO₂ Baseline Database for the Indian Power Sector.
  - State electricity distribution company / regional grid intensity tables.
  - Appliance power ratings & typical wattage consumption sheets (air conditioners, fans, refrigerators, lighting, heaters, computing).
* **Common Sources:** CEA India, IEA (International Energy Agency), US EPA eGRID.

### 3. `datasets/food/`
* **Target Datasets:**
  - Food commodity lifecycle emissions (kg CO₂e per kg or per meal serving).
  - Diet comparison tables (vegan, vegetarian, pescatarian, poultry/chicken, red meat / mutton, beef, dairy).
  - Food production, transport, packaging, and retail footprint data.
* **Common Sources:** Poore & Nemecek (Science 2018), Our World in Data, FAO, Agribalyse.

### 4. `datasets/waste/`
* **Target Datasets:**
  - Municipal Solid Waste (MSW) emission factors (landfill, incineration, open burning).
  - Food waste lifecycle and landfill methane emissions (kg CO₂e per kg of food wasted).
  - Recycling and composting emission offsets (paper, plastic, glass, organic waste).
* **Common Sources:** UK DEFRA, US EPA WARM (Waste Reduction Model), IPCC Waste Sector Guidelines.

### 5. `datasets/shopping/`
* **Target Datasets:**
  - Embodied emissions for consumer goods (clothing, footwear, textiles).
  - Electronics and personal devices lifecycle carbon (smartphones, laptops, monitors).
  - Packaging materials (plastic bottles, cardboard, single-use bags, paper).
* **Common Sources:** Ecoinvent, UK DEFRA, academic lifecycle analysis (LCA) studies.

### 6. `datasets/other/`
* **Target Datasets:**
  - Domestic LPG cylinder emissions (kg CO₂e per kg or per cylinder).
  - Piped Natural Gas (PNG) / heating fuels.
  - Water consumption and municipal wastewater treatment emissions.
  - Campus-specific or institution-specific facility footprint datasets.

### 7. `datasets/processed/`
* **Purpose:**
  - Dedicated staging area for cleaned, normalized, and validated data extracted from raw spreadsheets.
  - Used when scripts or tools convert raw multi-tab `.xlsx` sheets into standardized schema files (e.g. JSON or clean CSV) without modifying raw files.

---

## Best Practices for Adding Datasets

1. **Keep Raw Files Intact:** Do not modify the original `.xlsx` files after downloading; store them in their respective raw category folders.
2. **Log Metadata in Inventory:** Whenever you add a new dataset, record an entry in [`dataset_inventory.md`](file:///c:/Users/sikindarbasha/Documents/Carbon_Coach_AI/datasets/dataset_inventory.md).
3. **Verify Units:** Ensure that units (e.g., `kg CO2e/km`, `g CO2e/pkm`, `kg CO2e/kWh`, `kg CO2e/kg`) are clearly identified in the spreadsheet columns before processing.
