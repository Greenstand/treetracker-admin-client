import React, { useContext, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Box from '@material-ui/core/Box';
import IconLogo from '../IconLogo';
import { AppContext } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';

export const MENU_WIDTH = 232;

const useStyles = makeStyles((theme) => ({
  drawer: {},
  drawerPaper: {
    width: MENU_WIDTH,
    position: 'inherit',
    height: '100vh',
  },
  menuTitle: {
    letterSpacing: '.05em',
    fontVariantCaps: 'all-small-caps',
    fontSize: '16px',
    fontWeight: '500',
  },
  menuItemWithChildren: {
    padding: theme.spacing(0, 0, 0, 4),
  },
  menuItem: {
    '&:hover': {
      backgroundColor: theme.palette.primary.lightVery,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.primary.main,
      },
      '& .MuiListItemIcon-root': {
        color: theme.palette.primary.main,
      },
    },
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    marginRight: 35,
    '&.Mui-selected': {
      color: theme.palette.primary.main,
      fontWeight: 400,
      backgroundColor: theme.palette.action.hover,
    },
    '&.Mui-selected .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
  },
  listItemIcon: {
    minWidth: 46,
  },
  listItemText: {
    '& .MuiTypography-body1': {
      fontWeight: 700,
    },
  },
  linkItemText: {
    textDecoration: 'none',
    color: theme.palette.primary.main,
  },
}));

export default function GSMenu(props) {
  const classes = useStyles();
  const appContext = useContext(AppContext);

  const menu = (
    <>
      <Box p={4}>
        <IconLogo />
      </Box>
      <Box height={20} />
      {useMemo(
        () =>
          appContext.routes &&
          appContext.routes
            .filter(({ disabled }) => !disabled)
            .map((item, i) =>
              item?.children ? (
                <div
                  key={`${item}-${i}`}
                  className={classes.menuItemWithChildren}
                >
                  <Typography className={classes.menuTitle}>
                    {item.name}
                  </Typography>
                  {item.children
                    .filter(({ disabled }) => !disabled)
                    .map((child, i) => (
                      <Link
                        key={`menu_${i}`}
                        className={classes.linkItemText}
                        to={child.linkTo}
                      >
                        <MenuItem
                          className={classes.menuItem}
                          selected={props.active === item.name}
                        >
                          <Grid container direction="row" alignItems="flex-end">
                            <Grid item>
                              <ListItemIcon className={classes.listItemIcon}>
                                {child.icon && <child.icon />}
                              </ListItemIcon>
                            </Grid>
                            <Grid item>
                              <ListItemText className={classes.listItemText}>
                                {child.name}
                              </ListItemText>
                            </Grid>
                          </Grid>
                        </MenuItem>
                      </Link>
                    ))}
                </div>
              ) : (
                <Link
                  key={`menu_${i}`}
                  className={classes.linkItemText}
                  to={item.linkTo}
                >
                  <MenuItem
                    className={classes.menuItem}
                    selected={props.active === item.name}
                  >
                    <Grid container direction="row" alignItems="flex-end">
                      <Grid item>
                        <ListItemIcon className={classes.listItemIcon}>
                          {item.icon && <item.icon />}
                        </ListItemIcon>
                      </Grid>
                      <Grid item>
                        <ListItemText className={classes.listItemText}>
                          {item.name}
                        </ListItemText>
                      </Grid>
                    </Grid>
                  </MenuItem>
                </Link>
              )
            ),
        [appContext.routes, props.active, classes]
      )}
    </>
  );

  return props.variant === 'plain' ? (
    <>{menu}</>
  ) : (
    <Drawer
      PaperProps={{
        elevation: 5,
      }}
      className={classes.drawer}
      classes={{ paper: classes.drawerPaper }}
      onClose={props.onClose}
      open={true}
    >
      {menu}
    </Drawer>
  );
}
