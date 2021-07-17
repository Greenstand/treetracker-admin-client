import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Drawer,
  Typography,
  Divider,
  Box,
  IconButton,
} from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import OptimizedImage from './OptimizedImage';

const useStyle = makeStyles((theme) => ({
  root: {
    width: 441,
  },
  box: {
    padding: theme.spacing(4),
  },
  cardMedia: {
    height: '378px',
  },
  personBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgray',
    height: '100%',
  },
  person: {
    height: 180,
    width: 180,
    fill: 'gray',
  },
  name: {
    textTransform: 'capitalize',
  },
  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    transform: 'translate(-50%, 50%)',
  },
  imageContainer: {
    position: 'relative',
    height: '378px',
  },
}));

const CaptureDetails = (props) => {
  let { capture, isDetailsPaneOpen, closeDrawer } = props;
  const classes = useStyle();
  // const captureImage =
  //   capture.imageUrl !== null ? (
  //     <img
  //       className="capture-image"
  //       src={capture.imageUrl}
  //       alt={`capture ${capture.id}`}
  //     />
  //   ) : null;
  const isAlive = capture.causeOfDeathId !== null ? 'Dead' : 'Alive';
  const captureMissing = capture.missing ? 'True' : 'False';

  return (
    <Drawer anchor="right" open={isDetailsPaneOpen} onClose={closeDrawer}>
      <Grid className={classes.root}>
        <Grid container direction="column">
          <Grid item>
            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                <Box m={4}>
                  <Typography color="primary" variant="h6">
                    Capture Detail
                  </Typography>
                </Box>
              </Grid>
              <Grid item>
                <IconButton onClick={() => closeDrawer()}>
                  <Close />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
          <Grid item className={classes.imageContainer}>
            {capture.imageUrl && (
              <OptimizedImage
                src={capture.imageUrl}
                width={441}
                height={378}
                className={classes.cardMedia}
                fixed
              />
            )}
          </Grid>
          <Grid container direction="column" className={classes.box}>
            <Typography variant="subtitle1">Location</Typography>
            <Typography variant="body1">
              Lat: {capture.lat || '---'}, Lon: {capture.lon || '---'}
            </Typography>
          </Grid>
          <Divider />
          <Grid container direction="column" className={classes.box}>
            <Typography variant="subtitle1">Status</Typography>
            <Typography variant="body1">{isAlive || '---'}</Typography>
          </Grid>
          <Divider />
          <Grid container direction="column" className={classes.box}>
            <Typography variant="subtitle1">Missing</Typography>
            <Typography variant="body1">{captureMissing || '---'}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Drawer>
  );

  // return (
  //   <Drawer anchor="right" open={isDetailsPaneOpen} onClose={closeDrawer}>
  //     <div className="capture-panel">
  //       {captureImage}
  //       <p className="capture-location">
  //         Location: {capture.lat} {capture.lon}
  //       </p>
  //       <p className="capture-dead">Status: {isAlive}</p>
  //       <p className="capture-missing">Missing: {captureMissing}</p>
  //     </div>
  //   </Drawer>
  // );
};

export default CaptureDetails;
