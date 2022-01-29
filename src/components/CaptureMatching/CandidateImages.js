import React, { useState, useEffect } from 'react';

import { Typography, Box, Button, Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import theme from '../common/theme';

const useStyles = makeStyles({
  containerBox: {
    marginTop: 0,
    marginBottom: theme.spacing(5),
    paddingBottom: theme.spacing(2),
    background: '#fff',
    borderRadius: '4px',
  },

  headerBox: {
    display: 'flex',
  },

  imgContainer: {
    height: '100%',
    padding: '5px',
    objectFit: 'cover',
    paddingBottom: '10px',
    overFlow: 'hidden',
  },
  gridList: {
    padding: '10px',
    display: 'flex',
    flexDirection: 'row',
    overflowX: 'auto',
    overflowY: 'hidden',
  },

  imageScroll: {
    // height: '76vh',
    // overflow: 'scroll',
  },

  candidateImgBtn: {
    padding: theme.spacing(5, 4),
    display: 'flex',
    gap: theme.spacing(2),
  },
  button: {
    fontSize: '16px',
  },
  box2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    padding: '8px 16px',
  },
  box3: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box1: {
    width: '24px',
    height: '24px',
    backgroundColor: '#75B926',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  },
});

function CandidateImages({ candidateImgData, sameTreeHandler }) {
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
                  onClick={() => showImgBox(tree.id)}
                >
                  <Box className={classes.box3}>
                    <Paper elevation={0} className={classes.box1}>
                      {++i}
                    </Paper>
                    <Typography variant="h5" style={{ padding: '10px' }}>
                      Tree {tree.tree_id}
                    </Typography>
                  </Box>
                  <Box>{/* button */}</Box>
                </Grid>
              </Box>

              {showBox.includes(tree.id) ? (
                <Box>
                  {tree.captures.length ? (
                    <Box className={classes.gridList} cols={3}>
                      {tree.captures.map((capture) => {
                        return (
                          <Box
                            style={{ height: '300px', color: 'blue' }}
                            key={capture.id}
                          >
                            <img
                              className={classes.imgContainer}
                              src={capture.image_url}
                              alt={`Candidate capture ${capture.id}`}
                            />
                          </Box>
                        );
                      })}
                    </Box>
                  ) : (
                    <Box
                      style={{ height: '300px', color: 'blue' }}
                      key={tree.id}
                    >
                      <img
                        className={classes.imgContainer}
                        src={tree.image_url}
                        alt={`Candidate capture ${tree.id}`}
                      />
                    </Box>
                  )}

                  <Box className={classes.candidateImgBtn}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<CheckIcon />}
                      onClick={() => sameTreeHandler(tree.id)}
                      style={{ color: 'white' }}
                      className={classes.button}
                    >
                      Same Tree
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
                      Different Tree
                    </Button>
                  </Box>
                </Box>
              ) : null}
            </Paper>
          );
        })}
    </Box>
  );
}

export default CandidateImages;
