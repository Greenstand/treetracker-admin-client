import React from 'react';

import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';

import IconLogo		from './IconLogo';
import Menu from './common/Menu.js'

const log = require('loglevel').getLogger('../components/Navbar');

const useStyles = makeStyles(theme => ({
  toolbar: {
    minHeight: '48px',
  },
}));

const Navbar = (props) => {
  log.debug('render Navbar...');
  const [isMenuShown, setMenuShown] = React.useState(false)
  const classes = useStyles(props);

  function handleMenuClick() {
    setMenuShown(!isMenuShown)
  }

  return (
    <React.Fragment>
      <AppBar color='default' className={props.className}>
        <Grid container direction='column'>
          <Toolbar className={classes.toolbar} disableGutters={true}>
            <Grid container justify='space-between'>
              <Grid item>
                <IconButton title="menu" onClick={() => handleMenuClick()}>
                  <MenuIcon/>
                </IconButton>
                <IconLogo/>
              </Grid>
              <Grid item>
                {props.buttons}
              </Grid>
            </Grid>
          </Toolbar>
          <Grid item>
            {props.children}
          </Grid>
        </Grid>
      </AppBar>
      {/* children duplicated behind the AppBar component to preserve height */}
      <Toolbar className={classes.toolbar}/>
      {props.children}
      {isMenuShown && <Menu onClose={() => setMenuShown(false)} />}
    </React.Fragment>
  )
}

export default Navbar;
