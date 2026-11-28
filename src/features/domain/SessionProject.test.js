import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SessionProject from './SessionProject';
import { useDomain, useDomainData } from './DomainContext';
import { domainRequest } from './api';
jest.mock('./DomainContext', () => ({
  useDomain: jest.fn(),
  useDomainData: jest.fn(),
}));
jest.mock('./api', () => ({
  domainRequest: jest.fn(),
  errorMessage: (error) => error.message,
}));
const mockInvalidate = jest.fn();
jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: (...args) => mockInvalidate(...args),
  }),
}));
const session = {
  id: '11111111-2222-4333-8444-555555555555',
  organization_id: '22222222-2222-4333-8444-555555555555',
};
const project = {
  id: '33333333-2222-4333-8444-555555555555',
  name: 'Restoration',
  status: 'active',
};
let allocation;
beforeEach(() => {
  allocation = {
    ...session,
    project_id: project.id,
    project_name: project.name,
    allocation_event_id: null,
    organization_name: 'ESEA',
    history: [],
  };
  useDomain.mockReturnValue({
    platform: true,
    viewMode: 'admin',
    permissions: ['manage_projects'],
  });
  useDomainData.mockImplementation((path) => ({
    isSuccess: true,
    data: path === '/projects' ? { rows: [project] } : allocation,
  }));
  domainRequest.mockReset().mockResolvedValue({ id: 'audit' });
  mockInvalidate.mockReset().mockResolvedValue();
  Object.defineProperty(window, 'crypto', {
    configurable: true,
    value: { randomUUID: () => session.id },
  });
});
it('requires a reason and sends the exact current allocation when clearing a project', async () => {
  render(<SessionProject session={session} onClose={jest.fn()} />);
  fireEvent.click(screen.getByText('Clear project allocation'));
  expect(screen.getByText('Save allocation').closest('button')).toBeDisabled();
  fireEvent.change(screen.getByLabelText(/Reason for correction/), {
    target: { value: 'Tracker selected the wrong project' },
  });
  fireEvent.click(screen.getByText('Save allocation'));
  await waitFor(() =>
    expect(domainRequest).toHaveBeenCalledWith(
      '/sessions/' + session.id + '/project',
      expect.objectContaining({
        method: 'POST',
        data: expect.objectContaining({
          project_id: null,
          expected_project_id: project.id,
          expected_event_id: null,
          reason: 'Tracker selected the wrong project',
        }),
      })
    )
  );
  expect(
    await screen.findByText(
      'Session allocation saved and recorded in the trail.'
    )
  ).toBeInTheDocument();
});
it('allows verification-only staff to view the trail but disables allocation writes', () => {
  useDomain.mockReturnValue({ permissions: ['verify_captures'] });
  allocation.history = [
    {
      id: 'event',
      previous_project_name: 'Old project',
      new_project_name: 'Restoration',
      actor_name: 'Org admin',
      created_at: '2026-11-22T00:00:00Z',
      reason: 'Corrected project',
    },
  ];
  render(<SessionProject session={session} onClose={jest.fn()} />);
  expect(screen.getByText('Corrected project')).toBeInTheDocument();
  expect(
    screen.getByText('Clear project allocation').closest('button')
  ).toBeDisabled();
  expect(screen.getByText('Save allocation').closest('button')).toBeDisabled();
  expect(domainRequest).not.toHaveBeenCalled();
});

it('blocks organization administrators from changing an existing allocation', () => {
  useDomain.mockReturnValue({
    platform: false,
    permissions: ['manage_projects'],
  });
  render(<SessionProject session={session} onClose={jest.fn()} />);
  expect(screen.getByText('Save allocation').closest('button')).toBeDisabled();
});
