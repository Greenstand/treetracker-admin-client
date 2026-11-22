import React from 'react';
import { render, screen, within, fireEvent } from '@testing-library/react';
import SubscriptionUsage, { quotaSummary } from './SubscriptionUsage';
jest.mock('./shared', () => ({
  QueryState: ({ query }) =>
    query.isError ? <div>Usage unavailable</div> : null,
}));
const plans = [
  { name: 'Seed', projects: 1, captures: 5000, growers: 10 },
  { name: 'Root', projects: 5, captures: 50000, growers: 100 },
  { name: 'Base', projects: 20, captures: 250000, growers: 1000 },
  { name: 'Crown', projects: 100, captures: 1000000, growers: 5000 },
];
const base = {
  plans,
  planName: 'Seed',
  canManageBilling: true,
  onUpgrade: jest.fn(),
};
it('shows real usage and treats an exact limit as at quota, not over quota', () => {
  render(
    <SubscriptionUsage
      {...base}
      query={{ data: { projects: 1, captures: 1234, growers: 2 } }}
    />
  );
  expect(
    within(screen.getByRole('region', { name: 'Projects quota' })).getByText(
      '1 / 1'
    )
  ).toBeInTheDocument();
  expect(screen.getByText('1,234 / 5,000')).toBeInTheDocument();
  expect(screen.getByText('2 / 10')).toBeInTheDocument();
  expect(screen.getByText('At quota')).toBeInTheDocument();
  expect(screen.queryByText(/Account is over quota/)).not.toBeInTheDocument();
});
it('flags all exceeded resources and points to a higher tier that fits all usage', () => {
  const onUpgrade = jest.fn();
  render(
    <SubscriptionUsage
      {...base}
      onUpgrade={onUpgrade}
      query={{ data: { projects: 6, captures: 6000, growers: 11 } }}
    />
  );
  expect(
    screen.getByText('Account is over quota: Projects, Captures, Growers.')
  ).toBeInTheDocument();
  expect(
    within(screen.getByRole('region', { name: 'Projects quota' })).getByText(
      'Over quota · 5 above allowance'
    )
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Upgrade to Base' }));
  expect(onUpgrade).toHaveBeenCalledWith('Base');
});
it('does not manufacture zero usage or quota warnings when data or a tier is unavailable', () => {
  const { rerender } = render(
    <SubscriptionUsage {...base} query={{ isError: true }} />
  );
  expect(screen.getByText('Usage unavailable')).toBeInTheDocument();
  expect(
    screen.queryByRole('region', { name: 'Projects quota' })
  ).not.toBeInTheDocument();
  rerender(
    <SubscriptionUsage
      {...base}
      planName={null}
      query={{ data: { projects: 6, captures: 6000, growers: 11 } }}
    />
  );
  expect(screen.getByText('6 / —')).toBeInTheDocument();
  expect(screen.queryByText(/Account is over quota/)).not.toBeInTheDocument();
});
it('does not offer an insufficient upgrade when the highest tier is exceeded', () => {
  render(
    <SubscriptionUsage
      {...base}
      planName="Crown"
      query={{ data: { projects: 101, captures: 1000001, growers: 5001 } }}
    />
  );
  expect(
    screen.getByText(/Contact Greenstand about additional capacity/)
  ).toBeInTheDocument();
  expect(
    screen.queryByRole('button', { name: /Upgrade to/ })
  ).not.toBeInTheDocument();
  expect(
    quotaSummary({ projects: 2, captures: 6000, growers: 11 }, plans, 'Seed')
      .upgrade.name
  ).toBe('Root');
});
it('directs members without billing permission to their organization administrator', () => {
  render(
    <SubscriptionUsage
      {...base}
      canManageBilling={false}
      query={{ data: { projects: 2, captures: 100, growers: 2 } }}
    />
  );
  expect(
    screen.getByText('Ask your organization administrator to upgrade to Root.')
  ).toBeInTheDocument();
  expect(
    screen.queryByRole('button', { name: /Upgrade to/ })
  ).not.toBeInTheDocument();
});
