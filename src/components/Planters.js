/*
 * Planter page
 */
import React, { useState, useEffect, useContext } from 'react';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Person from '@material-ui/icons/Person';
import IconFilter from '@material-ui/icons/FilterList';

import { selectedHighlightColor, documentTitle } from '../common/variables.js';
import LinkToWebmap from './common/LinkToWebmap';
import Navbar from './Navbar';
import FilterTopPlanter from './FilterTopPlanter';
import OptimizedImage from './OptimizedImage';
import PlanterDetail from './PlanterDetail';
import { PlanterContext } from '../context/PlanterContext';

// const log = require('loglevel').getLogger('../components/Planters');

const PLANTER_IMAGE_SIZE = 182;

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
    height: `${PLANTER_IMAGE_SIZE}px`,
    position: 'relative',
  },
  selected: {
    border: `2px ${selectedHighlightColor} solid`,
  },
  cardMedia: {
    height: `${PLANTER_IMAGE_SIZE}px`,
  },
  cardWrapper: {
    width: 200,
  },
  planterCard: {
    borderRadius: 16,
    border: '1px solid rgba(0, 0, 0, 0.12)',
    boxShadow: 'none',
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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgray',
    height: '100%',
  },
  person: {
    height: 90,
    width: 90,
    fill: 'gray',
  },
  name: {
    textTransform: 'capitalize',
  },
}));

const Planters = (props) => {
  // log.debug('render: Planters...');
  const classes = useStyles(props);
  const planterContext = useContext(PlanterContext);
  const [isFilterShown, setFilterShown] = useState(false);
  const [isDetailShown, setDetailShown] = useState(false);
  const [planterDetail, setPlanterDetail] = useState({});

  /*
   * effect to load page when mounted and initialize the title and planter count
   */
  useEffect(() => {
    // log.debug('planters mounted', filter);
    document.title = `Planters - ${documentTitle}`;
  }, []);

  useEffect(() => {
    planterContext.load();
  }, [
    planterContext.pageSize,
    planterContext.currentPage,
    planterContext.filter,
  ]);

  useEffect(() => {
    planterContext.getCount();
  }, [
    planterContext.pageSize,
    planterContext.currentPage,
    planterContext.filter,
  ]);

  function handleFilterClick() {
    if (isFilterShown) {
      setFilterShown(false);
    } else {
      setFilterShown(true);
    }
  }

  function handlePageChange(e, page) {
    planterContext.changeCurrentPage(page);
  }

  function handleChangePageSize(e, option) {
    planterContext.changePageSize(option.props.value);
  }

  function handlePlanterClick(planter) {
    setDetailShown(true);
    setPlanterDetail(planter);
  }

  const placeholderPlanters = Array(planterContext.pageSize)
    .fill()
    .map((_, index) => {
      return {
        id: index,
        placeholder: true,
      };
    });

  let plantersItems = (planterContext.isLoading
    ? placeholderPlanters
    : planterContext.planters
  ).map((planter) => {
    return (
      <Planter
        onClick={() => handlePlanterClick(planter)}
        key={planter.id}
        planter={planter}
        placeholder={planter.placeholder}
      />
    );
  });

  const pagination = (
    <TablePagination
      rowsPerPageOptions={[24, 48, 96]}
      component="div"
      count={planterContext.count || 0}
      rowsPerPage={planterContext.pageSize}
      page={planterContext.currentPage}
      onChangePage={handlePageChange}
      onChangeRowsPerPage={handleChangePageSize}
      labelRowsPerPage="Planters per page:"
    />
  );

  return (
    <>
      <Grid container direction="column" className={classes.outer}>
        <Grid item>
          <Navbar
            buttons={[
              <Button
                variant="text"
                color="primary"
                onClick={handleFilterClick}
                startIcon={<IconFilter />}
                key={1}
              >
                Filter
              </Button>,
            ]}
          >
            {isFilterShown && (
              <FilterTopPlanter
                isOpen={isFilterShown}
                onSubmit={(filter) => planterContext.updateFilter(filter)}
                filter={planterContext.filter}
                onClose={handleFilterClick}
              />
            )}
          </Navbar>
        </Grid>
        <Grid item className={classes.body}>
          <Grid container>
            <Grid
              item
              style={{
                width: '100%',
              }}
            >
              <Grid
                container
                justify="space-between"
                alignItems="center"
                className={classes.title}
              >
                <Grid item>
                  <Typography variant="h5">Planters</Typography>
                </Grid>
                <Grid item>{pagination}</Grid>
              </Grid>
            </Grid>
            <Grid item container direction="row" justify="center">
              {plantersItems}
            </Grid>
          </Grid>
          <Grid container className={classes.page} justify="flex-end">
            {pagination}
          </Grid>
        </Grid>
      </Grid>
      <PlanterDetail
        open={isDetailShown}
        planterId={planterDetail.id}
        onClose={() => setDetailShown(false)}
      />
    </>
  );
};

export function Planter(props) {
  const { planter } = props;
  const classes = useStyles(props);
  return (
    <div
      onClick={() => props.onClick()}
      className={clsx(classes.cardWrapper)}
      key={planter.id}
    >
      <Card
        id={`card_${planter.id}`}
        className={clsx(
          classes.card,
          props.placeholder && classes.placeholderCard,
        )}
        classes={{
          root: classes.planterCard,
        }}
      >
        <CardContent className={classes.cardContent}>
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
        </CardContent>
        <CardActions className={classes.cardActions}>
          <Grid justify="flex-start" container>
            <Grid container direction="column">
              <Typography className={classes.name}>
                {planter.firstName} {planter.lastName}
              </Typography>
              <Typography>
                ID: <LinkToWebmap value={planter.id} type="user" />
              </Typography>
              {planter.organization && (
                <Typography>Organization: {planter.organization}</Typography>
              )}
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </div>
  );
}
export default Planters;
