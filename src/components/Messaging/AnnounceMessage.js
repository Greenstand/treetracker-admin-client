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

const log = require('loglevel');
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
  const {
    setErrorMessage,
    user,
    regions,
    postBulkMessageSend,
    setThreads,
  } = useContext(MessagingContext);
  const { form, sendButton } = useStyles();
  const [organization, setOrganization] = useState({});
  const [inputValueOrg, setInputValueOrg] = useState('');
  const [region, setRegion] = useState({});
  const [inputValueRegion, setInputValueRegion] = useState('');
  const [errors, setErrors] = useState(null);

  const [values, setValues] = useState({
    title: '',
    message: '',
    videoLink: '',
  });

  const handleChange = (e) => {
    setErrors(null);
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const validateSurvey = (payload) => {
    const errors = {};

    if (!payload.subject) {
      errors.subject = 'Please enter a subject for your announcement';
    }
    console.log('body', /\w/g.test(payload.body.trim()));
    if (payload.body.length === 0 || !/\w/g.test(payload.body.trim())) {
      errors.body = 'Please enter a message';
    }

    if (
      (!payload.region_id && !payload.organization_id) ||
      (payload.region_id && payload.organization_id)
    ) {
      errors.recipient = 'Please select an organization or region';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      author_handle: user.userName,
      subject: values.title,
      type: 'announce',
      body: values.message,
    };

    if (values?.videoLink) {
      payload['video_link'] = values.videoLink;
    }

    if (region?.id) {
      payload['region_id'] = region.id;
    }

    if (organization?.id) {
      payload['organization_id'] = organization.stakeholder_uuid;
    }

    const errs = validateSurvey(payload);

    try {
      const errorsFound = Object.keys(errs).length > 0;
      if (errorsFound) {
        setErrors(errs);
      } else {
        const res = await postBulkMessageSend(payload);

        setErrorMessage('');
        if (res.error) {
          setErrorMessage(
            `Sorry, something went wrong and we couldn't create the announcement: ${res.message}`
          );
        } else {
          // close the drawer
          setValues({
            title: '',
            message: '',
            videoLink: '',
          });
          setOrganization('');
          setRegion('');
          setToggleAnnounceMessage(false);

          const newAnnouncement = {
            id: null,
            type: 'announce',
            parent_message_id: null,
            from: payload.author_handle,
            to: null,
            recipient_organization_id: payload.organization_id || null,
            recipient_region_id: payload.region_id || null,
            subject: payload.subject,
            body: payload.body,
            composed_at: new Date().toISOString(),
            video_link: null,
            survey_response: null,
            survey: null,
            bulk_message_recipients: [],
          };
          log.debug('...update threads w/ new announcement');
          // update the full set of threads
          setThreads((prev) => [
            {
              username: `${newAnnouncement.id}`,
              messages: [newAnnouncement],
              avatar: '',
            },
            ...prev,
          ]);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form className={form} onSubmit={handleSubmit}>
      {errors?.subject && (
        <Typography
          style={{ color: 'red', fontWeight: 'bold', margin: '20px 10px 0px' }}
        >
          {errors.subject}
        </Typography>
      )}
      <GSInputLabel text="Announce: Title" />
      <TextField
        fullWidth
        label="Title"
        name="title"
        value={values.title}
        onChange={handleChange}
        required
      />
      {errors?.body && (
        <Typography
          style={{ color: 'red', fontWeight: 'bold', margin: '20px 10px 0px' }}
        >
          {errors.body}
        </Typography>
      )}
      <GSInputLabel text={'Message'} />
      <TextField
        multiline
        rows={5}
        name="message"
        value={values.message}
        onChange={handleChange}
        label="Write your message here ..."
        required
      />
      <GSInputLabel text={'Add a Video Link'} />
      <TextField
        name="videoLink"
        value={values.videoLink}
        onChange={handleChange}
        label="Add a video link, e.g., YouTube URL"
      />
      {errors?.recipient && (
        <Typography
          style={{ color: 'red', fontWeight: 'bold', margin: '20px 10px 0px' }}
        >
          {errors.recipient}
        </Typography>
      )}
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
        onInputChange={(e, val) => {
          setErrors(null);
          setInputValueOrg(val);
        }}
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
        onInputChange={(e, val) => {
          setErrors(null);
          setInputValueRegion(val);
        }}
        id="controllable-states-demo"
        freeSolo
        sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField {...params} label="Select Region" />
        )}
      />
      <Button disabled={!!errors} className={sendButton} type="submit">
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
      disablebackdroptransition={!iOS ? 'true' : 'false'}
      disablediscovery={iOS ? 'true' : 'false'}
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
            audience for your message. All replies will be available in your
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
