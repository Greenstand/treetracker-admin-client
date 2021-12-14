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

  const [values, setValues] = useState({ region: '', organization: '' });

  const handleQuestionsChange = (e, question) => {
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
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allQuestions = { questionOne, questionTwo, questionThree };
    const payload = {
      author_handle: user.userName,
      subject: 'Survey',
      body: 'Survey',
      survey: {
        title: questionOne.prompt,
        questions: [],
      },
    };

    if (values.region.length > 1) {
      payload['region_id'] = values.region;
    }

    if (values.organization.length > 1) {
      payload['organization_id'] = values.organization;
    }

    Object.values(allQuestions).map((question) => {
      const { prompt, choiceOne, choiceTwo, choiceThree } = question;
      if (prompt.length > 1 && choiceOne && choiceTwo && choiceThree) {
        payload.survey.questions.push({
          prompt,
          choices: [choiceOne, choiceTwo, choiceThree],
        });
      }
    });

    try {
      if (payload.author_handle && payload.survey.title.length > 1) {
        await postMessageSend(payload);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <form className={form} onSubmit={handleSubmit}>
      {['One', 'Two', 'Three'].map((num) => (
        <div key={num}>
          <GSInputLabel text={`Survey Question ${num}`} />
          <TextField
            className={input}
            fullWidth
            label="Write your question: "
            name="prompt"
            value={`question${num}`['prompt']}
            onChange={(e) => handleQuestionsChange(e, `question${num}`)}
          />
          <GSInputLabel text={`Question ${num} Answer Options`} />
          <TextField
            className={input}
            fullWidth
            label="A: "
            name="choiceOne"
            value={`question${num}`['choiceOne']}
            onChange={(e) => handleQuestionsChange(e, `question${num}`)}
          />
          <TextField
            className={input}
            fullWidth
            label="B: "
            name="choiceTwo"
            value={`question${num}`['choiceTwo']}
            onChange={(e) => handleQuestionsChange(e, `question${num}`)}
          />
          <TextField
            className={input}
            fullWidth
            label="C: "
            name="choiceThree"
            value={`question${num}`['choiceThree']}
            onChange={(e) => handleQuestionsChange(e, `question${num}`)}
          />
        </div>
      ))}
      <div>
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
            value={values.organization}
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
            value={values.region}
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
