import {
  Button,
  FormControl,
  Grid,
  Link,
  MenuItem,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';

import EmailIcon from '@material-ui/icons/Email';
import IdIcon from '@material-ui/icons/Money';
import MapIcon from '@material-ui/icons/Map';
import PersonIcon from '@material-ui/icons/Person';
import PhoneIcon from '@material-ui/icons/Phone';
import { StakeholdersContext } from '../../../context/StakeholdersContext';
import TypeIcon from '@material-ui/icons/Category';
import WebsiteIcon from '@material-ui/icons/Language';
import { makeStyles } from '@material-ui/core/styles';
import * as loglevel from 'loglevel';

const log = loglevel.getLogger('./Header.js');

const useStyles = makeStyles({
  logoLg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  grayFilter: {
    filter: 'grayscale(100%)',
  },
  pr: {
    paddingRight: 8,
  },
  pl: {
    paddingLeft: 32,
  },
  rowPadding: {
    padding: '4px 0',
  },
  textWhite: {
    color: 'white',
  },
  mt: {
    marginTop: 12,
  },

  fields: {
    padding: '6px 0 7px',
  },
  inputName: {
    fontSize: '1.67rem',
  },
  input: {
    height: 31,
  },
});

export default function StakeholderDialogHeader({
  data,
  isEditing,
  setIsEditing,
  forceSave,
  setForceSave,
}) {
  const { updateStakeholder } = useContext(StakeholdersContext);
  const [details, setDetails] = useState({ ...data });
  const [errors, setErrors] = useState({});

  const classes = useStyles();

  const validateEntries = (payload) => {
    const errors = {};

    if (
      !payload.type ||
      (payload.type !== 'Person' && payload.type !== 'Organization')
    ) {
      errors.type = 'Please enter a valid type: Person or Organization';
    }

    if (!payload.org_name || payload.type === 'Person') {
      if (!payload.first_name) {
        errors.first_name = 'Please enter a first name';
      }

      if (!payload.last_name) {
        errors.last_name = 'Please enter a last name';
      }
    }

    if (
      (!payload.first_name && !payload.last_name) ||
      payload.type === 'Organization'
    ) {
      if (!payload.org_name) {
        errors.org_name = 'Please enter a org name';
      }
    }

    if (
      !payload.phone ||
      !/^([0|\\+[0-9]{1,5})?([0-9]{10})$/.test(payload.phone)
    ) {
      errors.phone = 'Please enter a phone';
    }

    if (
      !payload.email ||
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        payload.email
      )
    ) {
      errors.email = 'Please enter a valid email';
    }

    if (
      payload.website.length > 0 &&
      !/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/.test(
        payload.website
      )
    ) {
      errors.website = 'Please enter a valid website url: ' + payload.website;
    }

    return errors;
  };

  const handleEdit = (e) => {
    const { name, value } = e.target;
    setErrors({});
    setDetails({ ...details, [name]: value });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setDetails({ ...data });
  };

  const handleSave = () => {
    try {
      setIsEditing(false);
      const errs = validateEntries(details);
      const errorsFound = Object.keys(errs).length > 0;
      if (errorsFound) {
        setIsEditing(true);
        setErrors(errs);
      } else {
        updateStakeholder(details);
      }
    } catch (err) {
      log.error(err);
    }
  };

  const handleEnterPress = (e) => {
    e.key === 'Enter' && handleSave();
  };

  const defaultTypeList = ['Organization', 'Person'];

  useEffect(() => {
    if (forceSave) handleSave();
    setForceSave(false);
  }, [forceSave]);

  return (
    <Grid container direction="row">
      <Grid item xs={1}>
        {data.type === 'Organization' ? (
          <img
            src={data.logo_url || './logo_192x192.png'}
            alt=""
            className={
              data.logo_url
                ? classes.logoLg
                : `${classes.logoLg}
              ${classes.grayFilter}`
            }
          />
        ) : (
          <PersonIcon className={classes.logoLg} />
        )}
      </Grid>

      <Grid item container xs={11} className={classes.pl}>
        {data.type === 'Organization' ? (
          <Grid
            container
            justifyContent="space-between"
            alignItems="flex-start"
          >
            {isEditing ? (
              <TextField
                name="org_name"
                value={details?.org_name}
                onChange={handleEdit}
                variant="standard"
                InputProps={{
                  classes: { root: classes.inputName },
                }}
                autoFocus
                error={!!errors?.org_name}
                helperText={errors?.org_name}
                onKeyDown={handleEnterPress}
              />
            ) : (
              <Typography variant="h4" className={classes.fields}>
                {details?.org_name}
              </Typography>
            )}
          </Grid>
        ) : (
          <Grid
            container
            justifyContent="flex-start"
            alignItems="flex-start"
            item
            xs={11}
          >
            <Grid className={classes.pr}>
              {isEditing ? (
                <TextField
                  name="first_name"
                  value={details?.first_name}
                  onChange={handleEdit}
                  variant="standard"
                  InputProps={{
                    classes: { root: classes.inputName },
                  }}
                  autoFocus
                  error={!!errors?.first_name}
                  helperText={errors?.first_name}
                  onKeyDown={handleEnterPress}
                />
              ) : (
                <Typography variant="h4" className={classes.fields}>
                  {details?.first_name}
                </Typography>
              )}
            </Grid>
            <Grid>
              {isEditing ? (
                <TextField
                  name="last_name"
                  value={details?.last_name}
                  onChange={handleEdit}
                  variant="standard"
                  InputProps={{
                    classes: { root: classes.inputName },
                  }}
                  autoFocus
                  error={!!errors?.last_name}
                  helperText={errors?.last_name}
                  onKeyDown={handleEnterPress}
                />
              ) : (
                <Typography variant="h4" className={classes.fields}>
                  {details?.last_name}
                </Typography>
              )}
            </Grid>
          </Grid>
        )}
        <Grid container direction="row">
          <Grid item xs={3}>
            <Grid
              container
              direction="row"
              alignItems="center"
              className={classes.rowPadding}
            >
              <IdIcon className={classes.pr} />
              <Typography className={classes.fields}>{data.id}</Typography>
            </Grid>
            <Grid
              container
              direction="row"
              alignItems="center"
              className={classes.rowPadding}
            >
              <TypeIcon className={classes.pr} />
              {isEditing ? (
                <FormControl className={classes.root}>
                  <TextField
                    data-testid="type-dropdown"
                    select
                    htmlFor="type"
                    id="type"
                    name="type"
                    value={details?.type}
                    onChange={handleEdit}
                    variant="standard"
                    InputProps={{
                      classes: { root: classes.input },
                    }}
                  >
                    {defaultTypeList.map((type) => (
                      <MenuItem data-testid="type-item" key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                </FormControl>
              ) : (
                <Typography className={classes.fields}>
                  {details?.type}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Grid item xs={3}>
            <Grid
              container
              direction="row"
              alignItems="center"
              className={classes.rowPadding}
            >
              <EmailIcon className={classes.pr} />

              {isEditing ? (
                <TextField
                  name="email"
                  value={details?.email}
                  onChange={handleEdit}
                  variant="standard"
                  InputProps={{
                    classes: { root: classes.input },
                  }}
                  error={!!errors?.email}
                  helperText={errors?.email}
                  onKeyDown={handleEnterPress}
                />
              ) : (
                <Typography className={classes.fields}>
                  {details?.email}
                </Typography>
              )}
            </Grid>
            <Grid
              container
              direction="row"
              alignItems="center"
              className={classes.rowPadding}
            >
              <PhoneIcon className={classes.pr} />
              {isEditing ? (
                <TextField
                  name="phone"
                  value={details?.phone}
                  onChange={handleEdit}
                  variant="standard"
                  InputProps={{
                    classes: { root: classes.input },
                  }}
                  error={!!errors?.phone}
                  helperText={errors?.phone}
                  onKeyDown={handleEnterPress}
                />
              ) : (
                <Typography className={classes.fields}>
                  {details?.phone}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Grid item xs={3}>
            <Grid
              container
              direction="row"
              alignItems="center"
              className={classes.rowPadding}
            >
              <WebsiteIcon className={classes.pr} />
              {isEditing ? (
                <TextField
                  name="website"
                  value={details?.website}
                  onChange={handleEdit}
                  variant="standard"
                  InputProps={{
                    classes: { root: classes.input },
                  }}
                  error={!!errors?.website}
                  helperText={errors?.website}
                  onKeyDown={handleEnterPress}
                />
              ) : (
                <Link
                  className={classes.fields}
                  variant="body1"
                  href={details?.website}
                  target="_blank"
                >
                  {details?.website}
                </Link>
              )}
            </Grid>
            <Grid
              container
              direction="row"
              alignItems="center"
              className={classes.rowPadding}
            >
              <MapIcon className={classes.pr} />
              {isEditing ? (
                <TextField
                  name="map"
                  value={details?.map}
                  onChange={handleEdit}
                  variant="standard"
                  InputProps={{
                    classes: { root: classes.input },
                  }}
                  error={!!errors?.map}
                  helperText={errors?.map}
                  onKeyDown={handleEnterPress}
                />
              ) : (
                <>
                  {details?.map && (
                    <Link
                      variant="body1"
                      className={classes.fields}
                      href={`${process.env.REACT_APP_WEBMAP_DOMAIN}/${details.map}`}
                      target="_blank"
                    >
                      {details.map}
                    </Link>
                  )}
                </>
              )}
            </Grid>
          </Grid>
          <Grid
            item
            container
            xs={3}
            alignItems="flex-start"
            direction="column"
            alignContent="flex-end"
          >
            {isEditing ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.textWhite}
                  onClick={handleSave}
                  disabled={Object.keys(errors).length > 0}
                >
                  Save
                </Button>
                <Button
                  variant="text"
                  color="secondary"
                  onClick={handleCancel}
                  className={classes.mt}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                color="primary"
                className={classes.textWhite}
                onClick={() => setIsEditing(true)}
              >
                Edit Details
              </Button>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
