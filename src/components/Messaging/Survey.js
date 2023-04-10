import React, { useState, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  SwipeableDrawer,
  TextField,
  Grid,
  Typography,
  Button,
  IconButton,
  FormControl,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Close } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

import GSInputLabel from 'components/common/InputLabel';
import { MessagingContext } from 'context/MessagingContext';
import { AppContext } from 'context/AppContext';
import * as loglevel from 'loglevel';

const log = loglevel.getLogger('./Survey.js');

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
  form: {
    width: DRAWER_WIDTH - 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: '2em',
  },
  input: {
    margin: '5px',
    '& .MuiInputBase-input': {
      fontSize: 16,
      padding: '10px 12px',
    },
  },
  submitButton: {
    margin: '10px auto',
    width: DRAWER_WIDTH - 50,
    background: theme.palette.primary.main,
    color: 'white',
  },
  surveyCloseButton: {
    marginLeft: 'auto',
    border: '1px solid ' + `${theme.palette.primary.main}`,
  },
}));

const SurveyForm = ({ setToggleSurvey }) => {
  const { form, submitButton, input } = useStyles();
  const {
    setErrorMessage,
    user,
    regions,
    postBulkMessageSend,
    setThreads,
  } = useContext(MessagingContext);
  const { orgList } = useContext(AppContext);
  const [title, setTitle] = useState('');
  const [questionOne, setQuestionOne] = useState({
    prompt: '',
    choiceOne: '',
    choiceTwo: '',
    choiceThree: '',
  });
  const [questionTwo, setQuestionTwo] = useState({
    prompt: '',
    choiceOne: '',
    choiceTwo: '',
    choiceThree: '',
  });
  const [questionThree, setQuestionThree] = useState({
    prompt: '',
    choiceOne: '',
    choiceTwo: '',
    choiceThree: '',
  });
  const [errors, setErrors] = useState(null);

  // * Both values needed for organization/region autocompletes
  const [organization, setOrganization] = useState({});
  const [inputValueOrg, setInputValueOrg] = useState('');
  const [region, setRegion] = useState({});
  const [inputValueRegion, setInputValueRegion] = useState('');

  const handleChange = (e, question) => {
    setErrors(null);
    const { name, value } = e.target;
    if (question === 'questionOne') {
      setQuestionOne({
        ...questionOne,
        [name]: value,
      });
    } else if (question === 'questionTwo') {
      setQuestionTwo({
        ...questionTwo,
        [name]: value,
      });
    } else if (question === 'questionThree') {
      setQuestionThree({
        ...questionThree,
        [name]: value,
      });
    } else if (name === 'title') {
      setTitle(value);
    }
  };

  const validateSurvey = (payload) => {
    const errors = {};

    if (!payload.subject && payload.survey.title.length <= 1) {
      errors.title = 'Please enter a title for your survey';
    }

    if (payload.survey.questions.length === 0) {
      errors.questions = 'Please enter at least one question';
    } else {
      payload.survey.questions.forEach((question) => {
        if (!question.prompt) {
          errors.questions = 'Please enter a prompt for each question';
        }

        if (
          question.choices.length < 3 ||
          question.choices.some((choice) => choice === '')
        ) {
          errors.questions = 'Please enter 3 choices for each question';
        }
      });
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
    const allQuestions = { questionOne, questionTwo, questionThree };
    const payload = {
      author_handle: user.userName,
      subject: title,
      type: 'survey',
      body: 'Survey',
      survey: {
        title: title,
        questions: [],
      },
    };

    if (region?.id) {
      payload['region_id'] = region.id;
    }
    if (organization?.id) {
      payload['organization_id'] = organization.stakeholder_uuid;
    }

    Object.values(allQuestions).forEach((question) => {
      const { prompt, choiceOne, choiceTwo, choiceThree } = question;
      if (prompt.length > 1) {
        payload.survey.questions.push({
          prompt,
          choices: [choiceOne, choiceTwo, choiceThree],
        });
      }
    });

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
            `Sorry, something went wrong and we couldn't create the survey: ${res.message}`
          );
        } else {
          // reset and hide the survey drawer
          setQuestionOne({
            prompt: '',
            choiceOne: '',
            choiceTwo: '',
            choiceThree: '',
          });
          setQuestionTwo({
            prompt: '',
            choiceOne: '',
            choiceTwo: '',
            choiceThree: '',
          });
          setQuestionThree({
            prompt: '',
            choiceOne: '',
            choiceTwo: '',
            choiceThree: '',
          });
          setOrganization('');
          setRegion('');
          setTitle('');
          setToggleSurvey(false);

          const newSurvey = {
            id: uuidv4(),
            type: 'survey',
            parent_message_id: null,
            from: payload.author_handle,
            to: null,
            recipient_organization_id: payload.organization_id || null,
            recipient_region_id: payload.region_id || null,
            subject: payload.subject,
            body: null,
            composed_at: new Date().toISOString(),
            video_link: null,
            survey_response: null,
            survey: payload.survey,
          };

          log.debug('...update threads w/ new survey');

          // update state with with the new survey
          setThreads((prev) => [
            {
              username: `${newSurvey.id}`,
              messages: [newSurvey],
              avatar: '',
            },
            ...prev,
          ]);
        }
      }
    } catch (err) {
      log.error(err);
    }
  };

  return (
    <form className={form} onSubmit={handleSubmit}>
      <GSInputLabel text="Survey Title" />
      <TextField
        className={input}
        fullWidth
        label="Survey Title"
        name="title"
        value={title}
        onChange={handleChange}
        {...(errors?.title && { error: true })}
      />
      {errors?.questions && (
        <Typography
          style={{
            color: 'red',
            fontWeight: 'bold',
            margin: '20px 10px 0px',
          }}
        >
          {errors.questions}
        </Typography>
      )}
      {['One', 'Two', 'Three'].map((num) => (
        <div key={num}>
          <GSInputLabel text={`Survey Question ${num}`} />
          <TextField
            className={input}
            fullWidth
            label="Write your question: "
            name="prompt"
            value={`question${num}`['prompt']}
            onChange={(e) => handleChange(e, `question${num}`)}
            {...(errors?.questions && { error: true })}
          />
          <GSInputLabel text={`Question ${num} Answer Options`} />
          <TextField
            className={input}
            fullWidth
            label="A: "
            name="choiceOne"
            value={`question${num}`['choiceOne']}
            onChange={(e) => handleChange(e, `question${num}`)}
            {...(errors?.questions && { error: true })}
          />
          <TextField
            className={input}
            fullWidth
            label="B: "
            name="choiceTwo"
            value={`question${num}`['choiceTwo']}
            onChange={(e) => handleChange(e, `question${num}`)}
            {...(errors?.questions && { error: true })}
          />
          <TextField
            className={input}
            fullWidth
            label="C: "
            name="choiceThree"
            value={`question${num}`['choiceThree']}
            onChange={(e) => handleChange(e, `question${num}`)}
            {...(errors?.questions && { error: true })}
          />
        </div>
      ))}
      <div>
        {errors?.recipient && (
          <Typography
            style={{
              color: 'red',
              fontWeight: 'bold',
              margin: '20px 10px 0px',
            }}
          >
            {errors.recipient}
          </Typography>
        )}
        <FormControl fullWidth {...(errors?.recipient && { error: true })}>
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
              <TextField
                {...params}
                label="Select Organization"
                {...(errors?.recipient && { error: true })}
              />
            )}
          />
        </FormControl>
        <FormControl fullWidth {...(errors?.recipient && { error: true })}>
          <GSInputLabel
            id="select-reg-label"
            text={'Target Audience by Region'}
          />
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
              <TextField
                {...params}
                label="Select Region"
                {...(errors?.recipient && { error: true })}
              />
            )}
          />
        </FormControl>
      </div>
      <Button
        disabled={!!errors}
        type="submit"
        size="large"
        className={submitButton}
      >
        Submit
      </Button>
    </form>
  );
};

const Survey = ({ toggleSurvey, setToggleSurvey }) => {
  const iOS =
    typeof navigator !== 'undefined' &&
    typeof navigator.userAgent !== 'undefined' &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  const {
    title,
    formTitle,
    directions,
    drawer,
    surveyCloseButton,
  } = useStyles();

  return (
    <>
      <SwipeableDrawer
        disablebackdroptransition={!iOS ? 'true' : 'false'}
        disablediscovery={iOS ? 'true' : 'false'}
        anchor={'right'}
        open={toggleSurvey}
        onClose={() => setToggleSurvey(false)}
        onOpen={() => setToggleSurvey}
        classes={{ paper: drawer }}
        PaperProps={{ elevation: 6 }}
      >
        <Grid container spacing={2}>
          <Grid item className={title}>
            <Typography variant="h3" className={formTitle}>
              Quick Survey
            </Typography>
            <IconButton
              color="primary"
              className={surveyCloseButton}
              onClick={() => setToggleSurvey(false)}
            >
              <Close variant="inherit" />
            </IconButton>
          </Grid>
          <Grid item>
            <Typography variant="body1" className={directions}>
              Write a survey question and up to three answer options. Then
              select the target audience for the survey. All replies will be
              available in your Messaging Inbox.
            </Typography>
          </Grid>
          <Grid item>
            <SurveyForm setToggleSurvey={setToggleSurvey} />
          </Grid>
        </Grid>
      </SwipeableDrawer>
    </>
  );
};

export default Survey;
