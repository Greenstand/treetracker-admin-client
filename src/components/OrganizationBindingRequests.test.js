import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import OrganizationBindingRequests from './OrganizationBindingRequests';
import { getPendingBindings } from '../api/organizationBinding';

jest.mock('../api/organizationBinding', () => ({
  getPendingBindings: jest.fn(),
  approveBinding: jest.fn(),
  rejectBinding: jest.fn(),
}));

describe('OrganizationBindingRequests', () => {
  function renderRequests() {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    return render(
      <QueryClientProvider client={queryClient}>
        <OrganizationBindingRequests
          organizations={[{ id: 7, name: 'test-org-01' }]}
        />
      </QueryClientProvider>
    );
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('says there is nothing pending when the list is empty', async () => {
    getPendingBindings.mockResolvedValue({ total: 0, requests: [] });

    renderRequests();

    expect(await screen.findByText('No pending requests.')).toBeInTheDocument();
  });

  it('shows an error instead of an empty list when the request fails', async () => {
    getPendingBindings.mockRejectedValue(new Error('Network error'));

    renderRequests();

    expect(await screen.findByRole('alert')).toHaveTextContent('Network error');
    expect(screen.queryByText('No pending requests.')).not.toBeInTheDocument();
  });

  it('names the organization of each request', async () => {
    getPendingBindings.mockResolvedValue({
      total: 1,
      requests: [
        {
          userId: 'u-1',
          username: 'joiner',
          organizationId: 7,
          status: 'pending',
        },
      ],
    });

    renderRequests();

    expect(await screen.findByText('joiner')).toBeInTheDocument();
    expect(screen.getByText('test-org-01')).toBeInTheDocument();
  });
});
