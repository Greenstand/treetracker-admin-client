import React, { Component } from 'react'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
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
} from '@material-ui/core'

import { getDateTimeStringLocale } from '../common/locale'
import Filter, { FILTER_WIDTH } from './Filter'
import TreeDetails from './TreeDetails.js'

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
})

const columns = [
  {
    attr: 'id',
    label: 'Tree ID',
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
    renderer: val => getDateTimeStringLocale(val)
  },
]

class TreeTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isDetailsPaneOpen: false,
    }
    this.closeDrawer = this.closeDrawer.bind(this)
    this.handleFilterSubmit = this.handleFilterSubmit.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleRowsPerPageChange = this.handleRowsPerPageChange.bind(this)
    this.createSortHandler = this.createSortHandler.bind(this)
    this.scrollRef = React.createRef()
  }

  loadTrees(payload) {
    this.props.getTreesAsync(payload).then(() => {
      this.scrollRef.current && this.scrollRef.current.scrollTo(0,0)
    })
  }

  componentDidMount() {
    this.loadTrees()
  }

  toggleDrawer(id) {
    this.props.getTreeAsync(id)
    const { isDetailsPaneOpen } = this.state
    this.setState({
      isDetailsPaneOpen: !isDetailsPaneOpen,
    })
  }

  createToggleDrawerHandler(id) {
    return () => {
      this.toggleDrawer(id)
    }
  }

  closeDrawer() {
    this.setState({
      isDetailsPaneOpen: false,
    })
  }

  handleFilterSubmit(filter) {
    this.loadTrees({
      page: 0,
      filter,
    })
  }

  handlePageChange(_event, page) {
    this.loadTrees({
      page,
    })
  }

  handleRowsPerPageChange(event) {
    this.loadTrees({
      page: 0,
      rowsPerPage: parseInt(event.target.value),
    })
  }

  createSortHandler(attr) {
    return () => {
      const order = this.props.orderBy === attr && this.props.order === 'asc' ? 'desc' : 'asc'
      const orderBy = attr
      this.loadTrees({order, orderBy})
    }
  }

  tablePagination() {
    return (
      <TablePagination
        rowsPerPageOptions={[25, 50, 100, 250, 500]}
        component="div"
        count={this.props.treeCount}
        page={this.props.page}
        rowsPerPage={this.props.rowsPerPage}
        onChangePage={this.handlePageChange}
        onChangeRowsPerPage={this.handleRowsPerPageChange}
      />
    )
  }
  render() {
    const { treesArray, tree, classes, orderBy, order } = this.props

    return (
      <div className={classes.tableContainer} ref={this.scrollRef}>
        <Grid container direction="row" justify="space-between" alignItems="center">
          <Typography variant="h5" className={classes.title}>
            Trees
          </Typography>
          {this.tablePagination()}
        </Grid>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map(({ attr, label, noSort }, index) => (
                <TableCell key={attr} sortDirection={orderBy === attr ? order : false}>
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
            {treesArray.map((tree) => (
              <TableRow
                key={tree.id}
                onClick={this.createToggleDrawerHandler(tree.id)}
                className={classes.tableRow}
              >
                {columns.map(({ attr, label, renderer }, index) => (
                  <TableCell
                    key={attr}
                  >
                    {renderer ? renderer(tree[attr]) : tree[attr]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {this.tablePagination()}
        <Drawer anchor="right" open={this.state.isDetailsPaneOpen} onClose={this.closeDrawer}>
          <TreeDetails tree={tree} />
        </Drawer>
        <Filter isOpen={true} onSubmit={this.handleFilterSubmit} filter={this.props.filter} />
      </div>
    )
  }
}

const mapState = (state) => {
  const keys = Object.keys(state.trees.data)
  return {
    treesArray: keys.map((id) => ({
      ...state.trees.data[id],
    })),
    ...state.trees
  }
}

const mapDispatch = (dispatch) => ({
  getTreesAsync: (payload) => dispatch.trees.getTreesAsync(payload),
  getLocationName: (id, lat, lon) =>
    dispatch.trees.getLocationName({ id: id, latitude: lat, longitude: lon }),
  getTreeAsync: (id) => dispatch.trees.getTreeAsync(id),
})

export default compose(withStyles(styles), connect(mapState, mapDispatch))(TreeTable)
