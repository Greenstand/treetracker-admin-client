/*
 * The reporting card components
 */
import {
  Box,
  // Grid,
  Card,
  Modal,
  Typography,
  // Avatar,
  Button,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import React from 'react';
import ArrayIcon from '@material-ui/icons/ArrowForward';
import theme from '../common/theme';
import log from 'loglevel';
import * as d3 from 'd3';
import Skeleton from '@material-ui/lab/Skeleton';
import { countToLocaleString } from '../../common/numbers';

console.error('color:', theme.palette.stats.green);
console.error(
  'color2:',
  d3.color(theme.palette.stats.green).brighter().toString()
);
//use material ui withStyles to style the component
const style = (theme) => ({
  root: {
    margin: theme.spacing(2.5),
    borderRadius: 10,
    backgroundColor: 'white',
    padding: theme.spacing(4, 6),
    minHeight: theme.spacing(74),
    //minWidth: theme.spacing(79),
    maxWidth: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
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
    flexGrow: 1,
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
    width: '100%',
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
  modal: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    maxWidth: '80%',
    minWidth: 400,
    minHeight: 600,
    maxHeight: 600,
    overflow: 'auto',
  },
  name: {
    marginRight: theme.spacing(12),
  },
});

function GrowerReportingCard(props) {
  const {
    classes,
    data,
    text,
    color,
    icon,
    disableSeeMore /*, moreData*/,
  } = props;
  const [open, setOpen] = React.useState(false);

  const Icon = icon;

  function handleSeeMore() {
    log.log('see more');
    data.loadMore();
    setOpen(true);
  }

  log.warn('icon', icon);

  return (
    <>
      <Box className={classes.root}>
        <Box className={classes.box0}>
          <Typography className={classes.title}>{text.title}</Typography>
          <Box className={classes.box2}>
            <Box
              className={classes.iconTotalBox}
              style={{
                backgroundColor: d3
                  .color(color)
                  .copy({ opacity: 0.15 })
                  .toString(),
              }}
            >
              <Icon className={classes.iconTotal} style={{ color }} />
            </Box>
            <Box className={classes.box3}>
              <Typography className={classes.total}>
                {data ? countToLocaleString(data.num1) : <Skeleton />}
              </Typography>
              <Typography className={classes.totalText}>
                {text.text1}
              </Typography>
            </Box>
          </Box>
          <Box mt={6} />
          {data ? (
            data.top.slice(0, 3).map((item, i) => (
              <Box key={i} className={classes.box4}>
                <Typography className={classes.name}>{item.name}</Typography>
                <Typography className={classes.number}>
                  {new Intl.NumberFormat().format(item.num)}
                </Typography>
              </Box>
            ))
          ) : (
            <>
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </>
          )}
        </Box>
        <Box className={classes.box1}>
          {!disableSeeMore &&
            (data ? (
              <>
                <ArrayIcon className={classes.icon} />
                <Button onClick={handleSeeMore} variant="text" color="primary">
                  <Typography className={classes.seeMore}>SEE MORE</Typography>
                </Button>
              </>
            ) : (
              <Skeleton style={{ width: '100%' }} />
            ))}
        </Box>
      </Box>
      {data && (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          className={classes.modal}
        >
          <Card className={classes.card}>
            <Box
              className={classes.root}
              style={{ justifyContent: 'flex-start' }}
            >
              <Typography className={classes.title}>{text.title}</Typography>
              <Box className={classes.box2}>
                <Box
                  className={classes.iconTotalBox}
                  style={{
                    backgroundColor: d3
                      .color(color)
                      .copy({ opacity: 0.15 })
                      .toString(),
                  }}
                >
                  <Icon className={classes.iconTotal} style={{ color }} />
                </Box>
                <Box className={classes.box3}>
                  <Typography className={classes.total}>{data.num1}</Typography>
                  <Typography className={classes.totalText}>
                    {text.text1}
                  </Typography>
                </Box>
              </Box>
              <Box mt={6} />
              {data.moreData &&
                data.moreData.map((item, i) => (
                  <Box key={i} className={classes.box4}>
                    <Typography className={classes.name}>
                      {item.name}
                    </Typography>
                    <Typography className={classes.number}>
                      {new Intl.NumberFormat().format(item.number)}
                    </Typography>
                  </Box>
                ))}
            </Box>
          </Card>
        </Modal>
      )}
    </>
  );
}

//export the component
export default withStyles(style)(GrowerReportingCard);
