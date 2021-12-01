import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Drawer from '@material-ui/core/Drawer';
import Close from '@material-ui/icons/Close';
import Person from '@material-ui/icons/Person';
import Divider from '@material-ui/core/Divider';
import EditIcon from '@material-ui/icons/Edit';
import { Done, Clear, HourglassEmptyOutlined } from '@material-ui/icons';
import Fab from '@material-ui/core/Fab';
import api from '../api/growers';
import { getDateTimeStringLocale } from '../common/locale';
import { hasPermission, POLICIES } from '../models/auth';
import { AppContext } from '../context/AppContext';
import { GrowerContext } from '../context/GrowerContext';
import EditGrower from './EditGrower';
import OptimizedImage from './OptimizedImage';
import LinkToWebmap from './common/LinkToWebmap';
import { CopyButton } from './common/CopyButton';
import CopyNotification from './common/CopyNotification';
import { getVerificationStatus } from '../common/utils';
import { verificationStates } from '../common/variables';

const GROWER_IMAGE_SIZE = 441;

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
}));

const GrowerDetail = (props) => {
  // console.log('render: grower detail');
  const classes = useStyle();
  const emptyStatusCount = { approved: 0, awaiting: 0, rejected: 0 };
  const { growerId } = props;
  const appContext = useContext(AppContext);
  const growerContext = useContext(GrowerContext);
  const [growerRegistrations, setGrowerRegistrations] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [grower, setGrower] = useState({});
  const [deviceIdentifiers, setDeviceIdentifiers] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarLabel, setSnackbarLabel] = useState('');
  const [verificationStatus, setVerificationStatus] = useState(
    emptyStatusCount,
  );

  useEffect(() => {
    async function loadGrowerDetail() {
      if (grower && grower.id !== growerId) {
        setGrower({});
      }
      if (growerId) {
        const match = await getGrower({
          id: growerId,
        });
        setGrower(match);

        if (
          !growerRegistrations ||
          (growerRegistrations.length > 0 &&
            growerRegistrations[0].planter_id !== growerId)
        ) {
          setGrowerRegistrations(null);
          api.getGrowerRegistrations(growerId).then((registrations) => {
            console.log('grower registrations: ', registrations);
            if (registrations && registrations.length) {
              const sortedRegistrations = registrations.sort((a, b) =>
                a.created_at > b.created_at ? 1 : -1,
              );
              setGrowerRegistrations(sortedRegistrations);
              setDeviceIdentifiers(
                sortedRegistrations
                  .map((reg) => ({
                    id: reg.device_identifier,
                    os:
                      reg.manufacturer.toLowerCase() === 'apple'
                        ? 'iOS'
                        : 'Android',
                  }))
                  .filter((id) => id),
              );
              let statusCount = emptyStatusCount;
              registrations.map((reg) => {
                const verificationState = getVerificationStatus(
                  reg.active,
                  reg.approved,
                );
                if (verificationState === verificationStates.APPROVED) {
                  statusCount.approved += 1;
                } else if (verificationState === verificationStates.AWAITING) {
                  statusCount.awaiting += 1;
                } else {
                  statusCount.rejected += 1;
                }
              });
              setVerificationStatus(statusCount);
            } else {
              setVerificationStatus(emptyStatusCount);
            }
          });
        }
      }
    }
    loadGrowerDetail();
    // eslint-disable-next-line
  }, [growerId, growerContext.growers]);

  async function getGrower(payload) {
    const { id } = payload;
    let grower = growerContext.growers?.find((p) => p.id === id); // Look for a match in the context first
    if (!grower) {
      grower = await api.getGrower(id); // Otherwise query the API
    }
    return grower;
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
      <Drawer anchor="right" open={props.open} onClose={props.onClose}>
        <Grid
          style={{
            width: GROWER_IMAGE_SIZE,
          }}
        >
          <Grid container direction="column">
            <Grid item>
              <Grid container justify="space-between" alignItems="center">
                <Grid item>
                  <Box m={4}>
                    <Typography color="primary" variant="h6">
                      Grower Detail
                    </Typography>
                  </Box>
                </Grid>
                <Grid item>
                  <IconButton onClick={() => props.onClose()}>
                    <Close />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
            <Grid item className={classes.imageContainer}>
              {grower.imageUrl && (
                <OptimizedImage
                  src={grower.imageUrl}
                  width={GROWER_IMAGE_SIZE}
                  height={GROWER_IMAGE_SIZE}
                  className={classes.cardMedia}
                  fixed
                  rotation={grower.imageRotation}
                />
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
              <Typography variant="h5" color="primary" className={classes.name}>
                {grower.firstName} {grower.lastName}
              </Typography>
              <Typography variant="body2">
                ID: <LinkToWebmap value={grower.id} type="user" />
              </Typography>
            </Grid>
            <Divider />
            <Grid container direction="column" className={classes.box}>
              <Typography variant="subtitle1">Captures</Typography>
              <List className={classes.listCaptures}>
                <Box
                  borderColor="grey.300"
                  borderRadius={10}
                  border={0.5}
                  m={0.5}
                >
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar className={classes.approvedChip}>
                        <Done />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="h5">
                          {verificationStatus.approved}
                        </Typography>
                      }
                      secondary="Approved"
                    />
                  </ListItem>
                </Box>
                <Box
                  borderColor="grey.300"
                  borderRadius={10}
                  border={0.5}
                  m={0.5}
                >
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar className={classes.awaitingChip}>
                        <HourglassEmptyOutlined />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="h5">
                          {verificationStatus.awaiting}
                        </Typography>
                      }
                      secondary="Awaiting"
                    />
                  </ListItem>
                </Box>
                <Box
                  borderColor="grey.300"
                  borderRadius={10}
                  border={0.5}
                  m={0.5}
                >
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar className={classes.rejectedChip}>
                        <Clear />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="h5">
                          {verificationStatus.rejected}
                        </Typography>
                      }
                      secondary="Rejected"
                    />
                  </ListItem>
                </Box>
              </List>
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
              <Typography variant="body1">
                {grower.organization || '---'}
              </Typography>
            </Grid>
            <Divider />
            <Grid container direction="column" className={classes.box}>
              <Typography variant="subtitle1">Organization ID</Typography>
              <Typography variant="body1">
                {grower.organizationId || '---'}
              </Typography>
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
                        country && arr.indexOf(country) === i,
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
                  getDateTimeStringLocale(growerRegistrations[0].created_at)) ||
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
                          <Typography variant="body1">({device.os})</Typography>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )) || <Typography variant="body1">---</Typography>}
            </Grid>
          </Grid>
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
