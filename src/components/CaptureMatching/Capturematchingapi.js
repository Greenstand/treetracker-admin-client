import { getDistance } from 'geolib';
import api from './treeTrackerApi';

const GPS_STRONG_M = 3;
const GPS_WEAK_M = 10;
const TIME_GAP_DAYS = 90;
const WEIGHTS = { gps: 0.45, grower: 0.30, time: 0.25 };

export function gpsDistanceScore(distanceM) {
  if (distanceM <= GPS_STRONG_M) return 1.0;
  if (distanceM >= GPS_WEAK_M) return 0.0;
  return 1.0 - (distanceM - GPS_STRONG_M) / (GPS_WEAK_M - GPS_STRONG_M);
}

export function sameGrowerScore(candidateGrowerId, referenceGrowerId) {
  if (!candidateGrowerId || !referenceGrowerId) return 0.0;
  return candidateGrowerId === referenceGrowerId ? 1.0 : 0.0;
}

export function timeGapScore(captureDate, lastCaptureDate) {
  const gapDays = Math.abs(
    (new Date(captureDate) - new Date(lastCaptureDate)) / (1000 * 60 * 60 * 24)
  );
  if (gapDays <= 0) return 1.0;
  if (gapDays >= TIME_GAP_DAYS) return 0.0;
  return 1.0 - gapDays / TIME_GAP_DAYS;
}

export function computeMatchScore({
  distanceM,
  candidateGrowerId,
  referenceGrowerId,
  captureDate,
  lastCaptureDate,
}) {
  const gpsScore    = gpsDistanceScore(distanceM);
  const growerScore = sameGrowerScore(candidateGrowerId, referenceGrowerId);
  const timeScore   = timeGapScore(captureDate, lastCaptureDate);
  const matchScore  =
    WEIGHTS.gps * gpsScore + WEIGHTS.grower * growerScore + WEIGHTS.time * timeScore;

  const label =
    matchScore >= 0.70 ? 'Strong' :
    matchScore >= 0.40 ? 'Moderate' :
                         'Weak';

  return {
    gpsScore:    Math.round(gpsScore    * 1000) / 1000,
    growerScore: Math.round(growerScore * 1000) / 1000,
    timeScore:   Math.round(timeScore   * 1000) / 1000,
    matchScore:  Math.round(matchScore  * 1000) / 1000,
    distanceM:   Math.round(distanceM * 10) / 10,
    label,
  };
}

// 'close' | 'moderate' | 'far' mirrors GPS_STRONG_M / GPS_WEAK_M thresholds
export function distanceBadge(distanceM) {
  if (distanceM <= GPS_STRONG_M) return { text: `${distanceM.toFixed(1)} m — close`,    level: 'strong'   };
  if (distanceM >= GPS_WEAK_M)   return { text: `${distanceM.toFixed(1)} m — far`,      level: 'weak'     };
  return                                 { text: `${distanceM.toFixed(1)} m — moderate`, level: 'moderate' };
}

// Fetches candidates, scores each, and sorts Strong → Moderate → Weak
export async function fetchScoredCandidates(capture, abortController) {
  const data = await api.fetchCandidateTrees(capture.id, abortController);
  if (!data?.matches?.length) return [];

  const captureLat      = Number(capture.latitude ?? capture.lat ?? 0);
  const captureLon      = Number(capture.longitude ?? capture.lon ?? 0);
  const captureDate     = capture.captured_at;
  // Verify grower_account_id key name against real API response
  const captureGrowerId = capture.grower_account_id ?? null;

  const scored = data.matches.map((tree) => {
    const latest     = tree.captures?.[tree.captures.length - 1] ?? tree;
    const distanceM  = getDistance(
      { latitude: captureLat, longitude: captureLon },
      { latitude: Number(latest.latitude ?? latest.lat ?? 0),
        longitude: Number(latest.longitude ?? latest.lon ?? 0) }
    );
    const matchScoreData = computeMatchScore({
      distanceM,
      candidateGrowerId: tree.grower_account_id ?? latest.grower_account_id ?? null,
      referenceGrowerId: captureGrowerId,
      captureDate,
      lastCaptureDate: latest.captured_at ?? latest.timeCreated ?? captureDate,
    });
    return { ...tree, matchScoreData };
  });

  const labelOrder = { Strong: 0, Moderate: 1, Weak: 2 };
  return scored.sort((a, b) => {
    const diff = labelOrder[a.matchScoreData.label] - labelOrder[b.matchScoreData.label];
    return diff !== 0 ? diff : a.matchScoreData.distanceM - b.matchScoreData.distanceM;
  });
}