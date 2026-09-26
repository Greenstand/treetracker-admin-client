"""
generate_synthetic_data_v2.py

Generates a realistic synthetic dataset matching Greenstand's actual
Treetracker schema structure (as observed from public API responses),
but using entirely FAKE names/emails/phones (via Faker) - no real PII.

Produces:
  - synthetic_planters.csv   (growers)
  - synthetic_captures.csv   (tree captures, linked to planters)

Use this to develop and test logic for ALL phases (EDA, duplicate
detection, anomaly detection, GIS, survival prediction, forecasting)
while waiting for confirmed live data access. Swap in real data later
without changing downstream logic, since column names match the real
schema.
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from faker import Faker

fake = Faker()
Faker.seed(42)
np.random.seed(42)

N_PLANTERS = 500
N_CAPTURES = 8000

# Real species names observed in Greenstand's public data (non-PII, safe to reuse)
SPECIES = ['Rhizophora mucronata (Red Mangrove)', 'Mango', 'Moringa', 'Acacia',
           'Neem', 'Mahogany', 'Avocado', 'Cashew']

COUNTRIES = [
    ('Sierra Leone', 'Africa'),
    ('Cameroon', 'Africa'),
    ('Kenya', 'Africa'),
    ('India', 'Asia'),
    ('Philippines', 'Asia'),
    ('Uganda', 'Africa'),
    ('Belize', 'North America'),
]

ORGANIZATIONS = ['FCC', 'FCCFED', 'FCCYAR', 'FCCCAN', 'YARDO', 'YADO', 'Zanmi Latè']

GENDERS = ['male', 'female', None]

# --- Generate Planters (Growers) ---
planters = []
for i in range(1, N_PLANTERS + 1):
    country, continent = COUNTRIES[np.random.randint(len(COUNTRIES))]
    planters.append({
        'planter_id': i,
        'first_name': fake.first_name(),
        'last_name': fake.last_name(),
        'email': fake.email() if np.random.rand() > 0.7 else None,
        'organization': np.random.choice(ORGANIZATIONS),
        'phone': fake.phone_number() if np.random.rand() > 0.3 else None,
        'gender': np.random.choice(GENDERS, p=[0.45, 0.35, 0.20]),
        'country_name': country,
        'continent_name': continent,
        'created_at': fake.date_time_between(start_date='-3y', end_date='-6m'),
    })

planters_df = pd.DataFrame(planters)
planters_df.to_csv('synthetic_planters.csv', index=False)
print(f"Generated {len(planters_df)} synthetic planters -> synthetic_planters.csv")

# Assign each planter a "home" GPS center based on country, so captures cluster realistically
country_centers = {
    'Sierra Leone': (8.46, -13.23),
    'Cameroon': (3.85, 11.50),
    'Kenya': (-1.29, 36.82),
    'India': (20.59, 78.96),
    'Philippines': (12.88, 121.77),
    'Uganda': (1.37, 32.29),
    'Belize': (17.19, -88.50),
}
planter_country = dict(zip(planters_df['planter_id'], planters_df['country_name']))

# --- Generate Captures ---
start_date = datetime(2023, 1, 1)
rows = []
for i in range(N_CAPTURES):
    planter_id = np.random.randint(1, N_PLANTERS + 1)
    country = planter_country[planter_id]
    base_lat, base_lon = country_centers[country]
    lat = base_lat + np.random.normal(0, 0.05)
    lon = base_lon + np.random.normal(0, 0.05)
    days_offset = np.random.randint(0, 700)
    captured_at = start_date + timedelta(days=int(days_offset), minutes=int(np.random.randint(0, 1440)))
    species = np.random.choice(SPECIES)
    verification_status = np.random.choice(['verified', 'unverified'], p=[0.79, 0.21])  # roughly matches real ratio

    rows.append({
        'capture_id': f"cap_{i}",
        'planter_id': planter_id,
        'captured_at': captured_at,
        'lat': round(lat, 6),
        'lon': round(lon, 6),
        'species': species,
        'country_name': country,
        'verification_status': verification_status,
    })

captures_df = pd.DataFrame(rows)

# Inject intentional duplicates (same planter, near-identical GPS/time) - for Phase 2 testing
dup_sample = captures_df.sample(60, random_state=1).copy()
dup_sample['capture_id'] = dup_sample['capture_id'] + '_dup'
dup_sample['captured_at'] = dup_sample['captured_at'] + pd.to_timedelta(np.random.randint(0, 3, size=len(dup_sample)), unit='m')
captures_df = pd.concat([captures_df, dup_sample], ignore_index=True)

# Inject an anomalous burst (one planter, implausibly many captures in a short window) - for Phase 3 testing
burst_planter = 1
burst_rows = []
burst_start = start_date + timedelta(days=300)
for j in range(35):
    burst_rows.append({
        'capture_id': f"cap_burst_{j}",
        'planter_id': burst_planter,
        'captured_at': burst_start + timedelta(minutes=j),
        'lat': country_centers[planter_country[burst_planter]][0] + np.random.normal(0, 0.001),
        'lon': country_centers[planter_country[burst_planter]][1] + np.random.normal(0, 0.001),
        'species': np.random.choice(SPECIES),
        'country_name': planter_country[burst_planter],
        'verification_status': 'unverified',
    })
captures_df = pd.concat([captures_df, pd.DataFrame(burst_rows)], ignore_index=True)

# Add a survived flag (for Phase 5 - survival prediction), weighted loosely by species/country for realism
def survival_prob(row):
    base = 0.75
    if row['species'] == 'Rhizophora mucronata (Red Mangrove)':
        base -= 0.15  # mangroves often harder to establish
    if row['country_name'] in ['Belize']:
        base += 0.05
    return np.clip(base, 0.1, 0.95)

captures_df['survival_prob'] = captures_df.apply(survival_prob, axis=1)
captures_df['survived'] = np.random.binomial(1, captures_df['survival_prob'])
captures_df.drop(columns=['survival_prob'], inplace=True)

captures_df.to_csv('synthetic_captures.csv', index=False)
print(f"Generated {len(captures_df)} synthetic captures -> synthetic_captures.csv")
print("\nSample captures:")
print(captures_df.head())
print("\nSample planters:")
print(planters_df.head())
