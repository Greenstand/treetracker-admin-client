import pandas as pd
import numpy as np
from datetime import datetime

GPS_STRONG_M = 3.0
GPS_WEAK_M = 10.0
TIME_GAP_DAYS = 90

WEIGHTS = {"gps": 0.45, "grower": 0.30, "time": 0.25}


def gps_distance_score(distance_m: float) -> float:
    if distance_m <= GPS_STRONG_M:
        return 1.0
    elif distance_m >= GPS_WEAK_M:
        return 0.0
    return 1.0 - (distance_m - GPS_STRONG_M) / (GPS_WEAK_M - GPS_STRONG_M)


def same_grower_score(grower_id_candidate: str, grower_id_reference: str) -> float:
    return 1.0 if grower_id_candidate == grower_id_reference else 0.0


def time_gap_score(capture_date: datetime, last_capture_date: datetime) -> float:
    gap_days = abs((capture_date - last_capture_date).days)
    if gap_days <= 0:
        return 1.0
    elif gap_days >= TIME_GAP_DAYS:
        return 0.0
    return 1.0 - (gap_days / TIME_GAP_DAYS)


def compute_match_score(distance_m, grower_id_candidate, grower_id_reference, capture_date, last_capture_date) -> dict:
    gps_s    = gps_distance_score(distance_m)
    grower_s = same_grower_score(grower_id_candidate, grower_id_reference)
    time_s   = time_gap_score(capture_date, last_capture_date)

    total = WEIGHTS["gps"] * gps_s + WEIGHTS["grower"] * grower_s + WEIGHTS["time"] * time_s
    label = "Strong" if total >= 0.70 else "Moderate" if total >= 0.40 else "Weak"

    return {
        "gps_score":    round(gps_s, 3),
        "grower_score": round(grower_s, 3),
        "time_score":   round(time_s, 3),
        "match_score":  round(total, 3),
        "label":        label,
    }


def extract_features(df: pd.DataFrame) -> pd.DataFrame:
    results = df.apply(lambda row: pd.Series(compute_match_score(
        distance_m             = row["distance_m"],
        grower_id_candidate    = row["grower_id_candidate"],
        grower_id_reference    = row["grower_id_reference"],
        capture_date           = pd.to_datetime(row["capture_date"]),
        last_capture_date      = pd.to_datetime(row["last_capture_date"]),
    )), axis=1)
    return pd.concat([df, results], axis=1)


def generate_mock_captures(n: int = 100, seed: int = 42) -> pd.DataFrame:
    rng = np.random.default_rng(seed)
    confirmed = rng.integers(0, 2, size=n).astype(bool)

    distance_m = np.where(
        confirmed,
        rng.uniform(0.5, 5.0, size=n),
        rng.uniform(5.0, 20.0, size=n),
    )

    same_grower = np.where(
        confirmed,
        rng.choice([True, False], size=n, p=[0.85, 0.15]),
        rng.choice([True, False], size=n, p=[0.30, 0.70]),
    )

    grower_ids = [f"G{str(i).zfill(4)}" for i in rng.integers(1, 200, size=n)]
    grower_id_reference = [
        gid if same else f"G{str(rng.integers(1, 200)).zfill(4)}"
        for gid, same in zip(grower_ids, same_grower)
    ]

    base_date = datetime(2024, 1, 1)
    capture_offsets = rng.integers(0, 365, size=n)
    gap_days = np.where(confirmed, rng.integers(1, 60, size=n), rng.integers(60, 200, size=n))

    capture_dates      = [base_date + pd.Timedelta(days=int(o)) for o in capture_offsets]
    last_capture_dates = [cd - pd.Timedelta(days=int(g)) for cd, g in zip(capture_dates, gap_days)]

    return pd.DataFrame({
        "distance_m":          distance_m.round(2),
        "grower_id_candidate": grower_ids,
        "grower_id_reference": grower_id_reference,
        "capture_date":        capture_dates,
        "last_capture_date":   last_capture_dates,
        "confirmed_match":     confirmed,
    })


if __name__ == "__main__":
    df = generate_mock_captures(n=200)
    df = extract_features(df)
    print(df[["distance_m", "match_score", "label", "confirmed_match"]].head(10).to_string(index=False))
    print("\nLabel distribution:\n", df["label"].value_counts())
    df["predicted_match"] = df["label"].isin(["Strong", "Moderate"])
    print(f"\nAccuracy: {(df['predicted_match'] == df['confirmed_match']).mean():.1%}")
