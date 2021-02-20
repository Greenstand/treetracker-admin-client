
import React from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

const style = (theme) => ({
  dashstatContainer: {
    height: '95px',
    backgroundColor: 'white',
    borderRadius: '10px',
  },
  dashstatIconContainer: {
    width: '58px',
    height: '58px',
    marginTop: '20px',
    marginLeft: '30px',
    marginBottom: '20px',
    float: 'left',
    position: 'relative'
  },
  dashstatCircleIcon: {
    borderRadius: '29px',
    width: '58px',
    height: '58px',
    opacity: '0.15',
    left: '0',
    top: '0',
    position: 'absolute'
  },
  dashstatIcon: {
    margin: '0 auto',
    left: '11px',
    bottom: '12px',
    width: '35px',
    height: '35px',
    position: 'absolute',
  },
  dashstatText: {
    float: 'left',
    marginLeft: '22px',
    height: '100%',
    width: '90px',
    boxSizing: 'border-box',
    position: 'relative',
    fontFamily: theme.typography.fontFamily
  },
  dashstatData: {
    display: 'inline-block',
    position: 'absolute',
    top: '18px',
    marginBlockStart: 0,
    marginBlockEnd: 0,
  },
  dashstatLabel: {
    display: 'inline-block',
    fontSize: '12px',
    bottom: '20px',
    marginBlockStart: 0,
    marginBlockEnd: 0,
    width: '90px',
    position: 'absolute'
  }
})

/**
 * @param {{
 *   color?: string,
 *   data: any,
 *   Icon: Object,
 *   classes: any,
 *   label: string
 * }} props
 */
function DashStat(props) {
  const {
    data, Icon, label, color = '#000000', classes
  } = props;

  return (
    <Grid item xs={3}>
      <div className={classes.dashstatContainer}>
        <div className={classes.dashstatIconContainer}>
          <div className={classes.dashstatCircleIcon} style={{ backgroundColor: color }}></div>
          <Icon className={classes.dashstatIcon} style={{ color: color }}></Icon>
        </div>
        <div className={classes.dashstatText}>
          <h3 className={classes.dashstatData}>{data}</h3><br/>
          <p className={classes.dashstatLabel}>{label}</p>
        </div>
      </div>
    </Grid>
  )
}

export default withStyles(style)(DashStat);
