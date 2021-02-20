import React from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import CardMedia from '@material-ui/core/CardMedia'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Box from '@material-ui/core/Box'
import Drawer from '@material-ui/core/Drawer'
import Close from '@material-ui/icons/Close'
import Person from '@material-ui/icons/Person'
import Divider from '@material-ui/core/Divider'
import EditIcon from '@material-ui/icons/Edit'
import Fab from '@material-ui/core/Fab'
import api from '../api/planters';
import { getDateTimeStringLocale } from '../common/locale'
import { hasPermission, POLICIES } from '../models/auth'
import { AppContext } from './Context'
import EditPlanter from './EditPlanter'

const useStyle = makeStyles(theme => ({
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
  }
}));

const PlanterDetail = (props) => {
  
  const [planterRegistration, setPlanterRegistration] = React.useState(null)
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const [planter, setPlanter] = React.useState({})
  const classes = useStyle()
  const { planterId } = props
  const { user } = React.useContext(AppContext)

  React.useEffect(() => {
    async function loadPlanterDetail() {
      if (planter && planter.id !== planterId) {
        setPlanter({})
      }

      if (planterId) {
        const match = await props.plantersDispatch.getPlanter({id: planterId})
        setPlanter(match)

        if (!planterRegistration || planterRegistration.planterId !== planterId) {
          setPlanterRegistration(null)
          api.getPlanterRegistrations(planterId).then(registrations => {
            if (registrations && registrations.length) {
              setPlanterRegistration(registrations[0])
            }
          })
        }
      }
    }

    loadPlanterDetail()
  // eslint-disable-next-line
  }, [planterId, planterRegistration, props.plantersState.planters, props.plantersDispatch])
    
  function handleEditClick() {
    setEditDialogOpen(true)
  }

  function handleEditClose() {
    setEditDialogOpen(false)
  }

  return(
    <React.Fragment>
      <Drawer anchor='right' open={props.open} onClose={props.onClose}>
        <Grid className={classes.root} >
          <Grid container direction='column'>
            <Grid item>
              <Grid container justify='space-between' alignItems='center' >
                <Grid item>
                  <Box m={4} >
                    <Typography color='primary' variant='h6' >
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
              {planter.imageUrl &&
                <CardMedia className={classes.cardMedia} image={planter.imageUrl} />
              }
              {!planter.imageUrl &&
                <CardMedia className={classes.cardMedia} >
                  <Grid container className={classes.personBox} >
                    <Person className={classes.person} />
                  </Grid>
                </CardMedia>
              }
              {hasPermission(user, [POLICIES.SUPER_PERMISSION, POLICIES.MANAGE_PLANTER]) &&
                <Fab
                  className={classes.editButton}
                  onClick={() => handleEditClick()}
                >
                  <EditIcon />
                </Fab>
              }
            </Grid>
            <Grid item className={classes.box} >
              <Typography variant='h5' color='primary' className={classes.name} >{planter.firstName} {planter.lastName}</Typography>
              <Typography variant='body2'>ID:{planter.id}</Typography>
            </Grid>
            <Divider/>
            <Grid container direction='column' className={classes.box}>
              <Typography variant='subtitle1' >Email address</Typography>
              <Typography variant='body1' >{planter.email || '---'}</Typography>
            </Grid>
            <Divider/>
            <Grid container direction='column' className={classes.box}>
              <Typography variant='subtitle1' >Phone number</Typography>
              <Typography variant='body1' >{planter.phone || '---'}</Typography>
            </Grid>
            <Divider/>
            <Grid container direction='column' className={classes.box}>
              <Typography variant='subtitle1' >Person ID</Typography>
              <Typography variant='body1' >{planter.personId || '---'}</Typography>
            </Grid>
            <Divider/>
            <Grid container direction='column' className={classes.box}>
              <Typography variant='subtitle1' >Organization</Typography>
              <Typography variant='body1' >{planter.organization || '---' }</Typography>
            </Grid>
            <Divider />
            <Grid container direction='column' className={classes.box}>
              <Typography variant='subtitle1' >Organization ID</Typography>
              <Typography variant='body1' >{planter.organizationId || '---'}</Typography>
            </Grid>
            <Divider />
            <Grid container direction='column' className={classes.box}>
              <Typography variant='subtitle1' >Registered</Typography>
              <Typography variant='body1' >
                {(planterRegistration && getDateTimeStringLocale(planterRegistration.createdAt)) || '---'}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Drawer>
      <EditPlanter isOpen={editDialogOpen} planter={planter} onClose={handleEditClose}></EditPlanter>
    </React.Fragment>
  )
}
export { PlanterDetail }

export default connect(
  (state) => ({
    plantersState: state.planters,
  }),
  (dispatch) => ({
    plantersDispatch: dispatch.planters,
  }),
)(PlanterDetail)
