import React from 'react'
import PropTypes from 'prop-types'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'

import AppDrawer from './AppDrawer'
import Trees from './Trees'
import TreeImageScrubber from './TreeImageScrubber'
import { drawerWidth } from '../common/variables'

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100vh',
    zIndex: 1,
    overflow: 'auto',
    position: 'relative',
    display: 'flex',
    padding: 0,
    margin: 0
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundColor: '#517147',
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36
  },
  hide: {
    display: 'none'
  },
  toolbar: {
    top: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    backgroundColor: '#eee',
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    padding: 0,
    margin: 0,
    paddingTop: theme.spacing.unit * 8,
    paddingLeft: theme.spacing.unit * 8.25,
    backgroundColor: theme.palette.background.default
  },
  title: {
    fontFamily: 'Cabin Sketch',
    fontSize: '1.75em'
  },
  tableToolbar: {
    position: 'fixed',
    bottom: 0,
    left: 0
  }
})

const AppFrame = () => ({
  render () {
    let scrollContainerRef = null
    const getScrollContainerRef = () => scrollContainerRef
    const setScrollContainerRef = el => {
      scrollContainerRef = el
    }
    const {
      classes,
      toggleAppDrawer,
      appDrawer,
      currentView
    } = this.props
    let tabContents
    if (currentView === 'trees') {
      tabContents = <Trees />
    } else if (currentView === 'imageScrubber') {
      tabContents = (
        <TreeImageScrubber getScrollContainerRef={getScrollContainerRef} />
      )
    }
    return (
      <div className={classes.root} ref={setScrollContainerRef}>
        <AppBar
          position="fixed"
          className={classNames(
            classes.appBar,
            appDrawer.isOpen && classes.appBarShift
          )}
        >
          <Toolbar disableGutters={!appDrawer.isOpen}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={toggleAppDrawer()}
              className={classNames(
                classes.menuButton,
                appDrawer.isOpen && classes.hide
              )}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              className={classes.title}
              variant="title"
              color="inherit"
              noWrap
            >
              TreeTracker Admin
            </Typography>
          </Toolbar>
        </AppBar>
        <AppDrawer />
        <main className={classNames(classes.content, currentView)}>
          {tabContents}
        </main>
      </div>
    )
  }
})

const mapState = state => {
  return {
    appDrawer: state.appFrame.appDrawer,
    currentView: state.appFrame.currentView
  }
}

const mapDispatch = dispatch => {
  return {
    closeAppDrawer: () => dispatch.appFrame.closeAppDrawer,
    toggleAppDrawer: () => dispatch.appFrame.toggleAppDrawer,
    changeCurrentView: ({ currentView }) =>
      dispatch.appFrame.changeCurrentView({ currentView: currentView })
  }
}

AppFrame.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

export default compose(
  withStyles(styles, { withTheme: true, name: 'AppFrame' }),
  connect(
    mapState,
    mapDispatch
  )
)(AppFrame)
