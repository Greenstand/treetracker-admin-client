import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GrowerTransfer from './GrowerTransfer';
import { useDomainData } from './DomainContext';
import { domainRequest } from './api';
jest.mock('./DomainContext', () => ({ useDomainData: jest.fn() }));
jest.mock('./api', () => ({
  domainRequest: jest.fn(),
  errorMessage: (e) => e.message,
}));
jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ invalidateQueries: jest.fn().mockResolvedValue() }),
}));
const target = {
  id: '22222222-2222-4333-8444-555555555555',
  name: 'Target organization',
  active: true,
};
beforeEach(() => {
  useDomainData.mockImplementation((path) => ({
    data: path.includes('allocation-preview')
      ? {
          sessions: 2,
          rawCaptures: 3,
          processedCaptures: 2,
          version: 'preview-token',
        }
      : { rows: path === '/organizations' ? [target] : [] },
  }));
  domainRequest.mockReset().mockResolvedValue({});
  Object.defineProperty(window, 'crypto', {
    configurable: true,
    value: { randomUUID: () => target.id },
  });
});
async function selectDestination() {
  const input = screen.getByLabelText('Destination organization');
  fireEvent.change(input, { target: { value: 'Target' } });
  fireEvent.keyDown(input, { key: 'ArrowDown' });
  fireEvent.keyDown(input, { key: 'Enter' });
  fireEvent.change(screen.getByLabelText(/Reason for move/), {
    target: { value: 'Initial confirmed allocation' },
  });
}
it('keeps capture allocation explicit and submits the exact preview after confirmation', async () => {
  render(
    <GrowerTransfer
      grower={{ id: 'grower', updated_at: 'version' }}
      onClose={jest.fn()}
      onMoved={jest.fn()}
    />
  );
  await selectDestination();
  expect(
    screen.getByLabelText(
      'Confirm transfer of the previewed captures and sessions'
    )
  ).not.toBeChecked();
  fireEvent.click(
    screen.getByLabelText(
      'Confirm transfer of the previewed captures and sessions'
    )
  );
  fireEvent.click(screen.getByText('Save and allocate captures'));
  await waitFor(() =>
    expect(domainRequest).toHaveBeenCalledWith(
      '/growers/grower/organization',
      expect.objectContaining({
        data: expect.objectContaining({
          allocate_unassigned: true,
          expected_allocation: 'preview-token',
          project_id: null,
          organization_id: target.id,
        }),
      })
    )
  );
});
it('a membership-only save does not adopt historical captures', async () => {
  render(
    <GrowerTransfer
      grower={{ id: 'grower', updated_at: 'version' }}
      onClose={jest.fn()}
      onMoved={jest.fn()}
    />
  );
  await selectDestination();
  fireEvent.click(screen.getByText('Save membership only'));
  await waitFor(() =>
    expect(domainRequest).toHaveBeenCalledWith(
      '/growers/grower/organization',
      expect.objectContaining({
        data: expect.objectContaining({
          allocate_unassigned: false,
          expected_allocation: undefined,
        }),
      })
    )
  );
});

it('requires confirmation again when existing allocations are included', async () => {
  render(
    <GrowerTransfer
      grower={{ id: 'grower', updated_at: 'version' }}
      onClose={jest.fn()}
      onMoved={jest.fn()}
    />
  );
  await selectDestination();
  fireEvent.click(
    screen.getByLabelText(
      'Confirm transfer of the previewed captures and sessions'
    )
  );
  fireEvent.click(
    screen.getByLabelText(
      'Also reassign existing organization/project allocations (Greenstand admin)'
    )
  );
  expect(
    screen.getByLabelText(
      'Confirm transfer of the previewed captures and sessions'
    )
  ).not.toBeChecked();
  fireEvent.click(
    screen.getByLabelText(
      'Confirm transfer of the previewed captures and sessions'
    )
  );
  fireEvent.click(screen.getByText('Save and allocate captures'));
  await waitFor(() =>
    expect(domainRequest).toHaveBeenCalledWith(
      '/growers/grower/organization',
      expect.objectContaining({
        data: expect.objectContaining({
          reallocate_existing: true,
          allocate_unassigned: true,
        }),
      })
    )
  );
});
