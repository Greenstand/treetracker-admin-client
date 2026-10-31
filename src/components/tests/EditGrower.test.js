import React from 'react';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppProvider } from '../../context/AppContext';
import { GrowerContext } from '../../context/GrowerContext';
import EditGrower from '../EditGrower';
import api from '../../api/growers';

jest.mock('../../api/growers');

describe('EditGrower organization', () => {
  beforeEach(() => {
    api.getGrowerSelfies = jest.fn(() => Promise.resolve([]));
    api.updateGrower = jest.fn(() => Promise.resolve({}));
    api.getGrower = jest.fn(() => Promise.resolve({ id: 7 }));
  });

  it('saves null when "Not set" is chosen', async () => {
    render(
      <AppProvider>
        <GrowerContext.Provider
          value={{ growers: [], updateGrowers: () => {} }}
        >
          <EditGrower
            isOpen={true}
            grower={{ id: 7, firstName: 'A', lastName: 'B', organizationId: 3 }}
            onClose={() => {}}
          />
        </GrowerContext.Provider>
      </AppProvider>
    );

    const dropdown = await screen.findByTestId('org-dropdown');
    userEvent.click(within(dropdown).getByRole('button'));
    userEvent.click(within(screen.getByRole('listbox')).getByText(/not set/i));
    userEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => expect(api.updateGrower).toHaveBeenCalled());
    expect(api.updateGrower.mock.calls[0][0]).toEqual({
      id: 7,
      organizationId: null,
    });
  });
});
