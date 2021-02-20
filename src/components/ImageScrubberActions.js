import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import DeleteIcon from '@material-ui/icons/DeleteRounded'

const styles = {
  root: {
    position: 'fixed',
    top: '100vh'
  }
};

const ImageScrubberActions = props => {
  const [value, setValue] = useState(0)


  let handleChange = (event, value) => {
    setValue(value);
  };

  const { classes } = props

  return (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      showLabels
      className={ [classes.root, classes.active]}
    >
      <BottomNavigationAction label="Mark Inactive" icon={<DeleteIcon />} />
    </BottomNavigation>
  );
}

ImageScrubberActions.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ImageScrubberActions)
