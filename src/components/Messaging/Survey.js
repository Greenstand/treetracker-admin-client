import React, { useState, useContext } from 'react';
import {
  SwipeableDrawer,
  TextField,
  Grid,
  Typography,
  Button,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  OutlinedInput,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

import GSInputLabel from 'components/common/InputLabel';
import { MessagingContext } from 'context/MessagingContext';
import { AppContext } from 'context/AppContext';

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

const SurveyForm = () => {
  const { form, submitButton, input } = useStyles();
  const { user, regions, postMessageSend } = useContext(MessagingContext);
  const { orgList } = useContext(AppContext);
  const [survey, setSurvey] = useState({
    questionOne: '',
    choiceOne: '',
    choiceTwo: '',
    choiceThree: '',
    questionTwo: '',
    choiceFour: '',
    choiceFive: '',
    choiceSix: '',
    questionThree: '',
    choiceSeven: '',
    choiceEight: '',
    choiceNine: '',
    organization: '',
    region: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSurvey({
      ...survey,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let one = { prompt: '', choices: [] };
    let two = { prompt: '', choices: [] };
    let three = { prompt: '', choices: [] };

    // Map through survey info to match api spec
    Object.entries(survey).map(([key, val]) => {
      switch (key) {
        case 'questionOne':
          one.prompt = val;
          break;
        case 'choiceOne':
        case 'choiceTwo':
        case 'choiceThree':
          one.choices.push(val);
          break;
        case 'questionTwo':
          two.prompt = val;
          break;
        case 'choiceFour':
        case 'choiceFive':
        case 'choiceSix':
          two.choices.push(val);
          break;
        case 'questionThree':
          three.prompt = val;
          break;
        case 'choiceSeven':
        case 'choiceEight':
        case 'choiceNine':
          three.choices.push(val);
          break;
      }
    });

    const payload = {
      author_handle: user.userName,
      subject: 'Survey',
      body: 'Survey',
      survey: {
        title: survey.questionOne,
        questions: [],
      },
    };

    // check which questions were asked
    if (one.prompt.length > 1) {
      payload.survey.questions.push(one);
    }
    if (two.prompt.length > 1) {
      payload.survey.questions.push(two);
    }
    if (three.prompt.length > 1) {
      payload.survey.questions.push(three);
    }
    // set one or both region_id - organization_id
    if (survey.organization) {
      payload['organization_id'] = survey.organization;
    }
    if (survey.region) {
      payload['region_id'] = survey.region;
    }

    try {
      if (payload.author_handle && payload.survey.title.length > 1) {
        console.log(payload);
        await postMessageSend(payload);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form className={form} onSubmit={handleSubmit}>
      <div>
        <GSInputLabel text={`Survey Question One`} />
        <TextField
          className={input}
          fullWidth
          label="Write your question: "
          name="questionOne"
          value={survey.questionOne}
          onChange={handleChange}
        />
        <GSInputLabel text={`Question One Answer Options`} />
        <TextField
          className={input}
          fullWidth
          label="A: "
          name="choiceOne"
          value={survey.choiceOne}
          onChange={handleChange}
        />
        <TextField
          className={input}
          fullWidth
          label="B: "
          name="choiceTwo"
          value={survey.choiceTwo}
          onChange={handleChange}
        />
        <TextField
          className={input}
          fullWidth
          label="C: "
          name="choiceThree"
          value={survey.choiceThree}
          onChange={handleChange}
        />
      </div>
      <div>
        <GSInputLabel text={`Survey Question Two`} />
        <TextField
          className={input}
          fullWidth
          label="Write your question: "
          name="questionTwo"
          value={survey.questionTwo}
          onChange={handleChange}
        />
        <GSInputLabel text={`Question Two Answer Options`} />
        <TextField
          className={input}
          fullWidth
          label="A: "
          name="choiceFour"
          value={survey.choiceFour}
          onChange={handleChange}
        />
        <TextField
          className={input}
          fullWidth
          label="B: "
          name="choiceFive"
          value={survey.choiceFive}
          onChange={handleChange}
        />
        <TextField
          className={input}
          fullWidth
          label="C: "
          name="choiceSix"
          value={survey.choiceSix}
          onChange={handleChange}
        />
      </div>
      <div>
        <GSInputLabel text={`Survey Question Three`} />
        <TextField
          className={input}
          fullWidth
          label="Write your question: "
          name="questionThree"
          value={survey.questionThree}
          onChange={handleChange}
        />
        <GSInputLabel text={`Question Three Answer Options`} />
        <TextField
          className={input}
          fullWidth
          label="A: "
          name="choiceSeven"
          value={survey.choiceSeven}
          onChange={handleChange}
        />
        <TextField
          className={input}
          fullWidth
          label="B: "
          name="choiceEight"
          value={survey.choiceEight}
          onChange={handleChange}
        />
        <TextField
          className={input}
          fullWidth
          label="C: "
          name="choiceNine"
          value={survey.choiceNine}
          onChange={handleChange}
        />
        <FormControl fullWidth>
          <GSInputLabel
            id="select-label"
            text={'Target Audience by Organization'}
          />
          <Select
            className={input}
            labelId="select-label"
            id="select"
            input={<OutlinedInput label="Organizations" />}
            name="organization"
            value={survey.organization}
            onChange={handleChange}
          >
            {orgList.map((org, i) => (
              <MenuItem key={i} value={org.id}>
                {org.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <GSInputLabel
            id="select-reg-label"
            text={'Target Audience by Region'}
          />
          <Select
            className={input}
            labelId="select-reg-label"
            label="Regions"
            input={<OutlinedInput />}
            name="region"
            value={survey.region}
            onChange={handleChange}
            id="select-reg"
          >
            {regions.map((region) => (
              <MenuItem key={region.id} value={region.id}>
                {region.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <Button type="submit" size="large" className={submitButton}>
        Submit
      </Button>
    </form>
  );
};

const Survey = ({ toggleSurvey, setToggleSurvey }) => {
  const iOS =
    typeof navigator !== 'undefined' &&
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
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
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
              Quick Surveys
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
              Write a survey question and up to 3 answering options. Then select
              the target audience for the survey. All replies will be available
              in your Messaging Ibox.
            </Typography>
          </Grid>
          <Grid item>
            <SurveyForm />
          </Grid>
        </Grid>
      </SwipeableDrawer>
    </>
  );
};

export default Survey;
