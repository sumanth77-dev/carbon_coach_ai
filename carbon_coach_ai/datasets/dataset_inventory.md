# Emission Factor Dataset Inventory

This document tracks all downloaded emission-factor datasets placed in the `datasets/` directory.

---

## Dataset Inventory Table

| # | Original Filename | Folder / Category | Source / Organization | Publication Year | Geographical Coverage | Units | Validation Status | Findings & Notes |
|---|---|---|---|---|---|---|---|---|
| 1 | `1._Baseline_Carbon_Dioxide_Emission_Database_Version_22.0.xlsx` | `electricity/` | Central Electricity Authority (CEA), Ministry of Power, Govt of India | 2026 (Ver 22.0, Aug 2026) | India (National Grid) | `tCO2/MWh` (`kgCO2/kWh`) | **Validated** | Verified: Weighted average grid factor = `0.702 - 0.712 kgCO2/kWh`. Matches `factors.json` (`0.71 kg/kWh`). |
| 2 | `20th century deaths in US - CDC.xlsx` | `food/` | US Centers for Disease Control (CDC) | 20th Century | United States | Mortality count (deaths) | ❌ **Invalid / Unrelated** | **Critical Error:** Contains US mortality cause statistics, NOT carbon emission factors. Should be replaced with food LCA data (e.g., Poore & Nemecek). |
| 3 | `ghg-conversion-factors-2026-full-set.xlsx` | `transport/` | UK DESNZ / DEFRA | 2026 (June 2026 Full Set) | UK / Global Reference | `kgCO2e/L`, `kgCO2e/km`, `kgCO2e/pkm` | **Validated** | High-precision reference for fuel conversion factors (petrol 2.31 kg/L, diesel 2.68 kg/L) and aviation benchmarks. |
| 4 | `EFDB_output.xlsx` | `waste/` | IPCC Emission Factor Database (EFDB) | IPCC 1996 / 2006 | Global | `CH4 generation potential` | **Validated** | Landfill methane emission parameters (Category 4.A Solid Waste Disposal). |
| 5 | `emission_factors_v1_3.xlsx` | `waste/` *(Contains Multi-sector)* | Open India Emission Factors | 2024–2026 (v1.3) | India (National & Regional) | `kgCO2e/kWh`, `kgCO2e/pkm`, `kgCO2e/tonne` | **Validated** | Excellent India-specific dataset: Grid (0.7117 kg/kWh), domestic aviation (0.145 kg/pkm), 2-wheeler petrol (0.042 kg/pkm), bus (0.015 kg/pkm), auto-rickshaw CNG (0.051 kg/pkm), MSW (1004 kg/tonne). |

---

## Action Items for Datasets

1. **Food Folder Issue:** Remove or replace `20th century deaths in US - CDC.xlsx` with an actual food emission dataset (such as Poore & Nemecek 2018 or Our World in Data food commodities).
2. **Multi-sector File Placement:** `emission_factors_v1_3.xlsx` contains valuable Indian transport, electricity, agriculture, and waste factors. While currently in `waste/`, it serves as a multi-sector benchmark for India.
3. **Core Engine Consistency:** The existing `factors.json` is 100% verified against both CEA Database Ver 22.0 (0.71 kg/kWh) and IPCC / DEFRA fuel factors (petrol 2.31 kg/L, diesel 2.68 kg/L).
