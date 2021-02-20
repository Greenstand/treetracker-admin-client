/*
 * Planter page
 */
import React, {useEffect} from 'react'
import clsx from 'clsx'
import {connect} from 'react-redux'
import {makeStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import TablePagination from '@material-ui/core/TablePagination'

import {selectedHighlightColor} from '../common/variables.js'
import Grid from '@material-ui/core/Grid'
import IconFilter from '@material-ui/icons/FilterList'
import IconButton from '@material-ui/core/IconButton'

import FilterTopPlanter from './FilterTopPlanter'
import Person from "@material-ui/icons/Person";
import Navbar from "./Navbar";
import PlanterDetail from "./PlanterDetail"

const log = require('loglevel').getLogger('../components/Planters')

const useStyles = makeStyles((theme) => ({
  outer: {
    height: '100vh',
    flex: 1,
    flexWrap: 'nowrap',
  },
  cardImg: {
    width: '100%',
    height: 'auto',
  },
  cardTitle: {
    color: '#f00',
  },
  card: {
    cursor: 'pointer',
    margin: '0.5rem',
  },
  cardSelected: {
    backgroundColor: theme.palette.action.selected,
  },
  cardContent: {
    padding: 0,
  },
  selected: {
    border: `2px ${selectedHighlightColor} solid`,
  },
  cardMedia: {
    height: '12rem',
  },
  cardWrapper: {
    width: 200,
  },
  planterCard: {
    borderRadius: 16,
    border: "1px solid rgba(0, 0, 0, 0.12)",
    boxShadow: "none",
  },
  placeholderCard: {
    pointerEvents: 'none',
    background: '#eee',
    '& *': {
      opacity: 0,
    },
    border: 'none',
  },
  title: {
    padding: theme.spacing(2, 16),
  },
  snackbar: {
    bottom: 20,
  },
  snackbarContent: {
    backgroundColor: theme.palette.action.active,
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    marginRight: '8px',
  },
  sidePanel: {},
  body: {
    width: '100%',
    overflow: 'hidden auto',
  },
  radioGroup: {
    flexDirection: 'row',
  },
  bottomLine: {
    borderBottom: '1px solid lightgray',
  },
  tooltip: {
    maxWidth: 'none',
  },
  page: {
    padding: theme.spacing(2, 16),
  },
  personBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgray",
    height: "100%",
  },
  person: {
    height: 90,
    width: 90,
    fill: "gray",
  },
  name: {
    textTransform: "capitalize",
  },
}))

const Planters = (props) => {
  log.debug('render Planters...')
  const classes = useStyles(props)
  const [isFilterShown, setFilterShown] = React.useState(false)
  const [isDetailShown, setDetailShown] = React.useState(false)
  const [planterDetail, setPlanterDetail] = React.useState({});

  /*
   * effect to load page when mounted
   */
  useEffect(() => {
    log.debug('mounted')
    props.plantersDispatch.count()
  }, [props.plantersDispatch])

  useEffect(() => {
    props.plantersDispatch.load({
      pageNumber: 0,
    });
  }, [props.plantersDispatch, props.plantersState.pageSize])

  useEffect(() => {
    props.plantersDispatch.count({
      filter: props.plantersState.filter,
    })
  }, [props.plantersDispatch, props.plantersState.filter])

  function handlePlanterClick(planter) {
    setDetailShown(true);
    setPlanterDetail(planter);
  }

  const placeholderPlanters = Array(props.plantersState.pageSize).fill().map((_, index) => {
    return {
      id: index,
      placeholder: true,
    };
  });

  let plantersItems = (props.plantersState.isLoading ?
    placeholderPlanters :
    props.plantersState.planters
  ).map((planter) => {
    return (
      <Planter
        onClick={() => handlePlanterClick(planter)}
        key={planter.id}
        planter={planter}
        placeholder={planter.placeholder} />
    )
  })

  function handleFilterClick() {
    if (isFilterShown) {
      setFilterShown(false)
    } else {
      setFilterShown(true)
    }
  }

  function handlePageChange(e, page) {
    props.plantersDispatch.load({
      pageNumber: page,
      filter: props.plantersState.filter,
    });
  }

  function handleChangePageSize(e, option) {
    props.plantersDispatch.changePageSize({pageSize: option.props.value})
  }

  function updateFilter(filter) {
    props.plantersDispatch.load({
      pageNumber: 0,
      filter,
    });
  }

  const pagination = (
    <TablePagination
      rowsPerPageOptions={[24, 48, 96]}
      component="div"
      count={props.plantersState.count || 0}
      rowsPerPage={props.plantersState.pageSize}
      page={props.plantersState.currentPage}
      onChangePage={handlePageChange}
      onChangeRowsPerPage={handleChangePageSize}
      labelRowsPerPage="Planters per page:"
    />
  );

  return (
    <React.Fragment>
      <Grid container direction="column" className={classes.outer}>
        <Grid item>
          <Navbar
            buttons={[
              <IconButton onClick={handleFilterClick} key={1}>
                <IconFilter />
              </IconButton>
            ]}
          >
            {isFilterShown &&
              <FilterTopPlanter
                isOpen={isFilterShown}
                onSubmit={filter => updateFilter(filter)}
                filter={props.plantersState.filter}
                onClose={handleFilterClick}
              />
            }
          </Navbar>
        </Grid>
        <Grid
          item
          className={classes.body}
        >
          <Grid container>
            <Grid
              item
              style={{
                width: '100%',
              }}
            >
              <Grid container justify='space-between' alignItems='center' className={classes.title}>
                <Grid item>
                  <Typography variant='h5'>
                    Planters
                  </Typography>
                </Grid>
                <Grid item>{pagination}</Grid>
              </Grid>
            </Grid>
            <Grid item container direction='row' justify='center'>
              {plantersItems}
            </Grid>
          </Grid>
          <Grid container className={classes.page} justify='flex-end' >
            {pagination}
          </Grid>
        </Grid>
      </Grid>
      <PlanterDetail open={isDetailShown} planterId={planterDetail.id} onClose={() => setDetailShown(false)} />
    </React.Fragment>
  )
}

function Planter(props) {
  const {
    planter
  } = props;
  const classes = useStyles(props);
  return (
    <div onClick={() => props.onClick()} className={clsx(classes.cardWrapper)} key={planter.id}>
      <Card
        id={`card_${planter.id}`}
        className={clsx(classes.card, props.placeholder && classes.placeholderCard)}
        classes={{
          root: classes.planterCard,
        }}
      >
        <CardContent className={classes.cardContent}>
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
        </CardContent>
        <CardActions className={classes.cardActions}>
          <Grid justify="flex-start" container >
            <Grid container direction="column">
              <Typography className={classes.name} >{planter.firstName} {planter.lastName}</Typography>
              <Typography>ID: {planter.id}</Typography>
              {planter.organization && <Typography>Organization: {planter.organization}</Typography>}
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </div>
  )
}
export {Planter};

export default connect(
  //state
  (state) => ({
    plantersState: state.planters,
  }),
  //dispatch
  (dispatch) => ({
    plantersDispatch: dispatch.planters,
  })
)(Planters)
