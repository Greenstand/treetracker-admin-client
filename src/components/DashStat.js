import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';

const style = (theme) => ({
  dashstatCard: {
    borderRadius: '10px',
    display: 'flex',
    backgroundColor: '#FFF',
    flexDirection: 'row',
    gap: '1rem',
    width: '245px',

    '@media (max-width: 900px)': {
      flexDirection: 'column',
      gap: 0,
      height: '175px',
      alignItems: 'center',
      width: '200px',
      textAlign: 'center',
    },
  },
  dashstatIconContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '58px',
    height: '58px',
    marginTop: '20px',
    marginLeft: '30px',
    marginBottom: '20px',
    float: 'left',
    position: 'relative',

    '@media (max-width: 900px)': {
      height: '150px',
      marginLeft: 0,
    },
  },
  dashstatCircleIcon: {
    borderRadius: '29px',
    width: '58px',
    height: '58px',
    opacity: '0.15',
    left: '0',
    top: '0',
    position: 'absolute',
  },

  dashstatIcon: {
    margin: '0 auto',
    left: '11px',
    bottom: '12px',
    width: '35px',
    height: '35px',
    position: 'absolute',

    '@media (max-width: 900px)': {
      top: '10px',
    },
  },

  dashstatText: {
    display: 'block',
    fontFamily: theme.typography.fontFamily,
  },

  dashstatLabel: {
    fontSize: '12px',
  },
});

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
  const { data, Icon, label, color = '#000000', classes } = props;

  return (
    <div className={classes.dashstatCard}>
      <div className={classes.dashstatIconContainer}>
        <div
          className={classes.dashstatCircleIcon}
          style={{ backgroundColor: color }}
        ></div>
        <Icon className={classes.dashstatIcon} style={{ color: color }}></Icon>
      </div>
      <div className={classes.dashstatText}>
        <h3>{data || <CircularProgress size={'32px'} style={{ color }} />}</h3>
        <p className={classes.dashstatLabel}>{label}</p>
      </div>
    </div>
  );
}

export default withStyles(style)(DashStat);
