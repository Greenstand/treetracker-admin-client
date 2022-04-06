import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, TextField, Grid, Link, Typography } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
import MapIcon from '@material-ui/icons/Map';
import WebsiteIcon from '@material-ui/icons/Language';
import IdIcon from '@material-ui/icons/Money';
import TypeIcon from '@material-ui/icons/Category';
import { StakeholdersContext } from '../../../context/StakeholdersContext';

const useStyles = makeStyles({
  logoLg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
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

export default function StakeholderDialogHeader({ data }) {
  const { updateStakeholder } = useContext(StakeholdersContext);
  const [isEditing, setIsEditing] = useState(false);
  const [details, setDetails] = useState({ ...data });

  const classes = useStyles();

  const handleEdit = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setDetails({ ...data });
  };

  const handleSave = () => {
    setIsEditing(false);
    updateStakeholder(details);
  };

  return (
    <Grid container direction="row">
      <Grid item xs={1}>
        {data.type === 'Organization' ? (
          <img src={data.logo_url} alt="" className={classes.logoLg} />
        ) : (
          <PersonIcon className={classes.logoLg} />
        )}
      </Grid>

      <Grid item container xs={11} className={classes.pl}>
        {data.type === 'Organization' ? (
          <Grid container justify="space-between" alignItems="flex-start">
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
            justify="flex-start"
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
                />
              ) : (
                <Typography
                  variant="h4"
                  className={classes.fields}
                  // style={{ marginLeft: '0.3em' }}
                >
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
                <TextField
                  name="type"
                  value={details?.type}
                  onChange={handleEdit}
                  variant="standard"
                  InputProps={{
                    classes: { root: classes.input },
                  }}
                />
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
                />
              ) : (
                <Typography className={classes.fields}>
                  <Link href={details?.website}>{details?.website}</Link>
                </Typography>
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
                />
              ) : (
                <Typography className={classes.fields}>
                  <Link href={details?.map}>{details?.map}</Link>
                </Typography>
              )}
            </Grid>
          </Grid>
          <Grid
            item
            container
            xs={3}
            // justify="flex-end"
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
