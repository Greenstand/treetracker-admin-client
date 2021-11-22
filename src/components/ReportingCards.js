/*
 * The reporting card components
 */
import { Box, Grid, Typography, Avatar } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import React from 'react';
import ArrayIcon from '@material-ui/icons/ArrowForward';
import theme from './common/theme';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import * as d3 from 'd3';

console.error('color:', theme.palette.stats.green);
console.error(
  'color2:',
  d3.color(theme.palette.stats.green).brighter().toString(),
);
//use material ui withStyles to style the component
const style = (theme) => ({
  root: {
    margin: theme.spacing(2.5),
    borderRadius: 10,
    backgroundColor: 'white',
    padding: theme.spacing(4, 6),
  },
  title: {
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '16px',
    lineHeight: '24px',
  },
  box2: {
    marginTop: theme.spacing(4),
    display: 'flex',
  },
  avatar: {
    width: theme.spacing(20),
    height: theme.spacing(20),
  },
  box3: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: theme.spacing(4),
  },
  total: {
    fontWeight: 'bold',
    fontSize: '24px',
    lineHeight: '24px',
  },
  totalText: {
    fontWeight: 'normal',
    fontSize: '12px',
    lineHeight: '16px',
    color: '#585B5D',
  },
  box4: {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 'normal',
    fontSize: '16px',
    lineHeight: '24px',
    marginTop: theme.spacing(2),
  },
  box1: {
    marginTop: theme.spacing(4),
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    color: '#c6c4c4',
  },
  icon: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  seeMore: {
    marginLeft: theme.spacing(2),
  },
  iconTotal: {
    fontSize: '48px',
    color: theme.palette.stats.green,
  },
  iconTotalBox: {
    width: theme.spacing(20),
    height: theme.spacing(20),
    backgroundColor: d3
      .color(theme.palette.stats.green)
      .copy({ opacity: 0.15 })
      .toString(),
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

function GrowerReportingCard(props) {
  const { classes } = props;
  return (
    <Box className={classes.root}>
      <Typography className={classes.title}>Grower</Typography>
      <Box className={classes.box2}>
        <Box className={classes.iconTotalBox}>
          <PeopleOutlineIcon className={classes.iconTotal} />
        </Box>
        <Box className={classes.box3}>
          <Typography className={classes.total}>785</Typography>
          <Typography className={classes.totalText}>total</Typography>
        </Box>
      </Box>
      <Box mt={6} />
      <Box className={classes.box4}>
        <Typography className={classes.name}>CAN SL</Typography>
        <Typography className={classes.number}>56</Typography>
      </Box>
      <Box className={classes.box4}>
        <Typography className={classes.name}>CAN SL</Typography>
        <Typography className={classes.number}>56</Typography>
      </Box>
      <Box className={classes.box4}>
        <Typography className={classes.name}>CAN SL</Typography>
        <Typography className={classes.number}>56</Typography>
      </Box>
      <Box className={classes.box1}>
        <ArrayIcon className={classes.icon} />
        <Typography className={classes.seeMore}>SEE MORE</Typography>
      </Box>
    </Box>
  );
}

//export the component
export default withStyles(style)(GrowerReportingCard);
