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
import { getDateStringLocale } from 'common/locale';
import { getDistance } from 'geolib';
import OptimizedImage from 'components/OptimizedImage';
import { CopyButton } from '../common/CopyButton';
import CopyNotification from '../common/CopyNotification';

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
  candidateImageNotes: { fontStyle: 'italic', paddingTop: theme.spacing(1) },
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
    flexBasis: '250px',
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
});

function DistanceTo({ lat1, lon1, lat2, lon2 }) {
  const [content, setContent] = useState('');
  if (
    lat1 === undefined ||
    lon1 === undefined ||
    lat2 === undefined ||
    lon2 === undefined
  ) {
    setContent('');
  }

  useEffect(() => {
    const distance = getDistance(
      {
        latitude: Number(lat1),
        longitude: Number(lon1),
      },
      {
        latitude: Number(lat2),
        longitude: Number(lon2),
      }
    );
    setContent(`${distance}m away`);
  }, []);

  return <span>{content}</span>;
}

function CandidateImages({ capture, candidateImgData, sameTreeHandler }) {
  const classes = useStyles();

  const [showBox, setShowBox] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarLabel, setSnackbarLabel] = useState('');

  useEffect(() => {
    const initialCandidateData = candidateImgData.map((tree) => tree.id);
    setShowBox(initialCandidateData);
  }, [candidateImgData]);

  const hideImgBox = (i) => {
    const newInitialState = showBox.filter((id) => id !== i);
    setShowBox(newInitialState);
  };

  const showImgBox = (i) => {
    setShowBox([...showBox, i]);
  };

  const confirmCopy = (label) => {
    setSnackbarOpen(false);
    setSnackbarLabel(label);
    setSnackbarOpen(true);
  };

  return (
    <Box className={classes.imageScroll}>
      {candidateImgData &&
        candidateImgData.map((tree, i) => {
          return (
            <Paper
              elevation={4}
              className={classes.containerBox}
              key={`${i}-${tree.id}`}
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
                        <CopyButton
                          label={tree.id}
                          value={tree.id}
                          confirmCopy={confirmCopy}
                        />
                      </Typography>
                    </Tooltip>
                  </Box>
                  <Box>
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
                  maxHeight: showBox.includes(tree.id) ? '420px' : '0px',
                }}
              >
                <Box className={classes.gridList} cols={3}>
                  {(tree.captures?.length ? tree.captures : [tree]).map(
                    (candidateCapture) => {
                      return (
                        <Box
                          key={`${tree.id}_${candidateCapture.id}`}
                          className={classes.candidateCaptureContainer}
                        >
                          <Box style={{ position: 'relative' }}>
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
                                  {getDateStringLocale(
                                    new Date(
                                      candidateCapture.captured_at ||
                                      candidateCapture.created_at
                                    )
                                  )}
                                </Typography>
                              </Box>
                              <Box className={classes.captureInfoDetail}>
                                <LocationOnOutlinedIcon
                                  style={{
                                    cursor: 'pointer',
                                  }}
                                  onClick={() => {
                                    window.open(
                                      `https://www.google.com/maps/search/?api=1&query=${capture.latitude},${capture.longitude}`
                                    );
                                  }}
                                />
                                <Typography variant="body1">
                                  {capture?.latitude && capture?.longitude && (
                                    <DistanceTo
                                      lat1={capture.latitude}
                                      lon1={capture.longitude}
                                      lat2={
                                        candidateCapture.latitude ||
                                        candidateCapture.lat
                                      }
                                      lon2={
                                        candidateCapture.longitude ||
                                        candidateCapture.lon
                                      }
                                    />
                                  )}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                          {candidateCapture.notes && (
                            <Typography className={classes.candidateImageNotes}>
                              {candidateCapture.notes}
                            </Typography>
                          )}
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
      <CopyNotification
        snackbarLabel={snackbarLabel}
        snackbarOpen={snackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
      />
    </Box>
  );
}

export default CandidateImages;
