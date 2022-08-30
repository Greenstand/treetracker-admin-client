import React, { useState } from 'react';

import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';

import IconLogo from './IconLogo';
import Menu from './common/Menu.js';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    minHeight: 'calc(15px - 2vw)',
  },
  buttons: {
    display: 'flex',
    margin: theme.spacing(1),
  },
  navbar: {
    // width: `calc(100% - ${SIDE_PANEL_WIDTH}px)`,
    width: '100%',
    position: 'relative',
    left: 0,
    right: 'auto',
  },
}));

const Navbar = (props) => {
  const [isMenuShown, setMenuShown] = useState(false);
  const classes = useStyles(props);

  function handleMenuClick() {
    setMenuShown(!isMenuShown);
  }

  return (
    <>
      <AppBar color="default" className={classes.navbar}>
        <Grid container direction="column">
          <Toolbar className={classes.toolbar} disableGutters={true}>
            <Grid container justifyContent="space-between">
              <Grid item>
                <IconButton title="menu" onClick={() => handleMenuClick()}>
                  <MenuIcon />
                </IconButton>
                <IconLogo />
              </Grid>
              <Grid item className={classes.buttons}>
                {props.buttons}
              </Grid>
            </Grid>
          </Toolbar>
          <Grid item>{props.children}</Grid>
        </Grid>
      </AppBar>
      {/* children duplicated behind the AppBar component to preserve height */}
      <Toolbar className={classes.toolbar} />
      {/* {props.children} */}
      {isMenuShown && <Menu onClose={() => setMenuShown(false)} />}
    </>
  );
};

export default Navbar;
