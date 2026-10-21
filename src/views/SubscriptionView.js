import React, { useContext, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  Card,
  Grid,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { AppContext } from 'context/AppContext';
import { createSubscriptionSession, getSubscription } from 'api/subscription';
import { getApiErrorMessage } from 'api/apiUtils';
import { formatRenewalDate, isSubscriptionActive } from 'common/subscription';
import AppLayout from 'components/common/AppLayout';
import Spinner from 'components/common/Spinner';
import { documentTitle } from 'common/variables';

const useStyles = makeStyles((theme) => ({
  page: {
    minHeight: '100vh',
    backgroundColor: theme.palette.primary.lightVery,
  },
  content: {
    flexGrow: 1,
    minWidth: 0,
    padding: theme.spacing(10),
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(4) },
  },
  pageHeader: {
    marginBottom: theme.spacing(6),
  },
  pageTitle: {
    fontWeight: 800,
    letterSpacing: '-0.5px',
  },
  pageSubtitle: {
    marginTop: theme.spacing(1),
    color: theme.palette.text.secondary,
    maxWidth: 640,
  },
  card: {
    width: '100%',
    maxWidth: 1080,
    borderRadius: theme.spacing(3),
    border: `1px solid ${theme.palette.stats.lavenderPinocchio}`,
    overflow: 'hidden',
  },
  cardBody: {
    padding: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(6) },
  },
  sectionLabel: {
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: 700,
    fontSize: '0.7rem',
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
  },
  sectionTitle: {
    fontWeight: 700,
    marginBottom: theme.spacing(1),
  },
  helperText: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(4),
    lineHeight: 1.5,
  },
  price: {
    fontWeight: 800,
    marginBottom: theme.spacing(4),
  },
  subscribeButton: {
    alignSelf: 'flex-start',
    borderRadius: theme.spacing(2),
    textTransform: 'none',
    fontWeight: 700,
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(6),
    boxShadow: 'none',
    '&:hover': { boxShadow: 'none' },
  },
  error: {
    marginTop: theme.spacing(4),
  },
  spinnerWrap: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 360,
  },
}));

// Stripe sends the browser back here with the session id, which is readable
// before the subscription is searchable.
function sessionIdFromUrl() {
  return new URLSearchParams(window.location.search).get('session_id');
}

function SubscriptionView() {
  const classes = useStyles();
  const theme = useTheme();
  const isCompactLayout = useMediaQuery(theme.breakpoints.down('sm'), {
    noSsr: true,
  });

  const queryClient = useQueryClient();
  const { user } = useContext(AppContext);
  const organizationId = user?.policy?.organization?.id;
  const [sessionId] = useState(sessionIdFromUrl);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = `Subscription - ${documentTitle}`;
  }, []);

  const { data: subscription, isLoading, error: loadError } = useQuery({
    queryKey: ['subscription', organizationId, sessionId],
    queryFn: () => getSubscription(organizationId, sessionId),
    enabled: organizationId !== undefined && organizationId !== null,
  });

  // Stripe's search index lags, so share what the session told us with the
  // home page rather than letting it search and still see nothing.
  useEffect(() => {
    if (subscription) {
      queryClient.setQueryData(['subscription', organizationId], subscription);
    }
  }, [subscription, organizationId, queryClient]);

  async function handleSubscribe() {
    setError('');
    setIsRedirecting(true);
    try {
      const returnUrl = `${window.location.origin}/subscription`;
      const { url } = await createSubscriptionSession(
        organizationId,
        returnUrl
      );
      window.location.assign(url);
    } catch (e) {
      setError(getApiErrorMessage(e));
      setIsRedirecting(false);
    }
  }

  const isActive = isSubscriptionActive(subscription);
  const renewsOn = formatRenewalDate(subscription);

  return (
    <AppLayout className={classes.page}>
      <Grid item container direction="column" className={classes.content}>
        <Grid item className={classes.pageHeader}>
          <Typography
            variant={isCompactLayout ? 'h4' : 'h3'}
            className={classes.pageTitle}
          >
            Subscription
          </Typography>
          <Typography variant="body1" className={classes.pageSubtitle}>
            Subscribe your organization to Greenstand premium.
          </Typography>
        </Grid>

        <Grid item>
          <Card elevation={4} className={classes.card}>
            {isLoading ? (
              <Box className={classes.spinnerWrap}>
                <Spinner />
              </Box>
            ) : (
              <Box className={classes.cardBody} data-testid="subscription-card">
                <Typography className={classes.sectionLabel}>
                  Organization premium
                </Typography>

                {loadError ? (
                  <Typography
                    variant="h6"
                    className={classes.sectionTitle}
                    data-testid="subscription-load-error"
                  >
                    We could not check your subscription. Please try again.
                  </Typography>
                ) : isActive ? (
                  <>
                    <Typography
                      variant="h6"
                      className={classes.sectionTitle}
                      data-testid="subscription-active"
                    >
                      You have become our organization premium
                    </Typography>
                    <Typography variant="body2" className={classes.helperText}>
                      {renewsOn
                        ? `Your subscription renews on ${renewsOn}.`
                        : 'Your subscription is active.'}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography variant="h6" className={classes.sectionTitle}>
                      Please pay to subscribe to our organization premium
                    </Typography>
                    <Typography variant="body2" className={classes.helperText}>
                      You will be taken to Stripe to complete the payment
                      securely.
                    </Typography>

                    <Typography variant="h4" className={classes.price}>
                      $19 per month
                    </Typography>

                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubscribe}
                      disabled={isRedirecting}
                      className={classes.subscribeButton}
                      data-testid="subscription-subscribe"
                    >
                      {isRedirecting ? 'Redirecting…' : 'Subscribe'}
                    </Button>
                  </>
                )}

                {error && (
                  <Typography
                    color="error"
                    className={classes.error}
                    data-testid="subscription-error"
                  >
                    {error}
                  </Typography>
                )}
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </AppLayout>
  );
}

export default SubscriptionView;
