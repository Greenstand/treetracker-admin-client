import React, { Component } from 'react'
import PropTypes from 'prop-types'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'

import { selectedHighlightColor } from '../../common/variables.js'

const styles = theme => ({
  cardImg: {
    width: '100%',
    height: 'auto'
  },
  cardTitle: {
    color: '#f00'
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

const TreeImageCard = props => {
  const onStatusToggle = (e, id, isActive) => {
    const { toggleTreeActive } = props
    e.stopPropagation()
    toggleTreeActive(id, isActive)
  }

  const { tree, classes, toggleSelection } = props

  return (
    <div
      className={classes.cardWrapper}
      key={tree.id}>
      <Card id={`card_${tree.id}`}
        className={classes.card}
        onClick={
          function (e) {
            e.stopPropagation()
            document.getElementById(`card_${tree.id}`).classList.toggle(classes.selected)
            toggleSelection(tree.id)
          }
        }>
        <CardContent>
          <CardMedia
            className={classes.cardMedia}
            image={tree.imageUrl}
          />
          <Typography
            className={classes.cardTitle}
            color="textSecondary"
            gutterBottom
          >
              Tree# {tree.id}
          </Typography>
        </CardContent>
        <CardActions
          style={{ 'position': 'fix' }}
        >
          <Button
            size="small"
            onClick={(e) => onStatusToggle(e, tree.id, true)}
          >
            Reject
          </Button>
          <Button
            size="small"
            onClick={
              (e) => onStatusToggle(e, tree.id, false)
            }
          >
            Approve
          </Button>
        </CardActions>
      </Card>
    </div>
  )
}

TreeImageCard.propTypes = {
  tree: PropTypes.object.isRequired,
  toggleSelection: PropTypes.func.isRequired
}

const mapDispatch = (dispatch) => ({
  toggleTreeActive: (id) => dispatch.imageScrubber.toggleTreeActive(id),
  toggleSelection: (id) => dispatch.imageScrubber.toggleSelection({ id: id })
})

export default compose(
  withStyles(styles, { withTheme: true, name: 'TreeImageCard' }),
  connect(null, mapDispatch)
)(TreeImageCard)
