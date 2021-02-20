import React from 'react'
import zxcvbn from 'zxcvbn'
import { withStyles } from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import classNames from 'classnames'

const styles = (theme) => ({
  alert: {
    color: theme.palette.primary.main,
  },
})

const PasswordStrengthMeter = (props) => {
  const { password, classes } = props

  const pwdScore = zxcvbn(password).score

  const pwdAlert = (pwdScore) => {
    switch (pwdScore) {
      case 0:
        return 'Too weak'
      case 1:
        return 'Weak'
      case 2:
        return 'Fair'
      case 3:
        return 'Good'
      case 4:
        return 'Strong'
      default:
        return 'Weak'
    }
  }

  return (
    <>
      {password && (
        <>
          <LinearProgress
            variant="determinate"
            color={classNames(pwdScore > 1 ? 'primary' : 'secondary')}
            value={pwdScore * 25}
          />
          <Typography className={classes.alert}>{pwdAlert(pwdScore)}</Typography>
        </>
      )}
    </>
  )
}

export default withStyles(styles)(PasswordStrengthMeter)
