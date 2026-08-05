# Grower Impact & Data Quality Analytics

**Branch:** `data-quality-analytics`
**Contributor:** Jueeli Sawant ([@jueeli97](https://github.com/jueeli97))
**Approved by:** Sebastian Gärtner, VP of Programs, Greenstand
**Status:** In progress

## What This Is

This branch contains a Data Analytics / Data Science initiative analyzing Greenstand's Treetracker data — focused on grower activity trends and data quality (duplicate/anomalous capture detection). It is kept separate from the main application code, since this work is analysis-focused (SQL, Python, Power BI), not a change to the Admin Panel application itself.

This directly supports the Admin Panel's stated purpose of _"verifying, processing, and managing data collected by the Treetracker app"_ — the data quality component extends **verifying**, and activity reporting extends **managing**.

## Contents

```
analytics/
├── notebooks/     Python/Jupyter notebooks (EDA, duplicate detection, anomaly detection, etc.)
├── sql/            SQL queries used for data extraction and rule-based checks
└── dashboard/       Power BI file and related assets
```

## Project Phases

| Phase | Focus                                            | Status      |
| ----- | ------------------------------------------------ | ----------- |
| 1     | Exploratory Data Analysis & activity metrics     | In progress |
| 2     | Rule-based duplicate/data quality detection      | Planned     |
| 3     | ML-based anomaly detection (Isolation Forest)    | Planned     |
| 4     | Geospatial analysis of activity/anomaly patterns | Planned     |
| 5     | Tree survival prediction model                   | Planned     |
| 6     | Forecasting of activity trends                   | Planned     |
| 7     | Consolidated reporting (Power BI + findings)     | Planned     |

## Data Source

Data is accessed via Greenstand's Treetracker reporting API / denormalized tables (`treetracker-database`, `treetracker-denormalization`) — no new data collection or schema changes involved.
