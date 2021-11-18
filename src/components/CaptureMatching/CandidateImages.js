import React, { useState, useEffect } from 'react';

import { Typography, Box, Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
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
    const initialCandidateData = candidateImgData.map((tree) => tree.tree_id);
    setShowBox(initialCandidateData);
  }, [candidateImgData]);

  const hideImgBox = (i) => {
    const newInitialState = showBox.filter((id) => id !== i);
    setShowBox(newInitialState);
  };

  const showImgBox = (i) => {
    setShowBox([...showBox, i]);
  };

  console.log('candidates', candidateImgData);
  console.log('showBox', showBox);
  console.log('candidateImgData[0].captures', candidateImgData[0].captures);

  return (
    <Box className={classes.imageScroll}>
      {candidateImgData.map((tree, i) => {
        return (
          <Box className={classes.containerBox} key={`${i}-${tree.tree_id}`}>
            <Box className={classes.headerBox}>
              <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="baseline"
                onClick={() => showImgBox(tree.tree_id)}
              >
                <Box>
                  <Typography variant="h5" style={{ padding: '10px' }}>
                    Tree {tree.tree_id}
                  </Typography>
                </Box>
                <Box>
                  <ZoomOutMapIcon
                    style={{ paddingRight: '10px', fontSize: '34px' }}
                  />
                </Box>
              </Grid>
            </Box>

            {showBox.includes(tree.tree_id) ? (
              <Box>
                {typeof tree.captures === 'object' ? (
                  <Box className={classes.gridList} cols={3}>
                    {tree.captures.map((capture) => {
                      return (
                        <Box style={{ height: '300px' }} key={capture.id}>
                          <img
                            className={classes.imgContainer}
                            src={capture.image_url}
                            alt={`Candidate capture ${capture.id}`}
                          />
                        </Box>
                      );
                    })}
                  </Box>
                ) : null}

                <Box className={classes.candidateImgBtn}>
                  <Button
                    style={{ margin: '0 0 20px 20px' }}
                    variant="contained"
                    color="primary"
                    startIcon={<CheckIcon />}
                    onClick={() => sameTreeHandler(tree.tree_id)}
                  >
                    Same Tree
                  </Button>
                  <Button
                    style={{ margin: '0 0 20px 20px' }}
                    id={tree.tree_id}
                    variant="outlined"
                    color="primary"
                    startIcon={<ClearIcon />}
                    onClick={() => hideImgBox(tree.tree_id)}
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
