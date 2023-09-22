import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { Suspense, lazy, useContext, useEffect, useState } from 'react';

import AccountIcon from '@material-ui/icons/Person';
import { AppContext } from '../context/AppContext';
import Menu from './common/Menu';
import axios from 'axios';
import { documentTitle } from '../common/variables';
import { getDateTimeStringLocale } from '../common/locale';
import { useHistory } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

const style = (theme) => ({
  accountContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
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
    fontSize: '4rem',
    marginRight: theme.spacing(4),
    color: 'gray',
  },
  title: {
    fontSize: '.8rem',
    color: 'gray',
  },
  item: {
    fontSize: '1.2rem',
  },
  element: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  bodyBox: {
    paddingLeft: theme.spacing(2),
  },
  changeBox: {
    height: '100%',
  },
  logout: {
    width: '15rem',
    fontSize: '1rem',
    marginTop: theme.spacing(2),
  },
  border: {
    borderBottom: '1px solid #ddd',
  },
});

const PasswordStrengthMeter = lazy(() => import('./PasswordStrengthMeter'));
const renderLoader = () => (
  <CircularProgress
    size={24}
    classes={{ position: 'absolute', top: '50%', left: '50%' }}
  />
);

function Account(props) {
  const { classes } = props;
  const appContext = useContext(AppContext);
  const { user, token } = appContext;
  const [openPwdForm, setOpenPwdForm] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();

  function handleLogout() {
    history.push('/');
    appContext.logout();
  }

  const handleClickOpen = () => {
    setOpenPwdForm(true);
  };

  const handleClose = () => {
    setOpenPwdForm(false);
    setErrorMessage('');
    setOldPassword('');
    setNewPassword('');
    setConfirmedPassword('');
  };

  const onChangeOldPwd = (e) => {
    setOldPassword(e.target.value);
  };

  const onChangeNewPwd = (e) => {
    setNewPassword(e.target.value);
  };

  const onChangeConfirmedPwd = (e) => {
    setConfirmedPassword(e.target.value);
  };

  const handleConfirm = async (e) => {
    setErrorMessage('');
    e.preventDefault();
    e.stopPropagation();
    const result1 = await isOldPwdReal(oldPassword);
    const result2 = await doesNewPwdMatch(newPassword, confirmedPassword);
    if (result1 && result2) {
      let res = await axios.put(
        `${process.env.REACT_APP_API_ROOT}/auth/admin_users/${user.id}/password`,
        {
          password: newPassword,
        },
        {
          headers: { Authorization: token },
        }
      );
      if (res.status === 200) {
        setErrorMessage('Success!');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        appContext.logout();
      } else {
        console.error('load fail:', res);
        return;
      }
    }
  };

  const doesNewPwdMatch = (newPassword, confirmedPassword) => {
    if (!newPassword.length > 0 || !confirmedPassword.length > 0) {
      setErrorMessage('Input cannot be empty');
      return false;
    } else if (newPassword !== confirmedPassword) {
      setErrorMessage('New password does not match, please try again');
      return false;
    } else {
      return true;
    }
  };

  const isOldPwdReal = async (oldPassword) => {
    let result;

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_ROOT}/auth/validate`,
        {
          password: oldPassword,
        },
        {
          headers: { Authorization: token },
        }
      );
      if (res.status === 200) {
        setErrorMessage('');
        result = true;
      } else if (res.status === 401) {
        setErrorMessage('Old password incorrect, please check');
        result = false;
      }
    } catch (e) {
      console.error(e);
      setErrorMessage('Old password incorrect, please check');
      result = false;
    }
    return result;
  };

  useEffect(() => {
    document.title = `Account - ${documentTitle}`;
  });

  const roles = user.roleNames?.map((name, idx) => (
    <Typography key={`role_${idx}`} className={classes.item}>
      {name}
    </Typography>
  ));

  console.log('USER', user);

  return (
    <Grid className={classes.accountContainer}>
      <Paper elevation={3}>
        <Menu variant="plain" />
      </Paper>

      <Grid item style={{ flexGrow: 1 }}>
        <Grid container className={classes.rightBox}>
          <Grid item xs={12}>
            <Grid container className={classes.titleBox}>
              <Grid container alignItems="center" item>
                <AccountIcon className={classes.accountIcon} />
                <Typography variant="h3">Account</Typography>
              </Grid>
            </Grid>
            <Box className={classes.border} />
            <Box height={12} />
            <Grid container direction="column" className={classes.bodyBox}>
              <Grid className={classes.element} item>
                <Typography className={classes.title}>Username</Typography>
                <Typography className={classes.item}>
                  {user.userName}
                </Typography>
              </Grid>
              <Grid className={classes.element} item>
                <Typography className={classes.title}>Name</Typography>
                <Typography className={classes.item}>
                  {user.firstName} {user.lastName}
                </Typography>
              </Grid>
              <Grid className={classes.element} item>
                <Typography className={classes.title}>Email</Typography>
                <Typography className={classes.item}>{user.email}</Typography>
              </Grid>
              <Grid className={classes.element} item>
                <Typography className={classes.title}>Roles</Typography>
                {roles}
              </Grid>
              <Grid className={classes.element} item>
                <Typography className={classes.title}>Created</Typography>
                <Typography className={classes.item}>
                  {getDateTimeStringLocale(user.createdAt)}
                </Typography>
              </Grid>
              <Grid className={classes.element} item>
                <Typography className={classes.title}>Password</Typography>
                <Button
                  onClick={handleClickOpen}
                  color="primary"
                  className={classes.logout}
                >
                  CHANGE
                </Button>
              </Grid>
              <Box className={classes.border} height={20} />
              <Box height={12} />
              <Grid className={classes.element} item>
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

      <Dialog
        open={openPwdForm}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
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
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              onClick={handleConfirm}
              variant="contained"
              color="primary"
              disabled={!oldPassword || !newPassword || !confirmedPassword}
            >
              Save
            </Button>
          </DialogActions>
        </Suspense>
      </Dialog>
    </Grid>
  );
}

export default withStyles(style)(Account);
