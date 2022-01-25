import React, { useState, useEffect } from 'react';

import { Typography, Box, Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import theme from '../common/theme';

const useStyles = makeStyles({
  containerBox: {
    marginTop: 0,
    marginRight: theme.spacing(5),
    marginBottom: theme.spacing(5),
    marginLeft: theme.spacing(5),
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
    height: '76vh',
    overflow: 'scroll',
  },

  candidateImgBtn: {
    marginTop: '10px',
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
            <Box className={classes.containerBox} key={`${i}-${tree.id}`}>
              <Box className={classes.headerBox}>
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="baseline"
                  onClick={() => showImgBox(tree.id)}
                >
                  <Box>
                    <Typography variant="h5" style={{ padding: '10px' }}>
                      Tree {tree.tree_id}
                    </Typography>
                  </Box>
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
                      style={{ margin: '0 0 20px 20px' }}
                      variant="contained"
                      color="primary"
                      startIcon={<CheckIcon />}
                      onClick={() => sameTreeHandler(tree.id)}
                    >
                      Same Tree
                    </Button>
                    <Button
                      style={{ margin: '0 0 20px 20px' }}
                      id={tree.tree_id}
                      variant="outlined"
                      color="primary"
                      startIcon={<ClearIcon />}
                      onClick={() => hideImgBox(tree.id)}
                      value={i}
                    >
                      Different Tree
                    </Button>
                  </Box>
                </Box>
              ) : null}
            </Box>
          );
        })}
    </Box>
  );
}

export default CandidateImages;
