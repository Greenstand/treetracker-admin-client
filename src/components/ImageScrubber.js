import React, { useEffect } from 'react'
import compose from 'recompose/compose'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import Button from '@material-ui/core/Button' // replace with icons down the line
import Infinite from 'react-infinite'

import { selectedHighlightColor } from '../../common/variables.js'
import TreeImageCard from '../TreeImageCard/TreeImageCard'

const styles = theme => ({
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '2rem'
  },
  filterHeader: {
    position: 'fixed',
    zIndex: 1000
  },
  filter: {
    zIndex: 1001
  },
  card: {
    cursor: 'pointer',
    margin: '0.5rem',
    border: `2px #eee solid`
  },
  selected: {
    border: `2px ${selectedHighlightColor} solid`
  },
  cardMedia: {
    height: '12rem'
  },
  cardWrapper: {
    width: '33.33%'
  }
})

const scroll = {
  containerHeight: 1017,
  elementHeight: 295
}

const ImageScrubber = props => {
  useEffect(() => {
    getTreesWithImages()
  })

  const getTreesWithImages = (order, orderBy) => {
    const payload = {
      page: props.page,
      rowsPerPage: props.rowsPerPage,
      order: order || props.order,
      orderBy: orderBy || props.orderBy
    }

    return props.getTreesWithImagesAsync(payload)
  }

  const shouldComponentUpdate = (nextProps, nextState) => {
    if (nextProps.treesArray !== props.treesArray) {
      return true
    }

    return false
  }

  const sortImages = (e, orderBy, order) => {
    e.preventDefault()
    let newOrder = (order === 'asc') ? 'desc' : 'asc'
    getTreesWithImages(newOrder, orderBy)
  }

  const {
    numSelected,
    classes,
    rowsPerPage,
    selected,
    order,
    orderBy,
    treesArray,
    getLocationName,
    treeCount,
    byId,
    tree
  } = props

  const idArrow = (order === 'asc' && orderBy === 'id') ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />
  const updatedArrow = (order === 'asc' && orderBy === 'timeUpdated') ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />

  return (
    <div>
      <div className={classes.wrapper}>
        <Card className={classNames(classes.card, classes.filterHeader)}>
          <CardActions className={classes.filter}>
            <Button size="small" onClick={(e) => sortImages(e, 'id', order)}>
              id
              {idArrow}
            </Button>
            <Button size="small" onClick={(e) => sortImages(e, 'timeUpdated', order)}>
              updated
              {updatedArrow}
            </Button>
          </CardActions>
        </Card>
      </div>
      <Infinite
        containerHeight={scroll.containerHeight}
        elementHeight={scroll.elementHeight}
        useWindowAsScrollContainer={true}
      >
        <div className={classes.wrapper}>
          {props.treesArray.map(tree => {
            return (
              <TreeImageCard key={tree.id} tree={tree} />
            )
          })}
        </div>
      </Infinite>
    </div>
  )
}

ImageScrubber.propTypes = {
  treesArray: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  selected: PropTypes.array.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  numSelected: PropTypes.number.isRequired,
  byId: PropTypes.object
}

const mapState = state => {
  const keys = Object.keys(state.trees.data)
  return {
    treesArray: keys.map(id => ({
      ...state.imageScrubber.data[id]
    })),
    page: state.imageScrubber.page,
    rowsPerPage: state.imageScrubber.rowsPerPage,
    selected: state.imageScrubber.selected,
    order: state.imageScrubber.order,
    orderBy: state.imageScrubber.orderBy,
    numSelected: state.imageScrubber.selected.length,
    byId: state.imageScrubber.byId
  }
}

const mapDispatch = (dispatch) => ({
  getTreesWithImagesAsync: ({ page, rowsPerPage, order, orderBy }) => dispatch.imageScrubber.getTreesWithImagesAsync({ page: page, rowsPerPage: rowsPerPage, order: order, orderBy: orderBy }),
  getLocationName: (id, lat, lon) => dispatch.imageScrubber.getLocationName({ id: id, latitude: lat, longitude: lon }),
  getTreeAsync: (id) => dispatch.imageScrubber.getTreeAsync(id),
  sortTrees: (order, orderBy) => dispatch.trees.sortTrees({ order, orderBy })
})

export default compose(
  withStyles(styles, { withTheme: true, name: 'ImageScrubber' }),
  connect(mapState, mapDispatch)
)(ImageScrubber)
