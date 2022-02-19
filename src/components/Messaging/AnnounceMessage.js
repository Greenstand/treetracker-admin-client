import React, { useState, useContext } from 'react';
import {
  SwipeableDrawer,
  Grid,
  Typography,
  IconButton,
  TextField,
  Button,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
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

const AnnounceMessageForm = ({ setToggleAnnounceMessage }) => {
  const { orgList } = useContext(AppContext);
  const { user, regions, postMessageSend } = useContext(MessagingContext);
  const { form, sendButton } = useStyles();
  const [organization, setOrganization] = useState({});
  const [inputValueOrg, setInputValueOrg] = useState('');
  const [region, setRegion] = useState({});
  const [inputValueRegion, setInputValueRegion] = useState('');

  const [values, setValues] = useState({
    title: '',
    message: '',
    videoLink: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      author_handle: user.userName,
      subject: 'Announce Message',
      title: values.title,
      body: values.message,
      video_link: values.videoLink,
    };
    if (region?.id) {
      payload['region_id'] = region.id;
    }
    if (organization?.id) {
      payload['organization_id'] = organization.id;
    }
    if (
      (payload.body && payload.organization_id) ||
      (payload.body && payload.region_id)
    ) {
      await postMessageSend(payload);
    }

    setValues({
      title: '',
      message: '',
      videoLink: '',
    });
    setOrganization('');
    setRegion('');
    setToggleAnnounceMessage(false);
  };

  return (
    <form className={form} onSubmit={handleSubmit}>
      <GSInputLabel text="Title" />
      <TextField
        // className={input}
        fullWidth
        label="Survey Title"
        name="title"
        value={values.title}
        onChange={handleChange}
      />
      <GSInputLabel text={'Message'} />
      <TextField
        multiline
        rows={5}
        name="message"
        value={values.message}
        onChange={handleChange}
        label="Write your message here ..."
      />
      <GSInputLabel text={'Add a Video Link'} />
      <TextField
        name="videoLink"
        value={values.videoLink}
        onChange={handleChange}
        label="Add a video link e.g. youtube url"
      />
      <GSInputLabel
        id="select-label"
        text={'Target Audience by Organization'}
      />
      <Autocomplete
        name="organization"
        selectOnFocus
        handleHomeEndKeys
        options={orgList}
        getOptionLabel={(option) => option.name || ''}
        value={organization}
        onChange={(e, val) => setOrganization(val)}
        inputValue={inputValueOrg}
        getOptionSelected={(option, value) => option.id === value.id}
        onInputChange={(e, val) => setInputValueOrg(val)}
        id="controllable-states-demo"
        freeSolo
        sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField {...params} label="Select Organization" />
        )}
      />
      <GSInputLabel id="select-reg-label" text={'Target Audience by Region'} />
      <Autocomplete
        name="region"
        selectOnFocus
        handleHomeEndKeys
        value={region}
        onChange={(e, value) => setRegion(value)}
        options={regions}
        getOptionLabel={(option) => option.name || ''}
        inputValue={inputValueRegion}
        getOptionSelected={(option, value) => option.id === value.id}
        onInputChange={(e, val) => setInputValueRegion(val)}
        id="controllable-states-demo"
        freeSolo
        sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField {...params} label="Select Organization" />
        )}
      />
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
          <AnnounceMessageForm
            setToggleAnnounceMessage={setToggleAnnounceMessage}
          />
        </Grid>
      </Grid>
    </SwipeableDrawer>
  );
};

export default AnnounceMessage;
