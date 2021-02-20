import React, { lazy, Suspense } from 'react'
import {
  Grid,
  Paper,
  Box,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  DialogTitle,
  CircularProgress,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import Menu from './common/Menu'
import AccountIcon from '@material-ui/icons/Person'
import { AppContext } from './Context'
import axios from 'axios'
import { getDateTimeStringLocale } from '../common/locale'

const style = (theme) => ({
  box: {
    height: '100%',
  },
  menu: {
    height: '100%',
  },
  rightBox: {
    height: '100%',
    padding: theme.spacing(8),
  },
  titleBox: {
    marginBottom: theme.spacing(4),
  },
  accountIcon: {
    fontSize: 67,
    marginRight: 11,
  },
  title: {
    fontSize: 33,
    marginBottom: theme.spacing(2),
  },
  item: {
    fontSize: 24,
    marginBottom: theme.spacing(3),
  },
  bodyBox: {
    paddingLeft: theme.spacing(4),
  },
  changeBox: {
    height: '100%',
  },
  logout: {
    width: 250,
  },
})

const PasswordStrengthMeter = lazy(() => import('./PasswordStrengthMeter'))
const renderLoader = () => (
  <CircularProgress size={24} classes={{ position: 'absolute', top: '50%', left: '50%' }} />
)

function Account(props) {
  const { classes } = props
  const appContext = React.useContext(AppContext)
  const { user, token } = appContext
  const [openPwdForm, setOpenPwdForm] = React.useState(false)
  const [oldPassword, setOldPassword] = React.useState('')
  const [newPassword, setNewPassword] = React.useState('')
  const [confirmedPassword, setConfirmedPassword] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState('')

  function handleLogout() {
    appContext.logout()
  }

  const handleClickOpen = () => {
    setOpenPwdForm(true)
  }

  const handleClose = () => {
    setOpenPwdForm(false)
    setErrorMessage('')
    setOldPassword('')
    setNewPassword('')
    setConfirmedPassword('')
  }

  const onChangeOldPwd = (e) => {
    setOldPassword(e.target.value)
  }

  const onChangeNewPwd = (e) => {
    setNewPassword(e.target.value)
  }

  const onChangeConfirmedPwd = (e) => {
    setConfirmedPassword(e.target.value)
  }

  const handleConfirm = async (e) => {
    setErrorMessage('')
    e.preventDefault()
    e.stopPropagation()
    const result1 = await isOldPwdReal(oldPassword)
    const result2 = await doesNewPwdMatch(newPassword, confirmedPassword)
    if (result1 && result2) {
      //patch the new password
      let res = await axios.put(
        `${process.env.REACT_APP_API_ROOT}/auth/admin_users/${user.id}/password`,
        {
          password: newPassword,
        },
        {
          headers: { Authorization: token },
        }
      )
      if (res.status === 200) {
        /*WARN!no update on the appContext here*/
        setErrorMessage('Success!')
        /* remove Remember me and force re-login */
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        appContext.logout()
      } else {
        console.error('load fail:', res)
        return
      }
    }
  }

  const doesNewPwdMatch = (newPassword, confirmedPassword) => {
    if (!newPassword.length > 0 || !confirmedPassword.length > 0) {
      setErrorMessage('Input cannot be empty')
      return false
    } else if (newPassword !== confirmedPassword) {
      setErrorMessage('New password does not match, please try again')
      return false
    } else {
      return true
    }
  }

  const isOldPwdReal = async (oldPassword) => {
    let result

    try {
      /* TODO: login bypassing admin auth ?*/
      const res = await axios.post(
        `${process.env.REACT_APP_API_ROOT}/auth/validate`,
        {
          password: oldPassword,
        },
        {
          headers: { Authorization: token },
        }
      )
      if (res.status === 200) {
        setErrorMessage('')
        result = true
      } else if (res.status === 401) {
        setErrorMessage('Old password incorrect, please check')
        result = false
      }
    } catch (e) {
      console.error(e)
      setErrorMessage('Old password incorrect, please check')
      result = false
    }
    return result
  }


  const [permissions, setPermissions] = React.useState([])
  const [users, setUsers] = React.useState([])

  React.useEffect(() => {
    //loading permission from server
    async function load() {
      let res = await axios.get(`${process.env.REACT_APP_API_ROOT}/auth/permissions`, {
        headers: { Authorization: token },
      })
      if (res.status === 200) {
        setPermissions(res.data)
        console.log(res.data);
      } else {
        console.error('load fail:', res)
        return
      }
      res = await axios.get(`${process.env.REACT_APP_API_ROOT}/auth/admin_users`, {
        headers: { Authorization: token },
      })
      if (res.status === 200) {
        setUsers(res.data)
      } else {
        console.error('load fail:', res)
        return
      }
    }

    load()
  }, [token])

  const freshUser = users.find(el => el.userName === user.userName) || user
  const roles = freshUser.role.map((r,idx) => {
    return permissions.reduce((el, p) => {
      return el || (p && p.id === r &&
        <Grid key={`role_${idx}`}>
          {p.roleName}
        </Grid>
      )
    }, undefined)
  })

  return (
    <>
      <Grid container className={classes.box}>
        <Grid item xs={3}>
          <Paper elevation={3} className={classes.menu}>
            <Menu variant="plain" />
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <Grid container className={classes.rightBox}>
            <Grid item xs={12}>
              <Grid container className={classes.titleBox}>
                <Grid item>
                  <AccountIcon className={classes.accountIcon} />
                </Grid>
                <Grid item>
                  <Typography variant="h2">Account</Typography>
                </Grid>
              </Grid>
              <Grid container direction="column" className={classes.bodyBox}>
                <Grid item>
                  <Typography className={classes.title}>Username</Typography>
                  <Typography className={classes.item}>{user.userName}</Typography>
                </Grid>
                <Grid item>
                  <Typography className={classes.title}>Name</Typography>
                  <Typography className={classes.item}>
                    {user.firstName} {user.lastName}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography className={classes.title}>Email</Typography>
                  <Typography className={classes.item}>{user.email}</Typography>
                </Grid>
                <Grid item>
                  <Typography className={classes.title}>Role</Typography>
                  <Typography className={classes.item}>
                    {roles}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography className={classes.title}>Created</Typography>
                  <Typography className={classes.item}>
                    {getDateTimeStringLocale(user.createdAt)}
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Grid container justify="space-between">
                    <Grid item>
                      <Typography className={classes.title}>Password</Typography>
                    </Grid>
                    <Grid item>
                      <Grid
                        container
                        justif="center"
                        alignItems="center"
                        className={classes.changeBox}
                      >
                        <Button onClick={handleClickOpen} color="primary">
                          CHANGE
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Box height={20} />
                    <Button
                      onClick={handleLogout}
                      color="secondary"
                      variant="contained"
                      className={classes.logout}
                    >
                      LOG OUT
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Dialog open={openPwdForm} onClose={handleClose} aria-labelledby="form-dialog-title">
        <Suspense fallback={renderLoader()}>
          <DialogTitle id="form-dialog-title">Change Password</DialogTitle>
          <DialogContent>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="old password"
              type="password"
              id="password"
              // helperText={
              //   userName === '' ? 'Field is required' : '' /*touched.email ? errors.email : ""*/
              // }
              // error={userName === '' /*touched.email && Boolean(errors.email)*/}
              onChange={onChangeOldPwd}
              value={oldPassword}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="new password"
              type="password"
              id="password"
              onChange={onChangeNewPwd}
              value={newPassword}
            />
            <PasswordStrengthMeter password={newPassword} />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="confirm password"
              type="password"
              id="password"
              onChange={onChangeConfirmedPwd}
              value={confirmedPassword}
            />
            <Typography variant="subtitle2" color="error">
              {errorMessage}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleConfirm} color="primary">
              Confirm
            </Button>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Suspense>
      </Dialog>
    </>
  )
}

export default withStyles(style)(Account)
