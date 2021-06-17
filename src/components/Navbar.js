import React from 'react';

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
    minHeight: '48px',
  },
  buttons: {
    display: 'flex',
    margin: theme.spacing(1),
  },
}));

const Navbar = (props) => {
  const [isMenuShown, setMenuShown] = React.useState(false);
  const classes = useStyles(props);

  function handleMenuClick() {
    setMenuShown(!isMenuShown);
  }

  return (
    <React.Fragment>
      <AppBar color="default" className={props.className}>
        <Grid container direction="column">
          <Toolbar className={classes.toolbar} disableGutters={true}>
            <Grid container justify="space-between">
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
      <Toolbar className={classes.toolbar} />
      {isMenuShown && <Menu onClose={() => setMenuShown(false)} />}
    </React.Fragment>
  );
};

export default Navbar;
