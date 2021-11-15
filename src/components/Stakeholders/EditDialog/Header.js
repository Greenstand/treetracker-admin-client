import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, TextField, Grid, Link, Typography } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
import MapIcon from '@material-ui/icons/Map';
import WebsiteIcon from '@material-ui/icons/Language';
import IdIcon from '@material-ui/icons/Money';
import TypeIcon from '@material-ui/icons/Category';

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

export default function DialogHeader({ data }) {
  const [isEditing, setIsEditing] = useState(false);
  const [details, setDetails] = useState({});

  const classes = useStyles();

  const handleEdit = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
    console.log(details);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setDetails({});
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log(details);
  };

  return (
    <Grid container direction="row">
      <Grid item xs={1}>
        {data.logo && <img src={data.logo} alt="" className={classes.logoLg} />}
        {!data.logo && <PersonIcon className={classes.logoLg} />}
      </Grid>

      <Grid item container xs={11} className={classes.pl}>
        <Grid container justify="space-between" alignItems="flex-start">
          {isEditing ? (
            <TextField
              name="name"
              value={details?.name || data.name}
              onChange={handleEdit}
              variant="standard"
              InputProps={{
                classes: { root: classes.inputName },
              }}
              autoFocus
            />
          ) : (
            <Typography variant="h4" className={classes.fields}>
              {details?.name || data.name}
            </Typography>
          )}
        </Grid>
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
                  value={details?.type || data.type}
                  onChange={handleEdit}
                  variant="standard"
                  InputProps={{
                    classes: { root: classes.input },
                  }}
                />
              ) : (
                <Typography className={classes.fields}>
                  {details?.type || data.type}
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
                  value={details?.email || data.email}
                  onChange={handleEdit}
                  variant="standard"
                  InputProps={{
                    classes: { root: classes.input },
                  }}
                />
              ) : (
                <Typography className={classes.fields}>
                  {details?.email || data.email}
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
                  value={details?.phone || data.phone}
                  onChange={handleEdit}
                  variant="standard"
                  InputProps={{
                    classes: { root: classes.input },
                  }}
                />
              ) : (
                <Typography className={classes.fields}>
                  {details?.phone || data.phone}
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
                  value={details?.website || data.website}
                  onChange={handleEdit}
                  variant="standard"
                  InputProps={{
                    classes: { root: classes.input },
                  }}
                />
              ) : (
                <Typography className={classes.fields}>
                  <Link href={details?.website || data.website}>
                    {details?.website || data.website}
                  </Link>
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
                  value={details?.map || data.map}
                  onChange={handleEdit}
                  variant="standard"
                  InputProps={{
                    classes: { root: classes.input },
                  }}
                />
              ) : (
                <Typography className={classes.fields}>
                  <Link href={details?.map || data.map}>
                    {details?.map || data.map}
                  </Link>
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
