"""
generate_synthetic_data.py

Generates synthetic capture data matching the known Treetracker schema,
for building/testing EDA and detection logic before live API/DB access
is available.
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta

np.random.seed(42)

N_GROWERS = 150
N_CAPTURES = 5000
REGIONS = ['Kenya', 'Cameroon', 'India', 'Philippines', 'Uganda']
SPECIES = ['Mango', 'Avocado', 'Moringa', 'Acacia', 'Neem', 'Mahogany']

grower_ids = [f"grower_{i}" for i in range(1, N_GROWERS + 1)]

# Assign each grower a "home" region and rough GPS center so captures cluster realistically
region_centers = {
    'Kenya': (-1.29, 36.82),
    'Cameroon': (3.85, 11.50),
    'India': (20.59, 78.96),
    'Philippines': (12.88, 121.77),
    'Uganda': (1.37, 32.29),
}
grower_region = {g: np.random.choice(REGIONS) for g in grower_ids}

start_date = datetime(2025, 1, 1)

rows = []
for i in range(N_CAPTURES):
    grower = np.random.choice(grower_ids)
    region = grower_region[grower]
    base_lat, base_lon = region_centers[region]
    lat = base_lat + np.random.normal(0, 0.05)
    lon = base_lon + np.random.normal(0, 0.05)
    days_offset = np.random.randint(0, 210)
    captured_at = start_date + timedelta(days=int(days_offset), minutes=int(np.random.randint(0, 1440)))
    species = np.random.choice(SPECIES)
    verification_status = np.random.choice(['verified', 'unverified'], p=[0.85, 0.15])

    rows.append({
        'capture_id': f"cap_{i}",
        'grower_id': grower,
        'captured_at': captured_at,
        'lat': round(lat, 6),
        'lon': round(lon, 6),
        'species': species,
        'region': region,
        'verification_status': verification_status,
    })

df = pd.DataFrame(rows)

# Inject some intentional duplicates (same grower, near-identical GPS/time) to test detection logic
dup_sample = df.sample(40, random_state=1).copy()
dup_sample['capture_id'] = dup_sample['capture_id'] + '_dup'
dup_sample['captured_at'] = dup_sample['captured_at'] + pd.to_timedelta(np.random.randint(0, 3, size=len(dup_sample)), unit='m')
df = pd.concat([df, dup_sample], ignore_index=True)

# Inject some anomalous bursts (one grower with implausibly many captures in a short window)
burst_grower = grower_ids[0]
burst_rows = []
burst_start = start_date + timedelta(days=100)
for j in range(30):
    burst_rows.append({
        'capture_id': f"cap_burst_{j}",
        'grower_id': burst_grower,
        'captured_at': burst_start + timedelta(minutes=j),
        'lat': region_centers[grower_region[burst_grower]][0] + np.random.normal(0, 0.001),
        'lon': region_centers[grower_region[burst_grower]][1] + np.random.normal(0, 0.001),
        'species': np.random.choice(SPECIES),
        'region': grower_region[burst_grower],
        'verification_status': 'unverified',
    })
df = pd.concat([df, pd.DataFrame(burst_rows)], ignore_index=True)

df.to_csv('analytics/synthetic_captures.csv', index=False)
print(f"Generated {len(df)} synthetic capture records -> synthetic_captures.csv")
print(df.head())