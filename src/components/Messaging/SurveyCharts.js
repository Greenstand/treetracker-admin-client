import React, { useState, useEffect } from 'react';
import api from '../../api/messaging';

import { Box, Drawer, Grid, IconButton, Typography } from '@material-ui/core';
import Close from '@material-ui/icons/Close';

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

const SurveyCharts = ({ surveyId, setShowCharts }) => {
  const iOS =
    typeof navigator !== 'undefined' &&
    typeof navigator.userAgent !== 'undefined' &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);
  const { drawer } = useStyles();

  const [eachData, setEachData] = useState([]);
  const [survey, setSurvey] = useState({});

  useEffect(() => {
    api
      .getSurvey(surveyId)
      .then((survey) => {
        if (!survey) {
          throw new Error('Survey is not defined');
        }
        setSurvey(survey);
        console.warn('raw survey data:', survey);
        const chartData = [];
        for (let i = 0; i < survey.questions.length; i++) {
          const q = survey.questions[i];
          const res = survey.responses[i];
          if (res) {
            chartData.push({
              title: q.prompt,
              data: {
                labels: q.choices,
                // totals: res.datasets[0].data,
                totals: Array.from(q.choices)
                  .fill(0)
                  .map(
                    (c, i) =>
                      (res.labels.indexOf(q.choices[i]) >= 0 &&
                        res.datasets[0].data[
                          res.labels.indexOf(q.choices[i])
                        ]) ||
                      c
                  ),
              },
            });
          }
        }
        console.warn('loaded chart data:', chartData);
        setEachData(chartData);
      })
      .catch((err) => {
        console.error('err:', err);
      });
  }, [surveyId]);

  return (
    <Drawer
      disablebackdroptransition={!iOS ? 'true' : 'false'}
      disablediscovery={iOS ? 'true' : 'false'}
      anchor={'right'}
      open={true}
      onClose={() => setShowCharts(false)}
      classes={{ paper: drawer }}
      PaperProps={{ elevation: 6 }}
    >
      <Grid
        container
        style={{
          flexDirection: 'column',
          borderBottom: '1px solid black',
          marginBottom: '1rem',
        }}
      >
        <Grid item xs={12}>
          <Typography color="primary" variant="h4">
            Survey Response Data
          </Typography>
          <Typography variant="h5">{survey.title}</Typography>
        </Grid>
        <Grid item xs={12}>
          <IconButton
            onClick={() => setShowCharts(false)}
            style={{ alignSelf: 'flex-end' }}
          >
            <Close />
          </IconButton>
        </Grid>
      </Grid>
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
      <Box mt={5} />
    </Drawer>
  );
};

export default SurveyCharts;
