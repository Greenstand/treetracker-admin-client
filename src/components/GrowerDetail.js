import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import LinkD from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  CardMedia,
  Grid,
  IconButton,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Drawer,
  Divider,
  LinearProgress,
  CircularProgress,
  Fab,
} from '@material-ui/core';
import {
  Close,
  Person,
  Edit as EditIcon,
  Done,
  Clear,
  HourglassEmptyOutlined,
} from '@material-ui/icons';
import api from '../api/growers';
import { getDateTimeStringLocale } from '../common/locale';
import { hasPermission, POLICIES } from '../models/auth';
import { AppContext } from '../context/AppContext';
import { GrowerContext } from '../context/GrowerContext';
import { MessagingContext } from 'context/MessagingContext';
import EditGrower from './EditGrower';
import GrowerOrganization from './GrowerOrganization';
import OptimizedImage from './OptimizedImage';
import LinkToWebmap from './common/LinkToWebmap';
import { CopyButton } from './common/CopyButton';
import CopyNotification from './common/CopyNotification';
import FilterModel from '../models/Filter';
import FilterGrower from '../models/FilterGrower';
import treeTrackerApi from 'api/treeTrackerApi';
import * as loglevel from 'loglevel';

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
  log.debug('render: grower detail', growerId);
  const classes = useStyle();
  const appContext = useContext(AppContext);
  const { growers } = useContext(GrowerContext);
  const { sendMessageFromGrower } = useContext(MessagingContext);
  const [growerRegistrations, setGrowerRegistrations] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [grower, setGrower] = useState({});
  const [deviceIdentifiers, setDeviceIdentifiers] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarLabel, setSnackbarLabel] = useState('');
  const [verificationStatus, setVerificationStatus] = useState({});
  const [loading, setLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    setErrorMessage(null);
    async function loadGrowerDetail() {
      log.debug('grower', grower);
      if (grower && grower.grower_account_id !== growerId) {
        setGrower({});
        setDeviceIdentifiers([]);
      }
      if (growerId) {
        setIsImageLoading(true);
        let match;
        if (isNaN(Number(growerId))) {
          match = await getGrower({
            id: undefined,
            growerAccountUuid: growerId,
          });
        } else {
          match = await getGrower({
            id: growerId,
            growerAccountUuid: undefined,
          });
        }

        log.debug('match', match);

        if (match.error) {
          setErrorMessage(match.message);
        }

        setGrower(match);

        if (
          match.id &&
          (!growerRegistrations ||
            (growerRegistrations.length > 0 &&
              growerRegistrations[0].planter_id !== match.id))
        ) {
          setGrowerRegistrations(null);
          api.getGrowerRegistrations(match.id).then((registrations) => {
            if (registrations && registrations.length) {
              const sortedReg = registrations.sort((a, b) =>
                a.created_at > b.created_at ? 1 : -1
              );
              const uniqueDevices = {};
              const devices = sortedReg.reduce((result, reg) => {
                if (!reg.device_identifier) {
                  return result;
                }
                if (!uniqueDevices[reg.device_identifier]) {
                  uniqueDevices[reg.device_identifier] = true;
                  // if manufacturer isn't 'apple' it's an android phone
                  result.push({
                    id: reg.device_identifier,
                    os:
                      reg.manufacturer?.toLowerCase() === 'apple'
                        ? 'iOS'
                        : 'Android',
                  });
                }
                return result;
              }, []);

              setDeviceIdentifiers(devices);
              setGrowerRegistrations(sortedReg);
            }
          });
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
          getCaptureCountGrower(true, true, grower.id),
          getCaptureCountGrower(true, false, grower.id),
          getCaptureCountGrower(false, false, grower.id),
        ]);
        setVerificationStatus({
          approved: approvedCount,
          awaiting: awaitingCount,
          rejected: rejectedCount,
        });
        setLoading(false);
      }
    }
    loadCaptures();
  }, [grower]);

  async function getCaptureCountGrower(active, approved, growerId) {
    let filter = new FilterModel();
    filter.planterId = growerId?.toString();
    filter.active = active;
    filter.approved = approved;
    const countResponse = await treeTrackerApi.getCaptureCount(filter);
    return countResponse && countResponse.count ? countResponse.count : 0;
  }

  async function getGrower(payload) {
    const { id, growerAccountUuid } = payload;
    let grower = growers?.find(
      (p) =>
        (growerAccountUuid && p.growerAccountUuid === growerAccountUuid) ||
        p.id === id
    ); // Look for a match in the context first

    if (!grower && !id) {
      const filter = new FilterGrower();
      filter.growerAccountUuid = growerAccountUuid;
      const result = await api.getGrowers({ filter }); // Otherwise query the API
      log.debug('getGrowers result', result.length);
      // only assign to grower if it finds one match, seems to return all otherwise
      if (result.length === 1) {
        grower = result[0];
      }
    }

    if (!grower && !growerAccountUuid) {
      grower = await api.getGrower(id);
    }
    // throw error if no match at all
    return grower || { error: true, message: 'Sorry! No grower info found' };
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
                    {isImageLoading && grower?.imageUrl && (
                      <CircularProgress className={classes.spinner} />
                    )}

                    <OptimizedImage
                      src={grower.imageUrl}
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
                {!grower.imageUrl && (
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
                  {grower.firstName} {grower.lastName}
                </Typography>
                <Typography variant="body2">
                  ID: <LinkToWebmap value={grower.id} type="user" />
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
                <Typography variant="subtitle1">
                  <LinkD
                    href={`/verify?wallet=${grower.email}`}
                    underline="always"
                  >
                    Captures
                  </LinkD>
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
                              {verificationStatus.awaiting || 0}
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
                  {grower.personId || '---'}
                </Typography>
              </Grid>
              <Divider />
              <Grid container direction="column" className={classes.box}>
                <Typography variant="subtitle1">Organization</Typography>
                {grower.organization || grower.organizationId ? (
                  <GrowerOrganization
                    organizationName={grower.organization}
                    assignedOrganizationId={grower.organizationId}
                  />
                ) : (
                  <Typography variant="body1">---</Typography>
                )}
              </Grid>
              <Divider />
              <Grid container direction="column" className={classes.box}>
                <Typography variant="subtitle1">Country</Typography>
                <Typography variant="body1">
                  {(growerRegistrations &&
                    growerRegistrations
                      .map((item) => item.country)
                      .filter(
                        (country, i, arr) =>
                          country && arr.indexOf(country) === i
                      )
                      .join(', ')) ||
                    '---'}
                </Typography>
              </Grid>
              <Divider />
              <Grid container direction="column" className={classes.box}>
                <Typography variant="subtitle1">Registered</Typography>
                <Typography variant="body1">
                  {(growerRegistrations &&
                    growerRegistrations.length > 0 &&
                    getDateTimeStringLocale(
                      growerRegistrations[0].created_at
                    )) ||
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
              <Divider />
              <Grid container direction="column" className={classes.box}>
                <Typography variant="subtitle1">Grower Earnings</Typography>
                <Typography variant="body1">
                  <LinkD
                    href={`/earnings?name=${grower.firstName}%20${grower.lastName}`}
                    underline="always"
                  >
                    Earnings
                  </LinkD>
                </Typography>
              </Grid>
              <Divider />
              <Grid container direction="column" className={classes.box}>
                <Typography variant="subtitle1">Grower Payments</Typography>
                <Typography variant="body1">
                  <LinkD
                    href={`/payments?name=${grower.firstName}%20${grower.lastName}`}
                    underline="always"
                  >
                    Payments
                  </LinkD>
                </Typography>
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
