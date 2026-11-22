import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Verify from './Verify';
import { domainRequest } from './api';
jest.mock('./api', () => ({
  domainRequest: jest.fn(),
  errorMessage: (error) => error.message,
}));
jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ invalidateQueries: jest.fn().mockResolvedValue() }),
}));
jest.mock('./VerificationSession', () => ({
  VerificationSessionPicker: () => null,
  VerificationSessionSummary: () => null,
}));
jest.mock('./GrowerAccount', () => () => null);
jest.mock('./SessionMap', () => () => null);
jest.mock('./DomainContext', () => {
  const queue = {
      rows: [
        {
          id: 'capture',
          status: 'unprocessed',
          updated_at: '2026-11-22T00:00:00Z',
          can_review: true,
          can_approve: true,
        },
      ],
    },
    catalog = { rows: [] };
  return {
    useDomain: () => ({
      permissions: ['verify_captures'],
      organizationId: 'org',
    }),
    useDomainData: (path) => ({
      isSuccess: true,
      refetch: jest.fn().mockResolvedValue(),
      data: path === '/verification' ? queue : catalog,
    }),
  };
});
jest.mock('./shared', () => ({
  DomainPage: ({ children }) => <div>{children}</div>,
  QueryState: () => null,
  Status: () => null,
  shortId: (value) => value || '',
  dateTime: (value) => value || '',
  safeUrl: (value) => value,
}));
it('retires legacy classification and remembered choices without adding hidden tags', async () => {
  Object.defineProperty(window, 'crypto', {
    configurable: true,
    value: { randomUUID: () => 'request' },
  });
  domainRequest.mockResolvedValue({ reviewed: 1 });
  render(
    <MemoryRouter>
      <Verify />
    </MemoryRouter>
  );
  expect(screen.queryByText('Classification')).not.toBeInTheDocument();
  expect(screen.queryByLabelText('Simple leaf')).not.toBeInTheDocument();
  expect(
    screen.queryByLabelText('Remember form choices')
  ).not.toBeInTheDocument();
  fireEvent.click(screen.getByLabelText('Select capture capture'));
  fireEvent.click(screen.getByLabelText('Direct seeding'));
  fireEvent.click(screen.getByText('Submit approval'));
  await waitFor(() =>
    expect(domainRequest).toHaveBeenCalledWith(
      '/verification',
      expect.objectContaining({
        data: expect.objectContaining({
          morphology: 'direct_seeding',
          tags: [],
        }),
      })
    )
  );
  await waitFor(() => expect(screen.getByLabelText('Seedling')).toBeChecked());
});
