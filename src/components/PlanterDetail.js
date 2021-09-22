import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import Close from '@material-ui/icons/Close';
import Person from '@material-ui/icons/Person';
import Divider from '@material-ui/core/Divider';
import EditIcon from '@material-ui/icons/Edit';
import Fab from '@material-ui/core/Fab';
import api from '../api/planters';
import { getDateTimeStringLocale } from '../common/locale';
import { hasPermission, POLICIES } from '../models/auth';
import { AppContext } from '../context/AppContext';
import { PlanterContext } from '../context/PlanterContext';
import EditPlanter from './EditPlanter';
import OptimizedImage from './OptimizedImage';
import LinkToWebmap from './common/LinkToWebmap';

const PLANTER_IMAGE_SIZE = 441;

const useStyle = makeStyles((theme) => ({
  box: {
    padding: theme.spacing(4),
  },
  cardMedia: {
    height: `${PLANTER_IMAGE_SIZE}px`,
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
    height: `${PLANTER_IMAGE_SIZE}px`,
  },
}));

const PlanterDetail = (props) => {
  // console.log('render: planter detail');
  const classes = useStyle();
  const { planterId } = props;
  const appContext = useContext(AppContext);
  const planterContext = useContext(PlanterContext);
  const [planterRegistrations, setPlanterRegistrations] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [planter, setPlanter] = useState({});
  const [deviceIdentifiers, setDeviceIdentifiers] = useState([]);

  useEffect(() => {
    async function loadPlanterDetail() {
      if (planter && planter.id !== planterId) {
        setPlanter({});
      }
      if (planterId) {
        const match = await getPlanter({
          id: planterId,
        });
        setPlanter(match);

        if (
          !planterRegistrations ||
          (planterRegistrations.length > 0 &&
            planterRegistrations[0].planter_id !== planterId)
        ) {
          setPlanterRegistrations(null);
          api.getPlanterRegistrations(planterId).then((registrations) => {
            if (registrations && registrations.length) {
              const sortedRegistrations = registrations.sort((a, b) =>
                a.created_at > b.created_at ? 1 : -1,
              );
              setPlanterRegistrations(sortedRegistrations);
              setDeviceIdentifiers(
                sortedRegistrations
                  .map((reg) => reg.device_identifier)
                  .filter((id) => id),
              );
            }
          });
        }
      }
    }
    loadPlanterDetail();
    // eslint-disable-next-line
  }, [planterId, planterContext.planters]);

  async function getPlanter(payload) {
    const { id } = payload;
    let planter = planterContext.planters?.find((p) => p.id === id); // Look for a match in the context first
    if (!planter) {
      planter = await api.getPlanter(id); // Otherwise query the API
    }
    return planter;
  }

  function handleEditClick() {
    setEditDialogOpen(true);
  }

  function handleEditClose() {
    setEditDialogOpen(false);
  }

  return (
    <>
      <Drawer anchor="right" open={props.open} onClose={props.onClose}>
        <Grid
          style={{
            width: PLANTER_IMAGE_SIZE,
          }}
        >
          <Grid container direction="column">
            <Grid item>
              <Grid container justify="space-between" alignItems="center">
                <Grid item>
                  <Box m={4}>
                    <Typography color="primary" variant="h6">
                      Planter Detail
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
              {planter.imageUrl && (
                <OptimizedImage
                  src={planter.imageUrl}
                  width={PLANTER_IMAGE_SIZE}
                  height={PLANTER_IMAGE_SIZE}
                  className={classes.cardMedia}
                  fixed
                  rotation={planter.imageRotation}
                />
              )}
              {!planter.imageUrl && (
                <CardMedia className={classes.cardMedia}>
                  <Grid container className={classes.personBox}>
                    <Person className={classes.person} />
                  </Grid>
                </CardMedia>
              )}
              {hasPermission(appContext.user, [
                POLICIES.SUPER_PERMISSION,
                POLICIES.MANAGE_PLANTER,
              ]) && (
                <Fab
                  data-testid="edit-planter"
                  className={classes.editButton}
                  onClick={() => handleEditClick()}
                >
                  <EditIcon />
                </Fab>
              )}
            </Grid>
            <Grid item className={classes.box}>
              <Typography variant="h5" color="primary" className={classes.name}>
                {planter.firstName} {planter.lastName}
              </Typography>
              <Typography variant="body2">
                ID: <LinkToWebmap value={planter.id} type="user" />
              </Typography>
            </Grid>
            <Divider />
            <Grid container direction="column" className={classes.box}>
              <Typography variant="subtitle1">Email address</Typography>
              <Typography variant="body1">{planter.email || '---'}</Typography>
            </Grid>
            <Divider />
            <Grid container direction="column" className={classes.box}>
              <Typography variant="subtitle1">Phone number</Typography>
              <Typography variant="body1">{planter.phone || '---'}</Typography>
            </Grid>
            <Divider />
            <Grid container direction="column" className={classes.box}>
              <Typography variant="subtitle1">Person ID</Typography>
              <Typography variant="body1">
                {planter.personId || '---'}
              </Typography>
            </Grid>
            <Divider />
            <Grid container direction="column" className={classes.box}>
              <Typography variant="subtitle1">Organization</Typography>
              <Typography variant="body1">
                {planter.organization || '---'}
              </Typography>
            </Grid>
            <Divider />
            <Grid container direction="column" className={classes.box}>
              <Typography variant="subtitle1">Organization ID</Typography>
              <Typography variant="body1">
                {planter.organizationId || '---'}
              </Typography>
            </Grid>
            <Divider />
            <Grid container direction="column" className={classes.box}>
              <Typography variant="subtitle1">Country</Typography>
              <Typography variant="body1">
                {(planterRegistrations &&
                  planterRegistrations
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
                {(planterRegistrations &&
                  planterRegistrations.length > 0 &&
                  getDateTimeStringLocale(
                    planterRegistrations[0].created_at,
                  )) ||
                  '---'}
              </Typography>
            </Grid>
            <Divider />
            <Grid container direction="column" className={classes.box}>
              <Typography variant="subtitle1">
                Device Identifier{deviceIdentifiers.length >= 2 ? 's' : ''}
              </Typography>
              {(deviceIdentifiers.length &&
                deviceIdentifiers.map((identifier, index) => (
                  <Typography variant="body1" key={index}>
                    {identifier}
                  </Typography>
                ))) || <Typography variant="body1">---</Typography>}
            </Grid>
          </Grid>
        </Grid>
      </Drawer>
      <EditPlanter
        isOpen={editDialogOpen}
        planter={planter}
        onClose={handleEditClose}
      ></EditPlanter>
    </>
  );
};

export default PlanterDetail;
