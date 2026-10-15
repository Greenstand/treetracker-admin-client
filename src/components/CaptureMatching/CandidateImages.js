import React, { useState, useEffect } from 'react';

import {
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Tooltip,
  IconButton,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import theme from '../common/theme';
import OptimizedImage from 'components/OptimizedImage';
import CaptureDetailDialog from '../../components/CaptureDetailDialog';
import { CaptureDetailProvider } from '../../context/CaptureDetailContext';
import { Chip } from '@material-ui/core';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import { distanceBadge } from '../../api/captureMatchingApi';

const LABEL_COLORS = {
  Strong:   { bg: '#E1F5EE', color: '#0F6E56', border: '#5DCAA5' },
  Moderate: { bg: '#FAEEDA', color: '#854F0B', border: '#EF9F27' },
  Weak:     { bg: '#FCEBEB', color: '#A32D2D', border: '#E24B4A' },
};
 
const DIST_COLORS = {
  strong:   { bg: '#E1F5EE', color: '#0F6E56' },
  moderate: { bg: '#FAEEDA', color: '#854F0B' },
  weak:     { bg: '#FCEBEB', color: '#A32D2D' },
};

const useStyles = makeStyles({
  containerBox: {
    marginTop: 0,
    marginBottom: theme.spacing(5),
    background: '#fff',
    borderRadius: '4px',
    overflow: 'hidden',
  },

  expandMore: {
    transform: 'rotate(0deg)',
    transition: 'transform 250ms ease-in-out',
  },

  showLess: {
    cursor: 'pointer',
    transform: 'rotate(-180deg)',
    transition: 'transform 250ms ease-in-out',
  },

  headerBox: {
    display: 'flex',
    cursor: 'pointer',
  },
  gridList: {
    padding: theme.spacing(0, 4),
    display: 'flex',
    flexDirection: 'row',
    overflowX: 'auto',
    overflowY: 'hidden',
    gap: theme.spacing(4),
  },

  candidateImgBtn: {
    padding: theme.spacing(4),
    display: 'flex',
    gap: theme.spacing(2),
  },
  button: {
    fontSize: '16px',
  },
  box2: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    padding: theme.spacing(2),
  },
  box3: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  box1: {
    width: '24px',
    height: '24px',
    lineHeight: '24px',
    color: theme.palette.primary.main,
    border: `solid 1px ${theme.palette.primary.main}`,
    borderRadius: '50%',
    textAlign: 'center',
  },
  candidateCaptureContainer: {
    position: 'relative',
  },
  captureInfo: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    background: 'rgba(0,0,0,0.7)',
    color: theme.palette.primary.main,
  },
  captureInfoDetail: {
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing(2),
    gap: theme.spacing(1),
  },
  candidateTreeContent: {
    transition: 'max-height 250ms ease-in-out',
  },
  scoreSection: {
    padding: theme.spacing(1, 4, 0),
  },
  scoreRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(0.5),
  },
  scoreLabel: {
    fontSize: '11px',
    color: '#6E6E6E',
    width: '72px',
    flexShrink: 0,
  },
  barBg: {
    flex: 1,
    height: '4px',
    background: '#E5E5E5',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  scorePct: {
    fontSize: '11px',
    color: '#6E6E6E',
    width: '32px',
    textAlign: 'right',
  },
  historyRow: {
    display: 'flex',
    gap: theme.spacing(3),
    padding: theme.spacing(1, 4),
    borderTop: '1px solid #F0F0F0',
    flexWrap: 'wrap',
  },
  histItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  histLabel: {
    fontSize: '10px',
    color: '#9E9E9E',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  histValue: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#333',
  },
});


function MatchLabel({ label }) {
  const c = LABEL_COLORS[label] || LABEL_COLORS.Weak;
  return (
    <Chip
      size="small"
      label={`${label} match`}
      style={{
        background: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
        fontWeight: 600,
        fontSize: '11px',
        height: '22px',
      }}
    />
  );
}
 
function DistanceBadge({ distanceM }) {
  const badge = distanceBadge(distanceM);
  const c = DIST_COLORS[badge.level];
  return (
    <Chip
      size="small"
      icon={<LocationOnOutlinedIcon style={{ fontSize: '13px', color: c.color }} />}
      label={badge.text}
      style={{ background: c.bg, color: c.color, fontSize: '11px', height: '22px' }}
    />
  );
}
 
function ScoreBar({ value, label }) {
  const classes = useStyles();
  const pct = Math.round(value * 100);
  const fill = pct >= 70 ? '#1D9E75' : pct >= 40 ? '#EF9F27' : '#E24B4A';
  return (
    <div className={classes.scoreRow}>
      <span className={classes.scoreLabel}>{label}</span>
      <div className={classes.barBg}>
        <div style={{ width: `${pct}%`, height: '100%', background: fill, borderRadius: '2px' }} />
      </div>
      <span className={classes.scorePct}>{pct}%</span>
    </div>
  );
}
 
function CaptureHistory({ tree }) {
  const classes = useStyles();
  const dates = (tree.captures || [])
    .map((c) => c.captured_at)
    .filter(Boolean)
    .map((d) => new Date(d))
    .sort((a, b) => a - b);
 
  const daysSinceLast = dates.length
    ? Math.round((Date.now() - dates[dates.length - 1]) / (1000 * 60 * 60 * 24))
    : null;
 
  return (
    <div className={classes.historyRow}>
      <div className={classes.histItem}>
        <span className={classes.histLabel}>Captures</span>
        <span className={classes.histValue}>{(tree.captures || []).length}</span>
      </div>
      <div className={classes.histItem}>
        <span className={classes.histLabel}>First seen</span>
        <span className={classes.histValue}>{dates[0]?.toISOString().slice(0, 7) ?? '—'}</span>
      </div>
      <div className={classes.histItem}>
        <span className={classes.histLabel}>Latest</span>
        <span className={classes.histValue}>{dates[dates.length - 1]?.toISOString().slice(0, 7) ?? '—'}</span>
      </div>
      {daysSinceLast !== null && (
        <div className={classes.histItem}>
          <span className={classes.histLabel}>Days since last</span>
          <span className={classes.histValue}>{daysSinceLast} days</span>
        </div>
      )}
    </div>
  );
}

function CandidateImages({ capture, candidateImgData, sameTreeHandler }) {
  const classes = useStyles();
  const [isDetailsPaneOpen, setIsDetailsPaneOpen] = useState(false);
  const [showBox, setShowBox] = useState([]);

  useEffect(() => {
    if (!candidateImgData?.length) return;
    // Auto-expand Strong matches; fall back to first candidate
    const autoOpen = candidateImgData
      .filter((t) => t.matchScoreData?.label === 'Strong')
      .map((t) => t.id);
    setShowBox(autoOpen.length ? autoOpen : [candidateImgData[0].id]);
  }, [candidateImgData]);

  const hideImgBox = (i) => {
    const newInitialState = showBox.filter((id) => id !== i);
    setShowBox(newInitialState);
  };

  const showImgBox = (i) => {
    setShowBox([...showBox, i]);
  };

  return (
    <>
      <Box className={classes.imageScroll}>
        {candidateImgData &&
          candidateImgData.map((tree, i) => {
            const score = tree.matchScoreData;
            const labelColor = LABEL_COLORS[score?.label] || LABEL_COLORS.Weak;
            const isSameGrower = score?.growerScore === 1.0;

            return (
              <Paper
                elevation={4}
                className={classes.containerBox}
                key={`${i}-${tree.id}`}
                style={score?.label === 'Strong' ? { borderLeft: `3px solid ${labelColor.border}` } : {}}
              >
                <Box className={classes.headerBox}>
                  <Grid
                    container
                    className={classes.box2}
                    onClick={() => {
                      showBox.includes(tree.id)
                        ? hideImgBox(tree.id)
                        : showImgBox(tree.id);
                    }}
                  >
                    <Box className={classes.box3}>
                      <Paper elevation={0} className={classes.box1}>
                        {i + 1}
                      </Paper>
                      <Tooltip title={tree.id} interactive>
                        <Typography variant="h5">
                          Tree {(tree.id + '').substring(0, 10) + '...'}
                        </Typography>
                      </Tooltip>
                      {isSameGrower && (
                        <Chip
                          size="small"
                          icon={<PersonOutlineIcon style={{ fontSize: '13px' }} />}
                          label="Same grower"
                          style={{ fontSize: '11px', height: '20px', background: '#E1F5EE', color: '#0F6E56' }}
                        />
                      )}
                    </Box>
                    <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {score && <DistanceBadge distanceM={score.distanceM} />}
                      {score && <MatchLabel label={score.label} />}
                      <IconButton
                        id={`ExpandIcon_${tree.id}`}
                        className={
                          showBox.includes(tree.id)
                            ? classes.showLess
                            : classes.expandMore
                        }
                        onClick={(event) => {
                          showBox.includes(tree.id)
                            ? hideImgBox(tree.id)
                            : showImgBox(tree.id);
                          event.stopPropagation();
                        }}
                      >
                        <ExpandMoreIcon
                          fontSize="large"
                          color="primary"
                          key={`expandIcon-${i}`}
                        />
                      </IconButton>
                    </Box>
                  </Grid>
                </Box>

                <Box
                  className={classes.candidateTreeContent}
                  style={{
                    maxHeight: showBox.includes(tree.id) ? '600px' : '0px',
                  }}
                >
                  <CaptureHistory tree={tree} />

                  {score && (
                    <div className={classes.scoreSection}>
                      <ScoreBar value={score.gpsScore}    label="GPS dist" />
                      <ScoreBar value={score.growerScore} label="Grower"   />
                      <ScoreBar value={score.timeScore}   label="Time gap" />
                    </div>
                  )}

                  <Box className={classes.gridList} cols={3}>
                    {(tree.captures.length ? tree.captures : [tree]).map(
                      (candidateCapture) => {
                        return (
                          <Box
                            key={`${tree.id}_${candidateCapture.id}`}
                            className={classes.candidateCaptureContainer}
                            onClick={() => setIsDetailsPaneOpen(candidateCapture.reference_id)}
                          >
                            <OptimizedImage
                              src={candidateCapture.image_url}
                              alt={`Candidate capture ${candidateCapture.id}`}
                              objectFit="cover"
                              width={250}
                              style={{
                                width: 'auto',
                                height: '350px',
                              }}
                              alertHeight="300px"
                              alertTextSize=".9rem"
                              alertTitleSize="1.2rem"
                            />
                            <Box className={classes.captureInfo}>
                              <Box className={classes.captureInfoDetail}>
                                <AccessTimeIcon />
                                <Typography variant="body1">
                                  {(candidateCapture.captured_at &&
                                    candidateCapture.captured_at.slice(0, 10)) ||
                                    'Unknown'}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        );
                      }
                    )}
                  </Box>

                  <Box className={classes.candidateImgBtn}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<CheckIcon />}
                      onClick={() => sameTreeHandler(tree.id)}
                      style={{ color: 'white' }}
                      className={classes.button}
                    >
                      Confirm Match
                    </Button>
                    <Button
                      id={tree.tree_id}
                      variant="outlined"
                      color="primary"
                      startIcon={<ClearIcon />}
                      onClick={() => hideImgBox(tree.id)}
                      className={classes.button}
                      value={i}
                    >
                      Dismiss
                    </Button>
                  </Box>
                </Box>
              </Paper>
            );
          })}
      </Box>
      {isDetailsPaneOpen !== false && (
        <CaptureDetailProvider>
          <CaptureDetailDialog
            open={true}
            captureId={isDetailsPaneOpen}
            onClose={() => setIsDetailsPaneOpen(false)}
          />
        </CaptureDetailProvider>
      )}
    </>
  );
}

export default CandidateImages;