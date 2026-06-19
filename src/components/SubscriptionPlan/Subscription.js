import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import Menu from '../common/Menu';
import { documentTitle } from '../../common/variables';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  rightBox: {
    height: '100%',
    padding: theme.spacing(8),
  },
  titleBox: {
    marginBottom: theme.spacing(4),
  },
  headlineIcon: {
    fontSize: '4rem',
    marginRight: theme.spacing(4),
    color: 'gray',
  },
  subtitle: {
    color: 'gray',
    marginTop: theme.spacing(1),
  },
  border: {
    borderBottom: '1px solid #ddd',
  },
  card: {
    maxWidth: 420,
    padding: theme.spacing(5),
  },
  planName: {
    fontWeight: 700,
  },
  priceBox: {
    display: 'flex',
    alignItems: 'baseline',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  price: {
    fontWeight: 700,
    color: theme.palette.primary.main,
  },
  pricePeriod: {
    color: 'gray',
    marginLeft: theme.spacing(1),
  },
  featureIcon: {
    minWidth: theme.spacing(5),
    color: theme.palette.primary.main,
  },
  button: {
    marginTop: theme.spacing(4),
    width: '100%',
    fontSize: '1rem',
  },
}));

const BASIC_PLAN = {
  name: 'Basic',
  price: '$19',
  period: 'per month',
  features: [
    '50,000 captures',
    '5 projects',
    'Analytics access',
    'Email support',
    'API access',
  ],
};

export default function Subscription() {
  const classes = useStyles();

  useEffect(() => {
    document.title = `Subscription - ${documentTitle}`;
  }, []);

  return (
    <Grid className={classes.container}>
      <Paper elevation={3}>
        <Menu variant="plain" active="Subscription" />
      </Paper>

      <Grid item style={{ flexGrow: 1 }}>
        <Grid container className={classes.rightBox}>
          <Grid item xs={12}>
            <Grid container className={classes.titleBox} alignItems="center">
              <CreditCardIcon className={classes.headlineIcon} />
              <Grid item>
                <Typography variant="h3">Subscription Plans</Typography>
                <Typography variant="body1" className={classes.subtitle}>
                  Choose the plan that fits your organization.
                </Typography>
              </Grid>
            </Grid>
            <Box className={classes.border} />
            <Box height={24} />

            <Paper className={classes.card} elevation={3}>
              <Typography variant="h4" className={classes.planName}>
                {BASIC_PLAN.name}
              </Typography>

              <Box className={classes.priceBox}>
                <Typography variant="h3" className={classes.price}>
                  {BASIC_PLAN.price}
                </Typography>
                <Typography variant="subtitle1" className={classes.pricePeriod}>
                  {BASIC_PLAN.period}
                </Typography>
              </Box>

              <Divider />

              <List>
                {BASIC_PLAN.features.map((feature) => (
                  <ListItem key={feature} disableGutters>
                    <ListItemIcon className={classes.featureIcon}>
                      <CheckCircleIcon />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>

              <Button
                variant="contained"
                color="primary"
                className={classes.button}
              >
                Select Plan
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
