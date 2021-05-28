import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Button,
  TableRow,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Paper,
  TextField,
  FormControl,
  IconButton,
  Grid,
  Link,
  List,
  ListItem,
  Typography,
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import CloseIcon from '@material-ui/icons/Close';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
import MapIcon from '@material-ui/icons/Map';
import WebsiteIcon from '@material-ui/icons/Language';
import IdIcon from '@material-ui/icons/Money';
import TypeIcon from '@material-ui/icons/Category';
import UnlinkIcon from '@material-ui/icons/LinkOff';
import RoleIcon from '@material-ui/icons/Security';
import CalendarIcon from '@material-ui/icons/CalendarToday';
import AdminIcon from '@material-ui/icons/SupervisorAccount';
import GrowerIcon from '@material-ui/icons/NaturePeople';

const useStyles = makeStyles({
  flex: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    width: 48,
    height: 48,
    paddingRight: 12,
  },
  logoSm: {
    height: 24,
    width: 24,
  },
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
  details: {
    paddingLeft: 8,
  },
  rowPadding: {
    padding: '4px 0',
  },
  textWhite: {
    color: 'white',
  },
  closeButton: {
    position: 'absolute',
    right: 4,
    top: 4,
  },
  mt: {
    marginTop: 12,
  },
  mtLg: {
    marginTop: 16,
  },
  my: {
    margin: '16px 0',
  },
  listBox: {
    marginTop: 12,
    borderRadius: 4,
    height: 112,
    overflow: 'auto',
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 8,
    border: '1px solid rgba(0,0,0,0.1)',
  },
  tall: {
    height: 260,
  },
  listItem: {
    backgroundColor: 'white',
    marginBottom: 4,
    borderRadius: 4,
  },
  noScroll: {
    overflow: 'hidden',
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

export default function StakeholderDetail({ row, columns, child }) {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const handleUnlink = (rel, id) => {
    console.log({ rel, id });
  };

  const handleLink = (rel, id) => {
    console.log({ rel, id });
  };

  return (
    <>
      {/* Table row */}
      <TableRow hover key={row.id} onClick={openModal}>
        {columns.map((col, idx) => (
          <TableCell
            key={col.value}
            className={idx === 0 && child ? classes.pl : ''}
          >
            <div className={classes.flex}>
              {col.value === 'name' && row.logo && (
                <img src={row.logo} className={classes.logo} alt="" />
              )}
              {col.value === 'name' && !row.logo && (
                <PersonIcon className={classes.logo} />
              )}
              {row[col.value]}
            </div>
          </TableCell>
        ))}
      </TableRow>

      {/* Dialog with stakeholder details */}
      <Dialog open={open} onClose={closeModal} fullWidth={true} maxWidth={'lg'}>
        <IconButton
          aria-label="close"
          onClick={closeModal}
          className={classes.closeButton}
          color="secondary"
        >
          <CloseIcon />
        </IconButton>

        <DialogContent className={`${classes.my} ${classes.noScroll}`}>
          <DialogHeader data={row} classes={classes} />

          <Divider className={classes.my} />

          {/* Parents & Children */}
          <Grid container spacing={6} className={classes.mtLg}>
            <Grid item xs={6}>
              <Grid container justify="space-between" xs={12} direction="row">
                <Typography variant="h6">
                  Parents ({row?.parents?.length || 0})
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.textWhite}
                >
                  Link Parents
                </Button>
              </Grid>

              <List className={classes.listBox} dense>
                {row?.parents?.map((parent) => (
                  <ParentChildList
                    key={parent.id}
                    data={parent}
                    classes={classes}
                    type="parent"
                    unlink={handleUnlink}
                  />
                ))}
              </List>
            </Grid>

            <Grid item xs={6}>
              <Grid container justify="space-between" xs={12} direction="row">
                <Typography variant="h6">
                  Children ({row?.children?.length || 0})
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.textWhite}
                >
                  Link Children
                </Button>
              </Grid>

              <List className={classes.listBox} dense>
                {row?.children?.map((child) => (
                  <ParentChildList
                    key={child.id}
                    data={child}
                    classes={classes}
                    type="children"
                    unlink={handleUnlink}
                  />
                ))}
              </List>
            </Grid>
          </Grid>

          <Divider className={classes.my} />

          {/* Users & Growers */}
          <Grid container spacing={6} className={classes.mtLg}>
            <Grid item xs={6}>
              <Grid container justify="space-between" xs={12} direction="row">
                <Grid item className={classes.flex}>
                  <AdminIcon className={classes.pr} />
                  <Typography variant="h6">
                    Admin Users ({row?.users?.length || 0})
                  </Typography>
                </Grid>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.textWhite}
                >
                  Link Users
                </Button>
              </Grid>

              <List className={`${classes.listBox} ${classes.tall}`} dense>
                {row?.users?.map((user) => (
                  <UserList
                    key={user.username}
                    data={user}
                    classes={classes}
                    unlink={handleUnlink}
                  />
                ))}
              </List>
            </Grid>
            <Grid item xs={6}>
              <Grid container justify="space-between" xs={12} direction="row">
                <Grid item className={classes.flex}>
                  <GrowerIcon className={classes.pr} />
                  <Typography variant="h6">
                    Growers ({row?.growers?.length || 0})
                  </Typography>
                </Grid>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.textWhite}
                >
                  Link Children
                </Button>
              </Grid>

              <List className={`${classes.listBox} ${classes.tall}`} dense>
                {row?.growers?.map((grower) => (
                  <GrowerList
                    key={grower.id}
                    data={grower}
                    classes={classes}
                    unlink={handleUnlink}
                  />
                ))}
              </List>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}

function DialogHeader({ data, classes }) {
  const [isEditing, setIsEditing] = useState(false);
  const [details, setDetails] = useState({});

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

      <Grid container xs={11} className={classes.pl}>
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

function ParentChildList({ data, classes, type, unlink }) {
  return (
    <Paper elevation={1}>
      <ListItem className={classes.listItem}>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          direction="row"
        >
          <Grid container direction="row" alignItems="center" xs={11}>
            <Grid item xs={1}>
              <img src="./logo_192x192.png" alt="" className={classes.logoSm} />
            </Grid>
            <Grid item xs={6}>
              <Typography>{data.name}</Typography>
            </Grid>
            <Grid item xs={5} className={classes.flex}>
              <IdIcon className={classes.pr} />
              <Typography>{data.id}</Typography>
            </Grid>
          </Grid>
          <Grid item xs={1}>
            <IconButton onClick={() => unlink(type, data.id)}>
              <UnlinkIcon />
            </IconButton>
          </Grid>
        </Grid>
      </ListItem>
    </Paper>
  );
}

function UserList({ data, classes, unlink }) {
  return (
    <Paper elevation={1}>
      <ListItem className={classes.listItem}>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          direction="row"
        >
          <Grid container direction="row" alignItems="center" xs={11}>
            <Grid item xs={4}>
              <Typography>{data.username}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>{data.fullName}</Typography>
            </Grid>
            <Grid item xs={4} className={classes.flex}>
              <RoleIcon className={classes.pr} />
              <Typography>{data.roles}</Typography>
            </Grid>
          </Grid>
          <Grid item xs={1}>
            <IconButton onClick={() => unlink('user', data.id)}>
              <UnlinkIcon />
            </IconButton>
          </Grid>
        </Grid>
      </ListItem>
    </Paper>
  );
}

function GrowerList({ data, classes, unlink }) {
  return (
    <Paper elevation={1}>
      <ListItem className={classes.listItem}>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          direction="row"
        >
          <Grid container direction="row" alignItems="center" xs={11}>
            <Grid item xs={5}>
              <Typography>{data.fullName}</Typography>
            </Grid>
            <Grid item xs={3} className={classes.flex}>
              <IdIcon className={classes.pr} />
              <Typography>{data.id}</Typography>
            </Grid>
            <Grid item xs={4} className={classes.flex}>
              <CalendarIcon className={classes.pr} />
              <Typography>{data.createdAt}</Typography>
            </Grid>
          </Grid>
          <Grid item xs={1}>
            <IconButton onClick={() => unlink('grower', data.id)}>
              <UnlinkIcon />
            </IconButton>
          </Grid>
        </Grid>
      </ListItem>
    </Paper>
  );
}
