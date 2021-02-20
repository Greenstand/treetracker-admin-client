import React from 'react'

import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'

import Menu, { MENU_WIDTH } from './common/Menu'

const style = (theme) => ({
  box: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  menuAside: {
    height: '100%',
    width: MENU_WIDTH,
    position: 'absolute',
    left: 0,
    top: 0
  },
  menu: {
    height: '100%',
    width: MENU_WIDTH,
    overflow: 'hidden'
  },
  rightBox: {
    height: '100%',
    position: 'absolute',
    padding: '40px',
    left: MENU_WIDTH,
    top: 0,
    right: 0,
    backgroundColor: 'rgb(239, 239, 239)',
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center'
  },
  text: {
    fontSize: '40px',
    alignSelf: 'center',
    textAlign: 'center',
  }
})

function GenericMessagePage({ classes, text }) {
  return (
    <div className={classes.box}>
      <div className={classes.menuAside}>
        <Paper elevation={3} className={classes.menu}>
          <Menu variant="plain" />
        </Paper>
      </div>
      <div className={classes.rightBox}>
        <span className={classes.text}>{ text }</span>
      </div>
    </div>
  );
}

export default withStyles(style)(GenericMessagePage);
