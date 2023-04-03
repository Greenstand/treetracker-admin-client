import * as loglevel from 'loglevel';

import {
  Avatar,
  Box,
  Button,
  CardMedia,
  CircularProgress,
  Divider,
  Drawer,
  Fab,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@material-ui/core';
import {
  Clear,
  Close,
  Done,
  Edit as EditIcon,
  HourglassEmptyOutlined,
  Person,
} from '@material-ui/icons';
import LinkToWebmap, { pathType } from './common/LinkToWebmap';
import { POLICIES, hasPermission } from '../models/auth';
import React, { useContext, useEffect, useState } from 'react';

import { AppContext } from '../context/AppContext';
import { CopyButton } from './common/CopyButton';
import CopyNotification from './common/CopyNotification';
import EditGrower from './EditGrower';
import FilterModel from '../models/Filter';
import { GrowerContext } from '../context/GrowerContext';
import GrowerOrganization from './GrowerOrganization';
import { Link } from 'react-router-dom';
import { MessagingContext } from 'context/MessagingContext';
import OptimizedImage from './OptimizedImage';
import api from '../api/growers';
import { captureStatus } from '../common/variables';
import { getDateTimeStringLocale } from '../common/locale';
import { makeStyles } from '@material-ui/core/styles';
import treeTrackerApi from 'api/treeTrackerApi';

const log = loglevel.getLogger('../components/GrowerDetail.js');

const GROWER_IMAGE_SIZE = 440;

const useStyle = makeStyles((theme) => ({
  box: {
    padding: theme.spacing(4),
  },
  cardMedia: {
    height: `${GROWER_IMAGE_SIZE}px`,
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
    height: `${GROWER_IMAGE_SIZE}px`,
  },
  listCaptures: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  captures: {
    width: '100%',
  },
  liAvatar: {
    minWidth: 50,
  },
  boxItem: {
    flex: '1 1 auto',
    borderRadius: 10,
    border: '1px solid #ddd',
    margin: 2,
  },
  gutters: {
    paddingLeft: 12,
    paddingRight: 12,
  },
  messageButton: {
    background: theme.palette.primary.main,
    color: 'white',
    position: 'relative',
    right: -175,
    bottom: 90,
    borderRadius: '25px',
    '&:hover': {
      backgroundColor: '#fff',
      borderColor: theme.palette.primary.main,
      color: theme.palette.primary.main,
    },
  },
  paper: {
    width: GROWER_IMAGE_SIZE,
  },
  spinner: {
    position: 'fixed',
    top: `${GROWER_IMAGE_SIZE / 2}px`,
    right: `${GROWER_IMAGE_SIZE / 2}px`,
  },
}));

const GrowerDetail = ({ open, growerId, onClose }) => {
  // log.debug('render: grower detail', growerId);
  const classes = useStyle();
  const appContext = useContext(AppContext);
  const { growers } = useContext(GrowerContext);
  const { sendMessageFromGrower } = useContext(MessagingContext);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [grower, setGrower] = useState({});
  const [deviceIdentifiers, setDeviceIdentifiers] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarLabel, setSnackbarLabel] = useState('');
  const [verificationStatus, setVerificationStatus] = useState({});
  const [loading, setLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  function formatDevices(grower) {
    // deduplicate and format
    const devices = grower?.devices?.reduce((result, device) => {
      if (!device.device_identifier) return result;

      result[device.device_identifier] = {
        id: device.device_identifier,
        os:
          device.manufacturer?.toLowerCase() === 'apple'
            ? `iOS ${device.os_version && device.os_version}`
            : `Android ${device.os_version && device.os_version}: ${
                device.brand
              }`,
      };
      return result;
    }, {});

    return Object.values(devices);
  }

  useEffect(() => {
    setErrorMessage(null);
    async function loadGrowerDetail() {
      if (grower && grower.grower_account_id !== growerId) {
        setGrower({});
        setDeviceIdentifiers([]);
        setIsImageLoading(true);
        const match = await getGrower(growerId);

        if (match.error) {
          setErrorMessage(match.message);
        }

        setGrower(match);

        if (match?.devices?.length) {
          const devices = formatDevices(match);
          setDeviceIdentifiers(devices);
        }
      }
    }
    loadGrowerDetail();
    // eslint-disable-next-line
  }, [growerId, growers]);

  useEffect(() => {
    async function loadCaptures() {
      if (grower.id) {
        setLoading(true);
        const [
          approvedCount,
          awaitingCount,
          rejectedCount,
        ] = await Promise.all([
          getCaptureCountGrower(captureStatus.APPROVED, grower.id),
          getCaptureCountGrower(captureStatus.UNPROCESSED, grower.id),
          getCaptureCountGrower(captureStatus.REJECTED, grower.id),
        ]);

        setVerificationStatus({
          [captureStatus.APPROVED]: approvedCount,
          [captureStatus.UNPROCESSED]: awaitingCount,
          [captureStatus.REJECTED]: rejectedCount,
        });
        setLoading(false);
      }
    }
    loadCaptures();
  }, [grower]);

  async function getCaptureCountGrower(status, growerId) {
    let filter = new FilterModel();
    filter.grower_account_id = growerId?.toString();
    filter.status = status;
    log.warn('Need to get capture count for grower:', filter.status);
    const countResponse = await treeTrackerApi.getRawCaptureCount({ filter });
    return countResponse && countResponse.count ? countResponse.count : 0;
  }

  async function getGrower(id) {
    // Look for a match in the context first
    let grower = growers?.find((p) => p.id === id);

    if (!grower && id) {
      grower = await api.getGrower(id);
    }
    // throw error if no match at all
    return (
      grower || {
        error: true,
        message: 'Sorry! No grower info found',
      }
    );
  }

  function handleEditClick() {
    setEditDialogOpen(true);
  }

  function handleEditClose() {
    setEditDialogOpen(false);
    setSnackbarOpen(false);
    setSnackbarLabel('');
  }

  function confirmCopy(label) {
    setSnackbarOpen(false);
    setSnackbarLabel(label);
    setSnackbarOpen(true);
  }
  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        classes={{ paper: classes.paper }}
      >
        <Grid>
          {errorMessage ? (
            <Grid container direction="column">
              <Grid item>
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Grid item>
                    <Box m={4}>
                      <Typography color="primary" variant="h6">
                        Grower Detail
                      </Typography>
                      <Typography variant="h4">{errorMessage}</Typography>
                    </Box>
                  </Grid>
                  <Grid item>
                    <IconButton onClick={() => onClose()}>
                      <Close />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item className={classes.imageContainer}>
                <CardMedia className={classes.cardMedia}>
                  <Grid container className={classes.personBox}>
                    <Person className={classes.person} />
                  </Grid>
                </CardMedia>
              </Grid>
            </Grid>
          ) : (
            <Grid container direction="column">
              <Grid item>
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Grid item>
                    <Box m={4}>
                      <Typography color="primary" variant="h6">
                        Grower Detail
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item>
                    <IconButton onClick={() => onClose()}>
                      <Close />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item className={classes.imageContainer}>
                {loading ? (
                  <CircularProgress className={classes.spinner} />
                ) : (
                  <>
                    {isImageLoading && grower?.image_url && (
                      <CircularProgress className={classes.spinner} />
                    )}

                    <OptimizedImage
                      src={grower.image_url}
                      width={GROWER_IMAGE_SIZE}
                      height={GROWER_IMAGE_SIZE}
                      className={classes.cardMedia}
                      fixed
                      rotation={grower.imageRotation}
                      alertTitleSize="1.6rem"
                      alertTextSize="1rem"
                      alertHeight="50%"
                      onImageReady={() => {
                        setIsImageLoading(false);
                      }}
                    />
                  </>
                )}
                {!grower.image_url && (
                  <CardMedia className={classes.cardMedia}>
                    <Grid container className={classes.personBox}>
                      <Person className={classes.person} />
                    </Grid>
                  </CardMedia>
                )}
                {hasPermission(appContext.user, [
                  POLICIES.SUPER_PERMISSION,
                  POLICIES.MANAGE_GROWER,
                ]) && (
                  <Fab
                    data-testid="edit-grower"
                    className={classes.editButton}
                    onClick={() => handleEditClick()}
                  >
                    <EditIcon />
                  </Fab>
                )}
              </Grid>
              <Grid item className={classes.box}>
                <Typography
                  variant="h5"
                  color="primary"
                  className={classes.name}
                >
                  {grower.first_name} {grower.last_name}
                </Typography>
                <Typography variant="body2">
                  ID:{' '}
                  <LinkToWebmap
                    value={grower.reference_id || grower.id}
                    type={pathType.planter}
                  />
                </Typography>
              </Grid>
              {process.env.REACT_APP_ENABLE_MESSAGING === 'true' &&
                hasPermission(appContext.user, [POLICIES.SUPER_PERMISSION]) && (
                  <Grid item>
                    <Button
                      className={classes.messageButton}
                      onClick={() => sendMessageFromGrower(grower)}
                      component={Link}
                      to={'/messaging'}
                    >
                      Send Message
                    </Button>
                  </Grid>
                )}
              <Divider />
              <Grid container direction="column" className={classes.box}>
                <Typography variant="subtitle1" className={classes.captures}>
                  Captures
                </Typography>
                {loading ? (
                  <LinearProgress color="primary" />
                ) : (
                  <List className={classes.listCaptures}>
                    <Box className={classes.boxItem}>
                      <ListItem classes={{ gutters: classes.gutters }}>
                        <ListItemAvatar className={classes.liAvatar}>
                          <Avatar className={classes.approvedChip}>
                            <Done />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="h5">
                              {verificationStatus.approved || 0}
                            </Typography>
                          }
                          secondary="Approved"
                        />
                      </ListItem>
                    </Box>
                    <Box className={classes.boxItem}>
                      <ListItem classes={{ gutters: classes.gutters }}>
                        <ListItemAvatar className={classes.liAvatar}>
                          <Avatar className={classes.awaitingChip}>
                            <HourglassEmptyOutlined />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="h5">
                              {verificationStatus.unprocessed || 0}
                            </Typography>
                          }
                          secondary="Awaiting"
                        />
                      </ListItem>
                    </Box>
                    <Box className={classes.boxItem}>
                      <ListItem classes={{ gutters: classes.gutters }}>
                        <ListItemAvatar className={classes.liAvatar}>
                          <Avatar className={classes.rejectedChip}>
                            <Clear />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="h5">
                              {verificationStatus.rejected || 0}
                            </Typography>
                          }
                          secondary="Rejected"
                        />
                      </ListItem>
                    </Box>
                  </List>
                )}
              </Grid>
              <Divider />
              <Grid container direction="column" className={classes.box}>
                <Typography variant="subtitle1">About</Typography>
                <Typography variant="body1">{grower.about || '---'}</Typography>
              </Grid>
              <Divider />
              <Divider />
              <Grid container direction="column" className={classes.box}>
                <Typography variant="subtitle1">Wallet</Typography>
                <Typography variant="body1">
                  {grower.wallet || '---'}
                </Typography>
              </Grid>
              <Divider />
              <Grid container direction="column" className={classes.box}>
                <Typography variant="subtitle1">Email address</Typography>
                <Typography variant="body1">{grower.email || '---'}</Typography>
              </Grid>
              <Divider />
              <Grid container direction="column" className={classes.box}>
                <Typography variant="subtitle1">Phone number</Typography>
                <Typography variant="body1">{grower.phone || '---'}</Typography>
              </Grid>
              <Divider />
              <Grid container direction="column" className={classes.box}>
                <Typography variant="subtitle1">Person ID</Typography>
                <Typography variant="body1">
                  {grower.person_id || '---'}
                </Typography>
              </Grid>
              <Divider />
              <Grid container direction="column" className={classes.box}>
                <Typography variant="subtitle1">Organization</Typography>
                {grower.organization || grower.organization_id ? (
                  <GrowerOrganization
                    organizationName={grower.organization}
                    assignedOrganizationId={grower.organization_id}
                  />
                ) : (
                  <Typography variant="body1">---</Typography>
                )}
              </Grid>
              <Divider />
              <Grid container direction="column" className={classes.box}>
                <Typography variant="subtitle1">
                  Region{grower?.regions?.length >= 2 ? 's' : ''}
                </Typography>
                <Typography variant="body1">
                  {grower?.regions?.length ? grower?.regions.join(', ') : '---'}
                </Typography>
              </Grid>
              <Divider />
              <Grid container direction="column" className={classes.box}>
                <Typography variant="subtitle1">Registered</Typography>
                <Typography variant="body1">
                  {(grower?.id &&
                    getDateTimeStringLocale(grower?.first_registration_at)) ||
                    '---'}
                </Typography>
              </Grid>
              <Divider />
              <Grid container direction="column" className={classes.box}>
                <Typography variant="subtitle1">
                  Device Identifier{deviceIdentifiers.length >= 2 ? 's' : ''}
                </Typography>
                {(deviceIdentifiers.length && (
                  <table>
                    <tbody>
                      {deviceIdentifiers.map((device, i) => (
                        <tr key={i}>
                          <td>
                            <Typography variant="body1">
                              {device.id}
                              <CopyButton
                                label={'Device Identifier'}
                                value={device.id}
                                confirmCopy={confirmCopy}
                              />
                            </Typography>
                          </td>
                          <td>
                            <Typography variant="body1">
                              ({device.os})
                            </Typography>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )) || <Typography variant="body1">---</Typography>}
              </Grid>
            </Grid>
          )}
        </Grid>
      </Drawer>
      <CopyNotification
        snackbarLabel={snackbarLabel}
        snackbarOpen={snackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
      />
      <EditGrower
        isOpen={editDialogOpen}
        grower={grower}
        onClose={handleEditClose}
      ></EditGrower>
    </>
  );
};

export default GrowerDetail;
