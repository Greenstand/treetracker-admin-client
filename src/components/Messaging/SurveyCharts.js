import React, { useState, useEffect } from 'react';

import { SwipeableDrawer, Grid, Typography } from '@material-ui/core';

import { makeStyles } from '@material-ui/styles';
import { Pie } from 'react-chartjs-2';

const useStyles = makeStyles((theme) => ({
  drawer: {
    background: 'light tan',
    width: 300,
    padding: theme.spacing(3),
  },
}));
// !have to have this for charts to work
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

const SurveyCharts = ({
  messages,
  toggleSurveyCharts,
  setToggleSurveyCharts,
}) => {
  const iOS =
    typeof navigator !== 'undefined' &&
    typeof navigator.userAgent !== 'undefined' &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);
  const { drawer } = useStyles();

  const [eachData, setEachData] = useState([]);
  // !counting the survey responses while changing to react js data structure
  const filterData = () => {
    let questions = [];
    let choices = [];
    messages.map(({ survey }, i) => {
      if (i === 0) {
        survey.questions.map((q) => {
          questions.push(q.prompt);
          q.choices.map((choice) => choices.push({ [choice]: 0 }));
        });
      } else {
        choices.map((choice) => {
          survey.answers.map((a) => {
            if (choice[a] !== undefined) {
              choice[a]++;
            }
          });
        });
      }
    });
    let questionOne = {};
    let questionTwo = {};
    let questionThree = {};

    choices.map((choice, i) => {
      if (i === 0) {
        const [item] = Object.entries(choice);
        questionOne['title'] = questions[0];
        questionOne['data'] = { labels: [], totals: [] };
        questionOne['data'].labels.push(item[0]);
        questionOne['data'].totals.push(item[1]);
      } else if (i === 1 || i === 2) {
        const [item] = Object.entries(choice);
        questionOne['data'].labels.push(item[0]);
        questionOne['data'].totals.push(item[1]);
      } else if (i === 3) {
        const [item] = Object.entries(choice);
        questionTwo['title'] = questions[1];
        questionTwo['data'] = { labels: [], totals: [] };
        questionTwo['data'].labels.push(item[0]);
        questionTwo['data'].totals.push(item[1]);
      } else if (i === 4 || i === 5) {
        const [item] = Object.entries(choice);
        questionTwo['data'].labels.push(item[0]);
        questionTwo['data'].totals.push(item[1]);
      } else if (i === 6) {
        const [item] = Object.entries(choice);
        questionThree['title'] = questions[2];
        questionThree['data'] = { labels: [], totals: [] };
        questionThree['data'].labels.push(item[0]);
        questionThree['data'].totals.push(item[1]);
      } else if (i === 7 || i === 8) {
        const [item] = Object.entries(choice);
        questionThree['data'].labels.push(item[0]);
        questionThree['data'].totals.push(item[1]);
      }
    });
    if (
      Object.keys(questionOne).length &&
      Object.keys(questionTwo).length &&
      Object.keys(questionThree).length
    ) {
      setEachData([questionOne, questionTwo, questionThree]);
    } else if (
      Object.keys(questionOne).length &&
      Object.keys(questionTwo).length
    ) {
      setEachData([questionOne, questionTwo]);
    } else if (Object.keys(questionOne).length) {
      setEachData([questionOne]);
    }
  };

  useEffect(() => {
    filterData();
  }, []);

  return (
    <SwipeableDrawer
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      anchor={'right'}
      open={toggleSurveyCharts}
      onOpen={() => setToggleSurveyCharts(true)}
      onClose={() => setToggleSurveyCharts(false)}
      classes={{ paper: drawer }}
      PaperProps={{ elevation: 6 }}
    >
      <Grid container>
        {eachData &&
          eachData.map((item) => (
            <Grid item key={item.title}>
              <Typography variant="h5">{item.title}</Typography>
              <Pie
                data={{
                  labels: item.data.labels,
                  datasets: [
                    {
                      label: '# of Votes',
                      data: item.data.totals,
                      backgroundColor: [
                        'rgba(118, 187, 35, 1)',
                        '#61892f',
                        'rgba(135, 195, 46, .32)',
                      ],
                      borderColor: ['#000'],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      display: true,
                      position: 'bottom',
                    },
                  },
                }}
              />
            </Grid>
          ))}
      </Grid>
    </SwipeableDrawer>
  );
};

export default SurveyCharts;
