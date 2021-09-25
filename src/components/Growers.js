/*
 * Grower page
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
import FilterTopGrower from './FilterTopGrower';
import OptimizedImage from './OptimizedImage';
import GrowerDetail from './GrowerDetail';
import { GrowerContext } from '../context/PlanterContext';

// const log = require('loglevel').getLogger('../components/Growers');

const GROWER_IMAGE_SIZE = 182;

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
    height: `${GROWER_IMAGE_SIZE}px`,
    position: 'relative',
  },
  selected: {
    border: `2px ${selectedHighlightColor} solid`,
  },
  cardMedia: {
    height: `${GROWER_IMAGE_SIZE}px`,
  },
  cardWrapper: {
    width: 200,
  },
  growerCard: {
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

const Growers = (props) => {
  // log.debug('render: Growers...');
  const classes = useStyles(props);
  const growerContext = useContext(GrowerContext);
  const [isFilterShown, setFilterShown] = useState(false);
  const [isDetailShown, setDetailShown] = useState(false);
  const [growerDetail, setGrowerDetail] = useState({});

  /*
   * effect to load page when mounted and initialize the title and grower count
   */
  useEffect(() => {
    // log.debug('growers mounted', filter);
    document.title = `Growers - ${documentTitle}`;
  }, []);

  useEffect(() => {
    growerContext.load();
  }, [growerContext.pageSize, growerContext.currentPage, growerContext.filter]);

  useEffect(() => {
    growerContext.getCount();
  }, [growerContext.pageSize, growerContext.currentPage, growerContext.filter]);

  function handleFilterClick() {
    if (isFilterShown) {
      setFilterShown(false);
    } else {
      setFilterShown(true);
    }
  }

  function handlePageChange(e, page) {
    growerContext.changeCurrentPage(page);
  }

  function handleChangePageSize(e, option) {
    growerContext.changePageSize(option.props.value);
  }

  function handleGrowerClick(grower) {
    setDetailShown(true);
    setGrowerDetail(grower);
  }

  const placeholderGrowers = Array(growerContext.pageSize)
    .fill()
    .map((_, index) => {
      return {
        id: index,
        placeholder: true,
      };
    });

  let growersItems = (growerContext.isLoading
    ? placeholderGrowers
    : growerContext.growers
  ).map((grower) => {
    return (
      <Grower
        onClick={() => handleGrowerClick(grower)}
        key={grower.id}
        grower={grower}
        placeholder={grower.placeholder}
      />
    );
  });

  const pagination = (
    <TablePagination
      rowsPerPageOptions={[24, 48, 96]}
      component="div"
      count={growerContext.count || 0}
      rowsPerPage={growerContext.pageSize}
      page={growerContext.currentPage}
      onChangePage={handlePageChange}
      onChangeRowsPerPage={handleChangePageSize}
      labelRowsPerPage="Growers per page:"
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
              <FilterTopGrower
                isOpen={isFilterShown}
                onSubmit={(filter) => growerContext.updateFilter(filter)}
                filter={growerContext.filter}
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
                  <Typography variant="h5">Growers</Typography>
                </Grid>
                <Grid item>{pagination}</Grid>
              </Grid>
            </Grid>
            <Grid item container direction="row" justify="center">
              {growersItems}
            </Grid>
          </Grid>
          <Grid container className={classes.page} justify="flex-end">
            {pagination}
          </Grid>
        </Grid>
      </Grid>
      <GrowerDetail
        open={isDetailShown}
        growerId={growerDetail.id}
        onClose={() => setDetailShown(false)}
      />
    </>
  );
};

export function Grower(props) {
  const { grower } = props;
  const classes = useStyles(props);
  return (
    <div
      onClick={() => props.onClick()}
      className={clsx(classes.cardWrapper)}
      key={grower.id}
    >
      <Card
        id={`card_${grower.id}`}
        className={clsx(
          classes.card,
          props.placeholder && classes.placeholderCard,
        )}
        classes={{
          root: classes.growerCard,
        }}
      >
        <CardContent className={classes.cardContent}>
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
        </CardContent>
        <CardActions className={classes.cardActions}>
          <Grid justify="flex-start" container>
            <Grid container direction="column">
              <Typography className={classes.name}>
                {grower.firstName} {grower.lastName}
              </Typography>
              <Typography>
                ID: <LinkToWebmap value={grower.id} type="user" />
              </Typography>
              {grower.organization && (
                <Typography>Organization: {grower.organization}</Typography>
              )}
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </div>
  );
}
export default Growers;
