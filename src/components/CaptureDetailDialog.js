import React, { Fragment, useRef, useState, useEffect } from 'react';

import compose from 'recompose/compose';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';

import FileCopy from '@material-ui/icons/FileCopy';
import CloseIcon from '@material-ui/icons/Close';
import OptimizedImage from './OptimizedImage';
import LinkToWebmap from './common/LinkToWebmap';
import { verificationStates } from '../common/variables';

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
  copyButton: {
    margin: theme.spacing(-2, 0),
  },
  subtitle: {
    ...theme.typography.button,
    fontSize: '0.8em',
    color: 'rgba(0,0,0,0.5)',
  },
}));

function CaptureDetailDialog(props) {
  const { open, TransitionComponent, capture } = props;

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarLabel, setSnackbarLabel] = useState('');
  const [renderCapture, setRenderCapture] = useState(capture);
  const classes = useStyles();
  const textAreaRef = useRef(null);

  useEffect(() => {
    props.captureDetailDispatch.getCaptureDetail(props.capture.id);
  }, [props.captureDetailDispatch, props.capture]);

  /*
   * Render the most complete capture detail we have
   */
  useEffect(() => {
    if (props.captureDetail.capture) {
      setRenderCapture(props.captureDetail.capture);
    } else {
      setRenderCapture(props.capture);
    }
  }, [props.captureDetail, props.capture]);

  function handleClose() {
    setSnackbarOpen(false);
    setSnackbarLabel('');
    props.captureDetailDispatch.reset();
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

    function handleSnackbarClose(event, reason) {
      if (reason === 'clickaway') {
        return;
      }
      setSnackbarOpen(false);
    }

    function CopyButton(props) {
      const { value, label } = props;

      return (
        <IconButton
          className={classes.copyButton}
          title="Copy to clipboard"
          onClick={() => {
            navigator.clipboard.writeText(value);
            confirmCopy(label);
          }}
        >
          <FileCopy fontSize="small" />
        </IconButton>
      );
    }

    return (
      <Grid item container direction="column" spacing={4}>
        <Grid item>
          <Typography color="primary" variant="h6">
            Capture <LinkToWebmap value={capture.id} type="tree" />
            <CopyButton label="Capture ID" value={capture.id} />
          </Typography>
        </Grid>
        <Divider />
        <Grid item>
          <Typography className={classes.subtitle}>Capture Data</Typography>
          {[
            {
              label: 'Planter ID',
              value: capture.planterId,
              copy: true,
              link: true,
            },
            {
              label: 'Planter Identifier',
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
          ].map((item) => (
            <Fragment key={item.label}>
              <Grid item>
                <Typography variant="subtitle1">{item.label}</Typography>
                <Typography variant="body1">
                  {item.link ? (
                    <LinkToWebmap value={item.value} type="user" />
                  ) : (
                    item.value || '---'
                  )}
                  {item.value && item.copy && (
                    <CopyButton label={item.label} value={item.value} />
                  )}
                </Typography>
              </Grid>
            </Fragment>
          ))}
        </Grid>
        <Divider />
        <Grid item>
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
        <Grid item>
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
        <Grid item>
          <Typography className={classes.subtitle}>Capture Token</Typography>
          <Typography variant="body1">
            {getTokenStatus(capture.tokenId)}
          </Typography>
        </Grid>
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          key={snackbarLabel.length ? snackbarLabel : undefined}
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={handleSnackbarClose}
          message={`${snackbarLabel} copied to clipboard`}
          color="primary"
          action={
            <Fragment>
              <IconButton
                size="small"
                aria-label="close"
                onClick={handleSnackbarClose}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Fragment>
          }
        />
      </Grid>
    );
  }

  return (
    <Dialog
      open={open}
      TransitionComponent={TransitionComponent}
      onClose={handleClose}
      maxWidth="xl"
    >
      <DialogContent>
        <Grid container spacing={4} wrap="nowrap">
          <Grid item>
            <OptimizedImage
              src={renderCapture.imageUrl}
              width={640}
              style={{ maxWidth: '100%' }}
              fixed
            />
          </Grid>
          <Grid container item style={{ width: '300px' }} spacing={2}>
            <Grid container direction="row" spacing={4}>
              <Tags
                capture={renderCapture}
                species={props.captureDetail.species}
                captureTags={props.captureDetail.tags}
              />
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions justify="center">
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
      <textarea ref={textAreaRef} hidden />
    </Dialog>
  );
}

const mapState = (state) => ({
  captureDetail: state.captureDetail,
});

const mapDispatch = (dispatch) => ({
  captureDetailDispatch: dispatch.captureDetail,
});

const getTokenStatus = (tokenId) => {
  if (tokenId === undefined) {
    return 'Impact token status unknown';
  } else if (tokenId === null) {
    return 'Impact token not issued';
  } else {
    return 'Impact token issued';
  }
};

export default compose(connect(mapState, mapDispatch))(CaptureDetailDialog);
