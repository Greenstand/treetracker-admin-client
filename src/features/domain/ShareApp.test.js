import React from 'react';
import { render, screen } from '@testing-library/react';
import ShareApp from './ShareApp';
import { useDomain, useDomainData } from './DomainContext';
import { buildShareAppLink } from '../../common/shareLink';
jest.mock('./DomainContext', () => ({
  useDomain: jest.fn(),
  useDomainData: jest.fn(),
}));
jest.mock('./shared', () => ({
  DomainPage: ({ children }) => <div>{children}</div>,
  QueryState: () => null,
}));
jest.mock('../../views/ShareAppView', () => ({ organization }) => {
  const build = require('../../common/shareLink').buildShareAppLink;
  return <a href={build(organization)}>Organization invite</a>;
});
const id = '11111111-2222-4333-8444-555555555555';
beforeEach(() => {
  useDomain.mockReturnValue({ organizationId: id, platform: true });
  useDomainData.mockReturnValue({
    isSuccess: true,
    data: { rows: [{ id, name: '00ESEA', keycloak_organization_id: 3488 }] },
  });
});
it('uses Stakeholder organization details but retains the app-compatible numeric invite ID', () => {
  render(<ShareApp />);
  expect(
    screen.getByRole('link', { name: 'Organization invite' })
  ).toHaveAttribute('href', buildShareAppLink({ name: '00ESEA', id: 3488 }));
  expect(
    screen.getByRole('link', { name: 'Organization invite' }).href
  ).not.toContain(id);
  expect(useDomainData).toHaveBeenCalledWith('/organizations', {}, true);
});
it('waits for a platform organization selection', () => {
  useDomain.mockReturnValue({ organizationId: null, platform: true });
  render(<ShareApp />);
  expect(
    screen.getByText(/Select an organization to create/)
  ).toBeInTheDocument();
  expect(
    screen.queryByRole('link', { name: 'Organization invite' })
  ).not.toBeInTheDocument();
  expect(useDomainData).toHaveBeenCalledWith('/organizations', {}, false);
});
it('blocks invitations when the mobile mapping is missing instead of substituting a UUID', () => {
  useDomainData.mockReturnValue({
    isSuccess: true,
    data: { rows: [{ id, name: 'New org', keycloak_organization_id: null }] },
  });
  render(<ShareApp />);
  expect(
    screen.getByText(/needs its mobile-app organization mapping/)
  ).toBeInTheDocument();
  expect(
    screen.queryByRole('link', { name: 'Organization invite' })
  ).not.toBeInTheDocument();
});
