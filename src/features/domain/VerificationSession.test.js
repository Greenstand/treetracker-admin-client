import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import {
  VerificationSessionPicker,
  VerificationSessionSummary,
} from './VerificationSession';
import { useDomainData } from './DomainContext';
jest.mock('./DomainContext', () => ({ useDomainData: jest.fn() }));
jest.mock('./SessionMap', () => () => <div>Session map</div>);
const id = 'd5a3c8c9-ff77-5000-b1ee-eb54e680a972';
beforeEach(() =>
  useDomainData.mockReturnValue({
    isSuccess: true,
    data: {
      rows: [
        {
          id,
          grower_name: 'Test grower',
          organization_name: 'ESEA',
          capture_count: '130',
          pending: '100',
          approved: '25',
          rejected: '5',
          unknown: '0',
          duration_minutes: '90',
          area_sq_m: null,
        },
      ],
    },
  })
);
it('shows the full session UUID and whole-session review statistics', () => {
  render(<VerificationSessionSummary sessionId={id} />);
  expect(screen.getByText(id)).toBeInTheDocument();
  expect(screen.getByText('130 total · 100 pending')).toBeInTheDocument();
  expect(screen.getByText('25 approved · 5 rejected')).toBeInTheDocument();
  expect(
    screen.getByText('30 / 130 reviewed · entire session')
  ).toBeInTheDocument();
  expect(screen.getByText('Area: Unavailable')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Preview session map'));
  expect(screen.getByText('Session map')).toBeInTheDocument();
});
it('returns to all sessions without dropping other URL parameters', () => {
  const history = createMemoryHistory({
    initialEntries: ['/verify?sessionId=' + id + '&other=keep'],
  });
  render(
    <Router history={history}>
      <VerificationSessionPicker sessionId={id} />
    </Router>
  );
  fireEvent.click(screen.getByText('All sessions'));
  expect(history.location.search).toBe('?other=keep');
});
it('opens session selection from the verification screen', () => {
  const history = createMemoryHistory({ initialEntries: ['/verify'] });
  render(
    <Router history={history}>
      <VerificationSessionPicker />
    </Router>
  );
  fireEvent.click(screen.getByText('Verify a session'));
  expect(screen.getByText('Choose a session to verify')).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Search sessions'), {
    target: { value: 'Test grower' },
  });
  fireEvent.click(screen.getByRole('option'));
  expect(history.location.search).toBe('?sessionId=' + id);
});
