import React, { useState, useEffect, useCallback, useContext } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import Close from '@material-ui/icons/Close';
import OptimizedImage from './OptimizedImage';
import LinkToWebmap from './common/LinkToWebmap';
import { verificationStates } from '../common/variables';
import { CaptureDetailContext } from '../context/CaptureDetailContext';
import CopyNotification from './common/CopyNotification';
import { CopyButton } from './common/CopyButton';
import { Link } from '@material-ui/core';
import Country from './common/Country';

const useStyles = makeStyles((theme) => ({
  chipRoot: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: theme.spacing(0, -1),
  },
  chip: {
    margin: theme.spacing(0.5),
    fontSize: '0.7rem',
  },
  rejectedChip: {
    backgroundColor: theme.palette.stats.red.replace(/[^,]+(?=\))/, '0.2'), // Change opacity of rgba
    color: theme.palette.stats.red,
    fontWeight: 700,
    fontSize: '0.8em',
  },
  awaitingChip: {
    backgroundColor: theme.palette.stats.orange.replace(/[^,]+(?=\))/, '0.2'), // Change opacity of rgba
    color: theme.palette.stats.orange,
    fontWeight: 700,
    fontSize: '0.8em',
  },
  approvedChip: {
    backgroundColor: theme.palette.stats.green.replace(/[^,]+(?=\))/, '0.2'), // Change opacity of rgba
    color: theme.palette.stats.green,
    fontWeight: 700,
    fontSize: '0.8em',
  },
  subtitle: {
    ...theme.typography.button,
    fontSize: '0.8em',
    color: 'rgba(0,0,0,0.5)',
  },
  root: {
    width: 340,
  },
  drawer: {
    width: 0,
    // remove backdrop
    '& .MuiBackdrop-root': {
      display: 'none',
    },
  },
  dialog: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  box: {
    padding: theme.spacing(4),
  },
  imageLink: {
    position: 'absolute',
    bottom: 0,
    margin: '0 auto',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#fff',
  },
}));

function CaptureDetailDialog(props) {
  // console.log('render: capture detail dialog');
  const { open, capture } = props;
  const cdContext = useContext(CaptureDetailContext);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarLabel, setSnackbarLabel] = useState('');
  const [renderCapture, setRenderCapture] = useState(capture);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const resizeWindow = useCallback(() => {
    setScreenWidth(window.innerWidth);
    setScreenHeight(window.innerHeight);
  }, []);
  const classes = useStyles();

  useEffect(() => {
    cdContext.getCaptureDetail(capture?.id);
  }, [capture]);

  useEffect(() => {
    window.addEventListener('resize', resizeWindow);
    return () => {
      window.removeEventListener('resize', resizeWindow);
    };
  }, [resizeWindow]);

  /*
   * Render the most complete capture detail we have
   */
  useEffect(() => {
    if (cdContext.capture) {
      setRenderCapture(cdContext.capture);
    } else {
      setRenderCapture(capture);
    }
  }, [cdContext.capture, capture]);

  function handleClose() {
    setSnackbarOpen(false);
    setSnackbarLabel('');
    cdContext.reset();
    props.onClose();
  }

  function Tags(props) {
    const { capture, species, captureTags } = props;
    const allTags = [
      capture.morphology,
      capture.age,
      capture.captureApprovalTag,
      capture.rejectionReason,
      ...captureTags.map((t) => t.tagName),
    ].filter((tag) => !!tag);

    const dateCreated = new Date(Date.parse(capture.timeCreated));
    function confirmCopy(label) {
      setSnackbarOpen(false);
      setSnackbarLabel(label);
      setSnackbarOpen(true);
    }

    return (
      <Grid container direction="column">
        <Grid item>
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <Box m={4}>
                <Typography color="primary" variant="h6">
                  Capture <LinkToWebmap value={capture.id} type="tree" />
                  <CopyButton
                    label="Capture ID"
                    value={capture.id}
                    confirmCopy={confirmCopy}
                  />
                </Typography>
              </Box>
            </Grid>
            <Grid item>
              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        <Divider />
        <Grid item className={classes.box}>
          <Typography className={classes.subtitle}>Capture Data</Typography>
          {[
            {
              label: 'Grower ID',
              value: capture.planterId,
              copy: true,
              link: true,
            },
            {
              label: 'Grower Identifier',
              value: capture.planterIdentifier,
              copy: true,
            },
            {
              label: 'Device Identifier',
              value: capture.deviceIdentifier,
              copy: true,
            },
            { label: 'Created', value: dateCreated.toLocaleString() },
            { label: 'Note', value: renderCapture.note },
            {
              label: 'Original Image URL',
              value: renderCapture.imageUrl,
              copy: true,
              link: true,
              image: true,
            },
          ].map((item) => (
            <Grid item key={item.label}>
              <Typography variant="subtitle1">{item.label}</Typography>
              <Typography variant="body1">
                {item.link ? (
                  // a link is either a GrowerID (item.image == false) or OriginalImage (item.image == true)
                  item.image ? (
                    <Link
                      href={renderCapture.imageUrl}
                      underline="always"
                      target="_blank"
                    >
                      Open in new tab
                    </Link>
                  ) : (
                    <LinkToWebmap value={item.value} type="user" />
                  )
                ) : (
                  item.value || '---'
                )}
                {item.value && item.copy && (
                  <CopyButton
                    label={item.label}
                    value={item.value}
                    confirmCopy={confirmCopy}
                  />
                )}
              </Typography>
            </Grid>
          ))}
          <Grid>
            <Typography variant="subtitle1">Country</Typography>
            <Typography variant="body1">
              <Country lat={capture.lat} lon={capture.lon} />
            </Typography>
          </Grid>
        </Grid>
        <Divider />
        <Grid item className={classes.box}>
          <Typography className={classes.subtitle}>
            Verification Status
          </Typography>
          {!capture.approved && capture.active ? (
            <Chip
              label={verificationStates.AWAITING}
              className={classes.awaitingChip}
            />
          ) : capture.active && capture.approved ? (
            <Chip
              label={verificationStates.APPROVED}
              className={classes.approvedChip}
            />
          ) : (
            <Chip
              label={verificationStates.REJECTED}
              className={classes.rejectedChip}
            />
          )}
        </Grid>
        <Divider />
        <Grid item className={classes.box}>
          <Typography className={classes.subtitle}>Tags</Typography>
          <Typography variant="subtitle1">Species</Typography>
          {species && species.name ? (
            <Chip
              key={species && species.name}
              label={species && species.name}
              className={classes.chip}
            />
          ) : (
            <Typography variant="body1">---</Typography>
          )}

          <Typography variant="subtitle1">Other</Typography>
          {allTags.length === 0 ? (
            <Typography variant="body1">---</Typography>
          ) : (
            <div className={classes.chipRoot}>
              {allTags.map((tag) => (
                <Chip key={tag} label={tag} className={classes.chip} />
              ))}
            </div>
          )}
        </Grid>
        <Divider />
        <Grid item className={classes.box}>
          <Typography className={classes.subtitle}>Capture Token</Typography>
          <Typography variant="body1">
            {getTokenStatus(capture.tokenId)}
          </Typography>
        </Grid>
        <CopyNotification
          snackbarLabel={snackbarLabel}
          snackbarOpen={snackbarOpen}
          setSnackbarOpen={setSnackbarOpen}
        />
      </Grid>
    );
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        style={{ width: screenWidth - 340 }}
        BackdropProps={{
          classes: {
            root: classes.dialog,
          },
        }}
        maxWidth="md"
        maxHeight="fit-content"
      >
        <OptimizedImage
          src={renderCapture.imageUrl}
          width={screenHeight * 0.9}
          maxHeight={screenHeight * 0.9}
          style={{ maxWidth: '100%' }}
          objectFit="contain"
          fixed
        />
      </Dialog>
      <Drawer
        anchor="right"
        open={open}
        className={classes.drawer}
        onClose={handleClose}
      >
        <Grid className={classes.root}>
          <Grid container direction="column">
            <Tags
              capture={renderCapture}
              species={cdContext.species}
              captureTags={cdContext.tags}
            />
          </Grid>
        </Grid>
      </Drawer>
    </>
  );
}

const getTokenStatus = (tokenId) => {
  if (tokenId === undefined) {
    return 'Impact token status unknown';
  } else if (tokenId === null) {
    return 'Impact token not issued';
  } else {
    return 'Impact token issued';
  }
};

export default CaptureDetailDialog;
