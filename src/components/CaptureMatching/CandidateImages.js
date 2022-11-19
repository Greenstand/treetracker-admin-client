import React, { useState, useEffect, useMemo } from 'react';

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
// import { getDateStringLocale } from 'common/locale';
import { getDistance } from 'geolib';
import OptimizedImage from 'components/OptimizedImage';
import differenceInMonths from 'date-fns/differenceInMonths';

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

  const filteredCandidateImgData = useMemo(() => {
    const isOlderThanOneMonth = (tree) =>
      differenceInMonths(
        new Date(capture.created_at),
        new Date(tree.created_at)
      ) > 0;

    return candidateImgData.reduce((accumulator, tree) => {
      const captures = tree.captures.filter((capture) =>
        isOlderThanOneMonth(capture)
      );
      if (captures.length > 0 || isOlderThanOneMonth(tree)) {
        accumulator.push({
          ...tree,
          captures,
        });
      }
      return accumulator;
    }, []);
  }, [candidateImgData]);

  if (capture && filteredCandidateImgData.length === 0)
    return (
      <Box className={classes.noCandidateBox}>
        <Typography variant="h5">
          No candidate match found, this capture might be a new tree
        </Typography>
      </Box>
    );

  return (
    <Box className={classes.imageScroll}>
      {filteredCandidateImgData.map((tree, i) => {
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
                  <Tooltip title={tree.id}>
                    <Typography variant="h5">
                      Tree {(tree.id + '').substring(0, 10) + '...'}
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
                {(tree.captures.length ? tree.captures : [tree]).map(
                  (candidateCapture) => {
                    return (
                      <Box
                        key={`${tree.id}_${candidateCapture.id}`}
                        className={classes.candidateCaptureContainer}
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
                              {(candidateCapture.created_at &&
                                candidateCapture.created_at.slice(0, 10)) ||
                                'Unknown'}
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
  );
}

export default CandidateImages;
