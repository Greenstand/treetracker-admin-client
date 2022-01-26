import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography, Box } from '@material-ui/core';

const useStyles = makeStyles((t) => ({
  test: {
    padding: t.spacing(1),
  },
  box1: {
    width: 173,
    height: 50,
  },
  box2: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  box3: {
    //padding: t.spacing(2),
    width: 48,
    justifyContent: 'center',
    display: 'flex',
    '& svg': {
      width: 24,
      height: 24,
      fill: 'gray',
    },
  },
  box4: {},
  text: {
    fontFamily: 'Roboto',
    fontSize: '12px',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: '14px',
    letterSpacing: '0em',
    textAlign: 'left',
  },
  bold: {
    fontWeight: '700',
  },
}));

function CurrentCaptureNumber(props) {
  const classes = useStyles();
  return (
    <Box>
      <Paper elevation={3} className={classes.box1}>
        <Box className={classes.box2}>
          <Box className={classes.box3}>
            {props.cameraImg}
            {props.treeIcon}
          </Box>
          <Box className={classes.box4}>
            <Typography
              variant="h6"
              className={`${classes.text} ${classes.bold}`}
            >
              {props.imgCount} {props.treesCount}
            </Typography>
            <Typography variant="body1" className={classes.text}>
              {props.text}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default CurrentCaptureNumber;
