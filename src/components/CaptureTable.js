import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import {
  Grid,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Drawer,
  TablePagination,
  TableSortLabel,
  Typography,
} from '@material-ui/core';

import { getDateTimeStringLocale } from '../common/locale';
import Filter, { FILTER_WIDTH } from './Filter';
import CaptureDetails from './CaptureDetails.js';
import LinkToWebmap from './common/LinkToWebmap';

// change 88 to unit spacing,
const styles = (theme) => ({
  root: {
    position: 'relative',
    paddingLeft: theme.spacing(16),
    overflowX: 'auto',
  },
  tableContainer: {
    width: `calc(100vw  - ${FILTER_WIDTH + theme.spacing(4)}px)`,
    overflowY: 'auto',
    height: '100%',
  },
  tableRow: {
    cursor: 'pointer',
  },
  locationCol: {
    width: '270px',
  },
  table: {
    minHeight: '100vh',
    '&:nth-child(2)': {
      width: 20,
    },
  },
  tableBody: {
    minHeight: '100vh',
  },
  pagination: {
    position: 'sticky',
    bottom: '0px',
    width: '100%',
    backgroundColor: '#fff',
    boxShadow: '0 -2px 5px rgba(0,0,0,0.15)',
  },
  title: {
    paddingLeft: theme.spacing(4),
  },
});

const columns = [
  {
    attr: 'id',
    label: 'Capture ID',
  },
  {
    attr: 'planterId',
    label: 'Planter ID',
  },
  {
    attr: 'payment',
    label: 'Payment',
    noSort: true,
    renderer: () => 'pending',
  },
  {
    attr: 'country',
    label: 'Country',
    noSort: true,
    renderer: () => 'pending',
  },
  {
    attr: 'speciesId',
    label: 'Species',
    noSort: true,
    renderer: () => 'pending',
  },
  {
    attr: 'status',
    label: 'Status',
  },
  {
    attr: 'timeCreated',
    label: 'Created',
    renderer: (val) => getDateTimeStringLocale(val),
  },
];

class CaptureTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDetailsPaneOpen: false,
    };
    this.closeDrawer = this.closeDrawer.bind(this);
    this.handleFilterSubmit = this.handleFilterSubmit.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleRowsPerPageChange = this.handleRowsPerPageChange.bind(this);
    this.createSortHandler = this.createSortHandler.bind(this);
    this.scrollRef = React.createRef();
  }

  loadCaptures(payload) {
    this.props.getCapturesAsync(payload).then(() => {
      this.scrollRef.current && this.scrollRef.current.scrollTo(0, 0);
    });
  }

  componentDidMount() {
    this.loadCaptures();
  }

  toggleDrawer(id) {
    this.props.getCaptureAsync(id);
    const { isDetailsPaneOpen } = this.state;
    this.setState({
      isDetailsPaneOpen: !isDetailsPaneOpen,
    });
  }

  createToggleDrawerHandler(id) {
    return () => {
      this.toggleDrawer(id);
    };
  }

  closeDrawer() {
    this.setState({
      isDetailsPaneOpen: false,
    });
  }

  handleFilterSubmit(filter) {
    this.loadCaptures({
      page: 0,
      filter,
    });
  }

  handlePageChange(_event, page) {
    this.loadCaptures({
      page,
    });
  }

  handleRowsPerPageChange(event) {
    this.loadCaptures({
      page: 0,
      rowsPerPage: parseInt(event.target.value),
    });
  }

  createSortHandler(attr) {
    return () => {
      const order =
        this.props.orderBy === attr && this.props.order === 'asc'
          ? 'desc'
          : 'asc';
      const orderBy = attr;
      this.loadCaptures({ order, orderBy });
    };
  }

  tablePagination() {
    return (
      <TablePagination
        rowsPerPageOptions={[25, 50, 100, 250, 500]}
        component="div"
        count={this.props.captureCount || 0}
        page={this.props.page}
        rowsPerPage={this.props.rowsPerPage}
        onChangePage={this.handlePageChange}
        onChangeRowsPerPage={this.handleRowsPerPageChange}
      />
    );
  }
  render() {
    const { capturesArray, capture, classes, orderBy, order } = this.props;

    return (
      <div className={classes.tableContainer} ref={this.scrollRef}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Typography variant="h5" className={classes.title}>
            Captures
          </Typography>
          {this.tablePagination()}
        </Grid>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map(({ attr, label, noSort }) => (
                <TableCell
                  key={attr}
                  sortDirection={orderBy === attr ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === attr}
                    direction={orderBy === attr ? order : 'asc'}
                    onClick={this.createSortHandler(attr)}
                    disabled={noSort}
                  >
                    {label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {capturesArray.map((capture) => (
              <TableRow
                key={capture.id}
                onClick={this.createToggleDrawerHandler(capture.id)}
                className={classes.tableRow}
              >
                {columns.map(({ attr, renderer }) => (
                  <TableCell key={attr}>
                    {formatCell(capture, attr, renderer)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {this.tablePagination()}
        <Drawer
          anchor="right"
          open={this.state.isDetailsPaneOpen}
          onClose={this.closeDrawer}
        >
          <CaptureDetails capture={capture} />
        </Drawer>
        <Filter
          isOpen={true}
          onSubmit={this.handleFilterSubmit}
          filter={this.props.filter}
        />
      </div>
    );
  }
}

const formatCell = (capture, attr, renderer) => {
  if (attr === 'id' || attr === 'planterId') {
    return (
      <LinkToWebmap
        value={capture[attr]}
        type={attr === 'id' ? 'tree' : 'user'}
      />
    );
  } else {
    return renderer ? renderer(capture[attr]) : capture[attr];
  }
};

const mapState = (state) => {
  const keys = Object.keys(state.captures.data);
  return {
    capturesArray: keys.map((id) => ({
      ...state.captures.data[id],
    })),
    ...state.captures,
  };
};

const mapDispatch = (dispatch) => ({
  getCapturesAsync: (payload) => dispatch.captures.getCapturesAsync(payload),
  getLocationName: (id, lat, lon) =>
    dispatch.captures.getLocationName({
      id: id,
      latitude: lat,
      longitude: lon,
    }),
  getCaptureAsync: (id) => dispatch.captures.getCaptureAsync(id),
});

export default compose(
  withStyles(styles),
  connect(mapState, mapDispatch),
)(CaptureTable);
