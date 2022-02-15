import React, { useState, useContext } from 'react';
import {
  SwipeableDrawer,
  Grid,
  Typography,
  IconButton,
  TextField,
  Button,
  Select,
  MenuItem,
  OutlinedInput,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import GSInputLabel from 'components/common/InputLabel';
import { AppContext } from 'context/AppContext';
import { MessagingContext } from 'context/MessagingContext';
const DRAWER_WIDTH = 300;

const useStyles = makeStyles((theme) => ({
  drawer: {
    background: 'light tan',
    width: DRAWER_WIDTH,
    padding: theme.spacing(3),
  },
  title: {
    width: '100%',
    display: 'flex',
    flexFlow: 'row',
  },
  formTitle: {
    color: theme.palette.primary.main,
  },
  directions: {
    color: 'grey',
    margin: '5px',
    wordWrap: 'break-word',
  },
  closeAnnounce: {
    marginLeft: 'auto',
    border: '1px solid ' + `${theme.palette.primary.main}`,
  },
  form: {
    width: DRAWER_WIDTH - 20,
    display: 'flex',
    flexDirection: 'column',
    justifycontent: 'center',
    marginBottom: '2em',
  },
  sendButton: {
    background: theme.palette.primary.main,
    color: 'white',
    marginTop: '10px',
  },
}));

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 250,
    },
  },
};

const AnnounceMessageForm = () => {
  const { orgList } = useContext(AppContext);
  const { user, regions, postMessageSend } = useContext(MessagingContext);
  const { form, sendButton } = useStyles();
  const [values, setValues] = useState({
    message: '',
    videoLink: '',
    organization: '',
    region: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
  const { message, videoLink, organization, region } = values;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      author_handle: user.userName,
      subject: 'Announce Message',
      body: values.message,
    };
    if (region) {
      payload['region_id'] = region;
    }
    if (organization) {
      payload['organization_id'] = organization;
    }
    if (payload.organization_id || payload.region_id) {
      await postMessageSend(payload);
    }
  };

  return (
    <form className={form} onSubmit={handleSubmit}>
      <GSInputLabel text={'Message'} />
      <TextField
        multiline
        rows={5}
        name="message"
        value={message}
        onChange={handleChange}
        label="Write your message here ..."
      />
      <GSInputLabel text={'Add a Video Link'} />
      <TextField
        name="videoLink"
        value={videoLink}
        onChange={handleChange}
        label="Add a video link e.g. youtube url"
      />
      <GSInputLabel
        id="select-label"
        text={'Target Audience by Organization'}
      />
      <Select
        labelId="select-label"
        id="select"
        label="Select Organization"
        name="organization"
        value={organization}
        onChange={handleChange}
        input={<OutlinedInput />}
        MenuProps={MenuProps}
      >
        {orgList.map((org, i) => (
          <MenuItem key={org.id ? org.id : i} value={org.id}>
            {org.name}
          </MenuItem>
        ))}
      </Select>
      <GSInputLabel id="select-reg-label" text={'Target Audience by Region'} />
      <Select
        labelId="select-reg-label"
        label="Regions"
        name="region"
        value={region}
        onChange={handleChange}
        input={<OutlinedInput />}
        id="select-reg"
      >
        {regions.map((region, i) => (
          <MenuItem key={region.id ? region.id : i} value={region.id}>
            {region.name}
          </MenuItem>
        ))}
      </Select>
      <Button className={sendButton} type="submit">
        Send Message
      </Button>
    </form>
  );
};

const AnnounceMessage = ({
  toggleAnnounceMessage,
  setToggleAnnounceMessage,
}) => {
  const iOS =
    typeof navigator !== 'undefined' &&
    typeof navigator.userAgent !== 'undefined' &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  const { drawer, title, formTitle, directions, closeAnnounce } = useStyles();

  return (
    <SwipeableDrawer
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      anchor={'right'}
      open={toggleAnnounceMessage}
      onOpen={() => setToggleAnnounceMessage(true)}
      onClose={() => setToggleAnnounceMessage(false)}
      classes={{ paper: drawer }}
      PaperProps={{ elevation: 6 }}
    >
      <Grid container spacing={2}>
        <Grid item className={title}>
          <Typography variant="h4" className={formTitle}>
            Announce Message
          </Typography>
          <IconButton
            color="primary"
            className={closeAnnounce}
            onClick={() => setToggleAnnounceMessage(false)}
          >
            <Close fontSize="inherit" />
          </IconButton>
        </Grid>
        <Grid item>
          <Typography variant="body1" className={directions}>
            Write a group message or notification below. Then select the target
            audience for your message. All replies will be available in you
            Messaging Inbox.
          </Typography>
        </Grid>
        <Grid item>
          <AnnounceMessageForm />
        </Grid>
      </Grid>
    </SwipeableDrawer>
  );
};

export default AnnounceMessage;
