import React, { useState, useEffect } from 'react';

import { Typography, Box, Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import theme from '../common/theme';

const useStyles = makeStyles({
  containerBox: {
    margin: theme.spacing(5),
    paddingBottom: theme.spacing(2),
    background: '#fff',
    borderRadius: '4px',
  },

  headerBox: {
    display: 'flex',
  },

  imgContainer: {
    width: '350px',
    height: 'auto',
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
  },

  imageScroll: {
    height: '100vh',
    overflow: 'scroll',
  },

  candidateImgBtn: {
    marginTop: '10px',
  },
});

function CandidateImages(props) {
  const classes = useStyles();

  const cadidateImgData = props.cadidateImgData;

  const [showBox, setShowBox] = useState([]);

  useEffect(() => {
    const initialCandidateData = cadidateImgData.map((tree) => tree.tree_id);
    setShowBox(initialCandidateData);
  }, [cadidateImgData]);

  const hideImgBox = (i) => {
    const newInitialState = showBox.filter((id) => id !== i);
    setShowBox(newInitialState);
  };

  const showImgBox = (i) => {
    setShowBox([...showBox, i]);
  };

  return (
    <Box className={classes.imageScroll}>
      {cadidateImgData.map((tree, i) => {
        return (
          <Box className={classes.containerBox} key={tree.tree_id}>
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
                      // console.log(tree.captures)
                      return (
                        <Box
                          style={{ height: '300px' }}
                          key={capture.captureId}
                        >
                          <img
                            className={classes.imgContainer}
                            src={capture.imageUrl}
                            alt={`Candidate capture ${capture.captureId}`}
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
                    onClick={() => props.sameTreeHandler(tree.tree_id)}
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
