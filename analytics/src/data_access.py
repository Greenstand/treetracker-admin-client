"""
data_access.py -- single source of truth for where project data comes from.

Every phase notebook/script should import load_captures() / load_planters()
from here instead of reading CSVs directly. That way, switching from
synthetic placeholder data to the real live Treetracker DB/API is a ONE-LINE
change in this file (flip DATA_SOURCE, fill in the live-query functions) --
nothing in Phase 1-7 code needs to change at all, since they all consume the
same DataFrame shape either way.

Usage in any notebook/script:
    from data_access import load_captures, load_planters
    captures = load_captures()
    planters = load_planters()

Column contract (both sources must return these columns):
    captures: capture_id, planter_id, captured_at, lat, lon, species,
              country_name, verification_status, survived
    planters: planter_id, first_name, last_name, email, organization,
              phone, gender, country_name, continent_name, created_at
"""

import os
import pandas as pd

# ---------------------------------------------------------------
# THE ONE SWITCH. Change this to "live" once dev DB access is confirmed.
# Can also be overridden via env var: GREENSTAND_DATA_SOURCE=live
# ---------------------------------------------------------------
DATA_SOURCE = os.environ.get("GREENSTAND_DATA_SOURCE", "synthetic")

_HERE = os.path.dirname(os.path.abspath(__file__))
# CSVs live at analytics/ root (src/ and notebooks/ are both one level below it),
# not in a data/ subfolder -- matches the actual repo layout under analytics/.
_DATA_DIR = os.path.join(_HERE, "..")

REQUIRED_CAPTURE_COLS = [
    "capture_id", "planter_id", "captured_at", "lat", "lon",
    "species", "country_name", "verification_status",
]
REQUIRED_PLANTER_COLS = [
    "planter_id", "first_name", "last_name", "email", "organization",
    "phone", "gender", "country_name", "continent_name", "created_at",
]


def _validate(df, required_cols, name):
    missing = [c for c in required_cols if c not in df.columns]
    if missing:
        raise ValueError(
            f"{name} is missing required column(s) {missing}. "
            f"Every phase downstream assumes this contract -- fix the source "
            f"or update REQUIRED_*_COLS in data_access.py deliberately."
        )
    return df


def _load_captures_synthetic():
    path = os.path.join(_DATA_DIR, "synthetic_captures.csv")
    df = pd.read_csv(path, parse_dates=["captured_at"])
    return _validate(df, REQUIRED_CAPTURE_COLS, "synthetic captures")


def _load_planters_synthetic():
    path = os.path.join(_DATA_DIR, "synthetic_planters.csv")
    df = pd.read_csv(path, parse_dates=["created_at"])
    return _validate(df, REQUIRED_PLANTER_COLS, "synthetic planters")


def _load_captures_live():
    """
    TODO once dev DB / treetracker-reporting API access is confirmed:
    query the denormalized_captures table (or reporting API equivalent)
    and return a DataFrame with the same REQUIRED_CAPTURE_COLS.

    Example shape (fill in real connection details when available):

        import sqlalchemy
        engine = sqlalchemy.create_engine(os.environ["TREETRACKER_DB_URL"])
        query = '''
            SELECT capture_id, planter_id, captured_at, lat, lon, species,
                   country_name, verification_status, survived
            FROM denormalized_captures
        '''
        df = pd.read_sql(query, engine, parse_dates=["captured_at"])
        return _validate(df, REQUIRED_CAPTURE_COLS, "live captures")
    """
    raise NotImplementedError(
        "Live data access not yet configured -- fill in _load_captures_live() "
        "once dev DB credentials / reporting API access is confirmed, then set "
        "DATA_SOURCE = 'live' above (or GREENSTAND_DATA_SOURCE=live env var)."
    )


def _load_planters_live():
    """TODO -- same pattern as _load_captures_live(), for the planters/growers table."""
    raise NotImplementedError(
        "Live data access not yet configured -- fill in _load_planters_live()."
    )


def load_captures():
    if DATA_SOURCE == "synthetic":
        return _load_captures_synthetic()
    elif DATA_SOURCE == "live":
        return _load_captures_live()
    raise ValueError(f"Unknown DATA_SOURCE: {DATA_SOURCE!r} (expected 'synthetic' or 'live')")


def load_planters():
    if DATA_SOURCE == "synthetic":
        return _load_planters_synthetic()
    elif DATA_SOURCE == "live":
        return _load_planters_live()
    raise ValueError(f"Unknown DATA_SOURCE: {DATA_SOURCE!r} (expected 'synthetic' or 'live')")


if __name__ == "__main__":
    print(f"DATA_SOURCE = {DATA_SOURCE}")
    c = load_captures()
    p = load_planters()
    print(f"Captures: {c.shape}, Planters: {p.shape}")