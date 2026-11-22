import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BindingRequests from './BindingRequests';
jest.mock('../../components/OrganizationBindingRequests', () => () => (
  <p>No pending requests.</p>
));
jest.mock('./shared', () => ({
  DomainPage: ({ title, children }) => (
    <main>
      <h1>{title}</h1>
      {children}
    </main>
  ),
}));
jest.mock('./Organizations', () => ({ navigation }) => (
  <div>
    {navigation}
    <p>Stakeholder organization directory</p>
  </div>
));
it('retains request and NDM organization tabs from the existing workflow', () => {
  render(<BindingRequests />);
  expect(screen.getByText('No pending requests.')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('tab', { name: 'Organizations' }));
  expect(
    screen.getByText('Stakeholder organization directory')
  ).toBeInTheDocument();
  fireEvent.click(
    screen.getByRole('tab', {
      name: 'Users requesting to bind to an organization',
    })
  );
  expect(screen.getByText('No pending requests.')).toBeInTheDocument();
});
