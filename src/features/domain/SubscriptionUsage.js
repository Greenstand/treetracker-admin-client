import React from 'react';
import {
  Box,
  Button,
  Grid,
  LinearProgress,
  Paper,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import { QueryState } from './shared';
const resources = [
  ['projects', 'Projects'],
  ['captures', 'Captures'],
  ['growers', 'Growers'],
];
const useStyles = makeStyles((theme) => ({
  over: { borderColor: theme.palette.error.main },
  overBar: { backgroundColor: theme.palette.error.main },
  atBar: { backgroundColor: theme.palette.warning.main },
}));
export function quotaSummary(usage, plans, planName) {
  const index = plans.findIndex((plan) => plan.name === planName),
    plan = plans[index];
  const over = plan
    ? resources.filter(
        ([key]) => Number.isFinite(usage[key]) && usage[key] > plan[key]
      )
    : [];
  const upgrade = over.length
    ? plans
        .slice(index + 1)
        .find((candidate) =>
          resources.every(([key]) => candidate[key] >= usage[key])
        )
    : null;
  return { plan, over, upgrade };
}
export default function SubscriptionUsage({
  query,
  plans,
  planName,
  canManageBilling,
  opening,
  onUpgrade,
}) {
  const classes = useStyles();
  if (!query.data || query.isError) return <QueryState query={query} />;
  const { plan, over, upgrade } = quotaSummary(query.data, plans, planName);
  return (
    <Box mb={4}>
      <Typography variant="h6" gutterBottom>
        Organization quota usage{plan ? ' · ' + plan.name : ''}
      </Typography>
      {plan?.proposed && (
        <Typography variant="caption" display="block">
          Based on proposed plan allowances.
        </Typography>
      )}
      <QueryState query={query} />
      {!plan && (
        <Alert severity="info">
          Usage is available below. A recognized subscription is needed to show
          quota limits.
        </Alert>
      )}
      {over.length > 0 && (
        <Box mb={2}>
          <Alert
            severity="error"
            action={
              upgrade && canManageBilling ? (
                <Button
                  color="inherit"
                  disabled={Boolean(opening)}
                  onClick={() => onUpgrade(upgrade.name)}
                >
                  {opening === upgrade.name
                    ? 'Opening Stripe…'
                    : 'Upgrade to ' + upgrade.name}
                </Button>
              ) : undefined
            }
          >
            <Typography component="span">
              Account is over quota: {over.map(([, label]) => label).join(', ')}
              .
            </Typography>
            {!upgrade && (
              <Typography variant="body2">
                Usage exceeds the available higher-plan allowances. Contact
                Greenstand about additional capacity.
              </Typography>
            )}
            {upgrade && !canManageBilling && (
              <Typography variant="body2">
                Ask your organization administrator to upgrade to {upgrade.name}
                .
              </Typography>
            )}
          </Alert>
        </Box>
      )}
      <Grid container spacing={2}>
        {resources.map(([key, label]) => {
          const used = query.data[key],
            limit = plan?.[key],
            known = Number.isFinite(used),
            isOver = known && limit != null && used > limit,
            atLimit = known && limit != null && used === limit;
          return (
            <Grid item xs={12} sm={4} key={key}>
              <Paper
                component="section"
                aria-label={label + ' quota'}
                variant="outlined"
                className={isOver ? classes.over : undefined}
              >
                <Box p={2}>
                  <Typography color="textSecondary">{label}</Typography>
                  <Typography
                    variant="h5"
                    color={isOver ? 'error' : 'textPrimary'}
                  >
                    {known ? used.toLocaleString() : 'Unavailable'} /{' '}
                    {limit == null ? '—' : Number(limit).toLocaleString()}
                  </Typography>
                  <Typography variant="caption" display="block">
                    Used / allowed
                  </Typography>
                  {known && limit > 0 && (
                    <Box mt={1}>
                      <LinearProgress
                        aria-label={label + ' quota usage'}
                        variant="determinate"
                        value={Math.min(100, (used / limit) * 100)}
                        classes={{
                          bar: isOver
                            ? classes.overBar
                            : atLimit
                            ? classes.atBar
                            : undefined,
                        }}
                      />
                    </Box>
                  )}
                  {isOver && (
                    <Typography color="error" variant="body2">
                      Over quota · {(used - limit).toLocaleString()} above
                      allowance
                    </Typography>
                  )}
                  {atLimit && <Typography variant="body2">At quota</Typography>}
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
      <Box mt={1}>
        <Typography variant="caption" color="textSecondary">
          Captures include pending and rejected captures and count once after
          approval. Growers match this organization’s Growers list. Projects
          include archived projects.
        </Typography>
      </Box>
    </Box>
  );
}
