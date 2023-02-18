import React, { useState, useEffect, useContext, useMemo } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Dialog,
  Grid,
  Divider,
  Chip,
  IconButton,
  Drawer,
  Box,
  Link,
  CircularProgress,
  Container,
  Button,
} from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import OptimizedImage from './OptimizedImage';
import LinkToWebmap, { pathType } from './common/LinkToWebmap';
import { verificationStates } from '../common/variables';
import { CaptureDetailContext } from '../context/CaptureDetailContext';
import CopyNotification from './common/CopyNotification';
import { CopyButton } from './common/CopyButton';
import Country from './common/Country';
import Skeleton from '@material-ui/lab/Skeleton';
import { captureStatus } from '../common/variables';
import { hasPermission, POLICIES } from '../models/auth';
import { AppContext } from '../context/AppContext';
import theme from './common/theme';
import log from 'loglevel';

const useStyles = makeStyles((theme) => ({
  chipRoot: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: theme.spacing(0, -1),
  },
  chip: {
    margin: theme.spacing(0.5),
    fontSize: '0.7rem',
    '& .MuiChip-deleteIcon': {
      opacity: '.25',
      transition: 'opacity .125s',
    },
    '&:hover .MuiChip-deleteIcon': {
      opacity: '1',
    },
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
  paper: {
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
  itemValue: {
    lineHeight: 1.7,
  },
  spinner: {
    position: 'fixed',
  },
}));

function CaptureDetailDialog({
  open,
  captureId,
  onClose,
  page,
  onCaptureTagDelete,
}) {
  const cdContext = useContext(CaptureDetailContext);
  const appContext = useContext(AppContext);
  const hasApproveTreePermission = hasPermission(appContext.user, [
    POLICIES.APPROVE_TREE,
    POLICIES.SUPER_PERMISSION,
  ]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarLabel, setSnackbarLabel] = useState('');
  const [renderCapture, setRenderCapture] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [captureTagDeletionTarget, setCaptureTagDeletionTarget] = useState(
    undefined
  );
  const classes = useStyles();

  // This is causing unnecessary re-renders right now, but may be useful if we want to navigate between captures by id
  useEffect(() => {
    // prevent request because it will fail without a valid id
    if (captureId) {
      cdContext.getCaptureDetail(captureId, page);
    }
  }, [captureId]);

  /*
   * Render the most complete capture detail we have
   */
  useEffect(() => {
    const current = cdContext.capture;
    if (current) {
      // map the keys from legacy to new api keys
      setRenderCapture({ ...current });
    }
    if (isLoading) {
      setIsLoading(false);
    }
    setIsImageLoading(true);
  }, [cdContext.capture]);

  useEffect(() => {
    setIsLoading(true);
  }, [open]);

  async function handleCaptureTagDeletion({ capture, tag }) {
    try {
      await cdContext.deleteCaptureTag({
        captureId: capture?.id,
        tagId: tag?.tag_id,
      });

      onCaptureTagDelete && onCaptureTagDelete();
    } catch (error) {
      console.log(error);
    }

    setCaptureTagDeletionTarget(undefined);
  }

  function handleClose() {
    setSnackbarOpen(false);
    setSnackbarLabel('');
    setCaptureTagDeletionTarget(undefined);
    cdContext.reset();
    onClose();
  }

  function Tags(props) {
    const { capture, species, captureTags } = props;
    const otherTags = [
      capture.morphology,
      capture.age,
      capture.captureApprovalTag,
      capture.rejectionReason,
    ].filter((tag) => !!tag);

    log.debug('OTHER TAGS', otherTags);

    const dateCreated = new Date(Date.parse(capture.created_at));
    function confirmCopy(label) {
      setSnackbarOpen(false);
      setSnackbarLabel(label);
      setSnackbarOpen(true);
    }

    const countryInfo = useMemo(
      () => <Country lat={capture?.lat} lon={capture?.lon} />,
      [capture?.lat, capture?.lon]
    );

    return (
      <Grid container direction="column">
        <Grid item>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Box m={4}>
                <Typography color="primary" variant="h6">
                  Capture <LinkToWebmap value={capture} type={pathType.tree} />
                  <CopyButton
                    label="Capture ID"
                    value={capture.reference_id}
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
              label: 'Grower Account ID',
              value: capture.grower_account_id,
              copy: true,
              link: true,
            },
            {
              label: 'Wallet',
              value: capture.wallet,
              copy: true,
            },
            {
              label: 'Device Identifier',
              value: capture.device_identifier,
              copy: true,
            },
            { label: 'Created', value: dateCreated.toLocaleString() },
            { label: 'Note', value: capture?.note },
            {
              label: 'Original Image URL',
              value: renderCapture.image_url,
              copy: true,
              link: true,
              image: true,
            },
          ].map((item) => (
            <Grid item key={item.label}>
              <Typography variant="subtitle1">{item.label}</Typography>
              <Typography variant="body1" className={classes.itemValue}>
                {item.link ? (
                  // a link is either a GrowerID (item.image == false) or OriginalImage (item.image == true)
                  item.image ? (
                    <Link
                      href={renderCapture.image_url}
                      underline="always"
                      target="_blank"
                    >
                      Open in new tab
                    </Link>
                  ) : (
                    <LinkToWebmap value={item.value} type={pathType.planter} />
                  )
                ) : item.value ? (
                  item.value
                ) : isLoading ? (
                  <Skeleton variant="text" />
                ) : (
                  '---'
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
            <Typography variant="body1" className={classes.itemValue}>
              {isLoading ? (
                <Skeleton variant="text" />
              ) : (
                capture?.lat && capture?.lon && countryInfo
              )}
            </Typography>
          </Grid>
        </Grid>
        <Divider />
        <Grid item className={classes.box}>
          <Typography className={classes.subtitle}>
            Verification Status
          </Typography>
          {capture.status === captureStatus.UNPROCESSED ? (
            <Chip
              label={verificationStates.AWAITING}
              className={classes.awaitingChip}
            />
          ) : // Verify will have status of 'approved', Captures and CaptureMatch will have status of 'active' because all captures are approved
          capture.status === captureStatus.APPROVED ||
            capture.status === 'active' ? (
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
          {otherTags.length + captureTags.length === 0 ? (
            <Typography variant="body1">---</Typography>
          ) : (
            <>
              <div className={classes.chipRoot}>
                {otherTags.map((tag) => (
                  <Chip key={tag} label={tag} className={classes.chip} />
                ))}

                {captureTags.flat().map((tag) => (
                  <Chip
                    key={tag.tag_name}
                    label={tag.tag_name}
                    className={classes.chip}
                    onDelete={
                      hasApproveTreePermission === true
                        ? () => {
                            setCaptureTagDeletionTarget({
                              capture: cdContext.capture,
                              tag,
                            });
                          }
                        : undefined
                    }
                  />
                ))}
              </div>

              {captureTagDeletionTarget !== undefined && (
                <>
                  <Container
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0px',
                      marginTop: '1em',
                    }}
                  >
                    <Typography>
                      Remove tag{' '}
                      <b>{`"${captureTagDeletionTarget.tag?.tag_name}"`}</b> ?
                    </Typography>
                  </Container>

                  <Container
                    style={{
                      padding: '0px',
                      display: 'flex',
                      justifyContent: 'end',
                      alignItems: 'center',
                    }}
                  >
                    <Button
                      onClick={() => setCaptureTagDeletionTarget(undefined)}
                      size="small"
                      style={{
                        margin: '.5rem',
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() =>
                        handleCaptureTagDeletion(captureTagDeletionTarget)
                      }
                      size="small"
                      style={{
                        margin: '.5em',
                        fontWeight: 'bold',
                        color: theme.palette.stats.white,
                        backgroundColor: theme.palette.stats.red,
                      }}
                    >
                      Remove
                    </Button>
                  </Container>
                </>
              )}
            </>
          )}
        </Grid>
        <Divider />
        <Grid item className={classes.box}>
          <Typography className={classes.subtitle}>Capture Token</Typography>
          <Typography variant="body1">
            {getTokenStatus(capture.token_id)}
            {capture && capture.token_id && (
              <CopyButton
                label="Capture Token"
                value={capture.token_id}
                confirmCopy={confirmCopy}
              />
            )}
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
    renderCapture && (
      <>
        <Dialog
          open={open}
          onClose={handleClose}
          style={{ width: 'calc(100vw - 340px)' }}
          BackdropProps={{
            classes: {
              root: classes.dialog,
            },
          }}
          maxWidth="md"
        >
          {isLoading ? (
            <CircularProgress className={classes.spinner} />
          ) : (
            <>
              {isImageLoading && (
                <CircularProgress className={classes.spinner} />
              )}

              <OptimizedImage
                src={renderCapture?.image_url}
                width={window.innerHeight * 0.9}
                style={{ maxWidth: '100%' }}
                objectFit="contain"
                fixed
                onImageReady={() => {
                  setIsImageLoading(false);
                }}
              />
            </>
          )}
        </Dialog>
        <Drawer
          anchor="right"
          open={open}
          className={classes.drawer}
          onClose={handleClose}
          classes={{ paper: classes.paper }}
        >
          <Grid container direction="column">
            <Tags
              capture={renderCapture}
              species={cdContext.species}
              captureTags={cdContext.tags}
            />
          </Grid>
        </Drawer>
      </>
    )
  );
}

const getTokenStatus = (tokenId) => {
  if (tokenId === undefined) {
    return 'Impact token status unknown';
  } else if (tokenId === null) {
    return 'Impact token not issued';
  } else {
    return tokenId;
  }
};

export default CaptureDetailDialog;
