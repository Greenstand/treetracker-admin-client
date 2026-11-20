import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useDomain, useDomainData } from './DomainContext';
import { DomainPage, QueryState } from './shared';
import { domainRequest, errorMessage } from './api';
export default function SubscriptionPlans() {
  const domain = useDomain();
  const query = useDomainData('/subscription-plans');
  const billing = useDomainData(
    '/billing',
    {},
    Boolean(domain.organizationId && domain.canManageBilling)
  );
  const [opening, setOpening] = useState(''),
    [error, setError] = useState('');
  const choose = async (tier) => {
    setOpening(tier);
    setError('');
    try {
      const result = await domainRequest('/billing/session', {
        method: 'POST',
        data: {
          organizationId: domain.organizationId,
          tier,
          requestId: crypto.randomUUID(),
        },
      });
      const target = new URL(result.url);
      if (
        target.protocol !== 'https:' ||
        !['checkout.stripe.com', 'billing.stripe.com'].includes(target.hostname)
      ) {
        throw new Error('Stripe returned an invalid billing URL.');
      }
      window.location.assign(target.href);
    } catch (failure) {
      setError(errorMessage(failure));
      setOpening('');
    }
  };
  return (
    <DomainPage title="Subscription plans">
      <QueryState query={query} />
      {domain.organizationId && domain.canManageBilling && (
        <Box mb={4}>
          <QueryState query={billing} />
          {billing.data && (
            <Typography>
              Organization subscription · {billing.data.plan || 'No plan'} ·{' '}
              {billing.data.status}
            </Typography>
          )}
          <Button onClick={() => billing.refetch()}>
            Refresh subscription
          </Button>
        </Box>
      )}
      {error && (
        <Box mb={3}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
      <Box mb={4}>
        <Typography paragraph>
          Capture allowances apply to the organization’s total managed captures.
        </Typography>
        <Alert severity="info">
          Root and Base allowances, and Crown allowances other than captures,
          are proposed for review. Seed capacity allowances are confirmed.
          Prices come from Stripe.
        </Alert>
      </Box>
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              {[
                'Plan',
                'Price from Stripe',
                'Seats',
                'Captures',
                'Growers',
                'Projects',
                'Wallet access',
                'Subscription',
              ].map((label) => (
                <TableCell key={label}>{label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(query.data?.plans || []).map((plan) => (
              <TableRow key={plan.name}>
                <TableCell>
                  <Typography variant="subtitle1">{plan.name}</Typography>
                  {plan.proposed && (
                    <Typography variant="caption" color="textSecondary">
                      Proposed allowances
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {plan.price?.unitAmount == null
                    ? plan.priceStatus
                    : new Intl.NumberFormat(undefined, {
                        style: 'currency',
                        currency: plan.price.currency.toUpperCase(),
                      }).format(plan.price.unitAmount / 100) +
                      ' / ' +
                      (plan.price.intervalCount > 1
                        ? plan.price.intervalCount + ' '
                        : '') +
                      plan.price.interval}
                </TableCell>
                {['seats', 'captures', 'growers', 'projects'].map((key) => (
                  <TableCell key={key}>
                    {Number(plan[key]).toLocaleString()}
                  </TableCell>
                ))}
                <TableCell>
                  {plan.wallet ? 'Included' : 'Unavailable'}
                  <Typography
                    variant="caption"
                    component="div"
                    color="textSecondary"
                  >
                    Proposed wallet access
                  </Typography>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    disabled={
                      !domain.organizationId ||
                      !domain.canManageBilling ||
                      Boolean(opening)
                    }
                    onClick={() => choose(plan.name)}
                  >
                    {opening === plan.name
                      ? 'Opening Stripe…'
                      : billing.data?.plan === plan.name
                      ? 'Manage in Stripe'
                      : 'Choose ' + plan.name}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </DomainPage>
  );
}
