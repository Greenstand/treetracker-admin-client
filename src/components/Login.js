import React from 'react'
import {
  Checkbox,
  Grid,
  Box,
  TextField,
  FormControlLabel,
  CssBaseline,
  Button,
  Typography,
  Container,
  CircularProgress,
} from '@material-ui/core'
import IconLogo from './IconLogo'
import { withStyles } from '@material-ui/core/styles'
import { AppContext } from './Context'
import classNames from 'classnames'
import {
  useHistory,
  useLocation
} from 'react-router-dom'
import axios from 'axios'
// import Copyright from 'components/Copyright'

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  submitText: {
    color: 'white',
  },
  forgetPassword: {
    margin: theme.spacing(2, 0),
  },
  buttonProgress: {
    color: theme.palette.primary.main,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
})

const Login = (props) => {
  const appContext = React.useContext(AppContext)
  const { classes } = props
  const [userName, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [usernameBlurred, setUsernameBlurred] = React.useState(false)
  const [passwordBlurred, setPasswordBlurred] = React.useState(false)
  const [isRemember, setRemember] = React.useState(true)

  const history = useHistory()
  const location = useLocation()
  const { from } = location.state || { from: { pathname: "/" } }

  React.useEffect(() => {
    return () => {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    setErrorMessage('')
  }, [userName, password])

  const submitClassname = classNames({
    [classes.submit]: loading,
  })

  function handleUsernameChange(e) {
    setUsername(e.target.value)
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value)
  }

  function handleUsernameFocus() {
    setUsernameBlurred(false)
  }

  function handlePasswordFocus() {
    setPasswordBlurred(false)
  }

  function handleUsernameBlur() {
    setUsernameBlurred(true)
  }

  function handlePasswordBlur() {
    setPasswordBlurred(true)
  }

  function wasUsernameLeftBlank() {
    return usernameBlurred && userName === ''
  }

  function wasPasswordLeftBlank() {
    return passwordBlurred && password === ''
  }

  function handleSubmit(e) {
    e.preventDefault()
    e.stopPropagation()
    setPasswordBlurred(true)
    setUsernameBlurred(true)

    //Do not show loading spinner if username or password are empty
    if (!loading && userName && password) {
      setLoading(true)
    }

    //Do not send request if username or password are empty
    if (userName && password) {
      (async () => {
        try {
          const res = await axios.post(`${process.env.REACT_APP_API_ROOT}/auth/login`, {
            userName,
            password,
          })
          if (res.status === 200) {
            const token = res.data.token
            const user = res.data.user
            appContext.login(user, token, isRemember)
            setLoading(true)
          } else {
            setErrorMessage('Invalid username or password')
            setLoading(false)
          }
        } catch (e) {
          console.error("Undefined User error:", e)
          if (e.response.data.errorMessage) {
            setErrorMessage(
              e.response.data.errorMessage
            )
            setLoading(false)
          } else {
            setErrorMessage(
              'Could not log in. Please check your username and password or contact the admin.'
            )
            setLoading(false)
          }
        }
      })()
    }
    return false
  }

  if (appContext.user) {
    history.replace(from)
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <IconLogo />
        <Box m={2} />
        <Typography variant="h2">Admin Panel</Typography>
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="userName"
            label="Username"
            name="userName"
            autoComplete="userName"
            onFocus={handleUsernameFocus}
            onBlur={handleUsernameBlur}
            helperText={wasUsernameLeftBlank() ? 'Field is required' : '' }
            error={wasUsernameLeftBlank()}
            onChange={handleUsernameChange}
            value={userName}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onFocus={handlePasswordFocus}
            onBlur={handlePasswordBlur}
            helperText={
              wasPasswordLeftBlank() ? 'Field is required' : ''
            }
            error={wasPasswordLeftBlank()}
            onChange={handlePasswordChange}
            value={password}
          />
          <Grid container justify="space-between">
            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox
                    name="remember"
                    checked={isRemember}
                    onClick={() => setRemember(!isRemember)}
                    value="remember"
                    color="primary"
                  />
                }
                label="Remember me"
              />
            </Grid>
            <Grid item>
              {/*
              <Box className={classes.forgetPassword}>
                <Link href="/reset_password" variant="body2">
                  Forgot password?
                </Link>
              </Box>
              */}
            </Grid>
          </Grid>

          <Typography variant="subtitle2" color="error">
            {errorMessage}
          </Typography>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            //Disable button if sending request, username or password are empty
            disabled={loading || !userName || !password}
            className={submitClassname}
          >
            <Typography className={classes.submitText}>LOG IN</Typography>
          </Button>
          {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
        </form>
      </div>
    </Container>
  )
}

export default withStyles(styles)(Login)
