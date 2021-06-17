import { BrowserRouter } from 'react-router-dom';
import {
  act,
  render,
  screen,
  within,
  findByText,
  getByText,
  getByLabel,
  getByTestId,
  queryByText,
  getAllByText,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as loglevel from 'loglevel';
// import CategoryIcon from '@material-ui/icons/Category';
import { session, hasPermission, POLICIES } from '../models/auth';
import { AppContext, AppProvider } from '../context/AppContext';
import { SpeciesContext, SpeciesProvider } from '../context/SpeciesContext';

import Species from '../components/Species';
import SpeciesMgt from '../components/SpeciesMgt';
import SpeciesTable from '../components/SpeciesTable';

describe.only('species management', () => {
  let api;
  let speciesValues;
  // can be used to test routes and permissions

  beforeEach(() => {
    api = require('../api/treeTrackerApi').default;

    api.getSpecies = jest.fn(() => {
      // log.debug('mock getSpecies:');
      return Promise.resolve([
        {
          id: 0,
          name: 'Pine',
        },
        {
          id: 1,
          name: 'apple',
        },
      ]);
    });

    api.createSpecies = jest.fn(() => {
      // log.debug('mock createSpecies');
      return Promise.resolve({
        id: 2,
        name: 'water melon',
        desc: 'fruit',
      });
    });

    api.getCaptureCountPerSpecies = jest.fn(() => {
      return Promise.resolve({ count: (Math.random() * 10) >> 0 });
    });

    speciesValues = {
      speciesList: [
        {
          id: 0,
          name: 'Pine',
        },
        {
          id: 1,
          name: 'apple',
        },
      ],
      speciesInput: '',
      speciesDesc: '',
      setSpeciesInput: () => {},
      loadSpeciesList: () => {},
      onChange: () => {},
      isNewSpecies: () => {},
      createSpecies: () => {},
      getSpeciesId: () => {},
      editSpecies: () => {},
      deleteSpecies: () => {},
      combineSpecies: () => {},
    };
  });

  describe('<SpeciesMgt /> renders page', () => {
    beforeEach(async () => {
      render(
        <BrowserRouter>
          <AppProvider>
            <SpeciesProvider value={speciesValues}>
              <SpeciesMgt />
            </SpeciesProvider>
          </AppProvider>
        </BrowserRouter>,
      );
      await act(() => api.getSpecies());
    });

    describe('it shows main page elements', () => {
      it('then shows "Add New Species" button', () => {
        expect(screen.getByText(/Add New Species/i)).toBeTruthy();
      });

      it('then shows "Combine Species" button', () => {
        expect(screen.getByText(/Combine Species/i)).toBeTruthy();
      });

      it('species list should be 2', () => {
        expect(speciesValues.speciesList).toHaveLength(2);
      });

      // shows a table with headers
      // shows navigation menu
    });

    describe('when the "Add New Species" button is clicked', () => {
      beforeEach(() => {
        userEvent.click(screen.getByText(/Add New Species/i));
      });

      it('see popup with species detail form', () => {
        expect(screen.getByText(/Species Detail/i)).toBeTruthy();
      });

      it('has inputs for name and description', () => {
        const dialog = screen.getByRole(/dialog/i);
        const item = within(dialog).getByLabelText(/name/i);
        expect(item).toBeTruthy();
      });

      it('has buttons to save and cancel', () => {
        const dialog = screen.getByRole(/dialog/i);
        expect(within(dialog).getByText(/save/i)).toBeTruthy();
      });
    });

    // when the combine species button is clicked
    //it fails if two species aren't selected
    //opens if 2+ species are selected
    //shows those species names in the popup
    //has inputs for name and description
    //has buttons to save and cancel

    describe('when creating a new species', () => {
      beforeEach(async () => {
        // await api.createSpecies({ name: 'water melon' });
        userEvent.click(screen.getByText(/Add New Species/i));
        const dialog = screen.getByRole(/dialog/i);
        const inputName = screen.getByLabelText(/name/i);
        const inputDesc = screen.getByLabelText(/description/i);
        const saveBtn = screen.getByText(/Save/i);

        userEvent.type(inputName, 'water melon');
        expect(inputName.value).toBe('water melon');

        userEvent.type(inputDesc, 'test');
        expect(inputDesc.value).toBe('test');

        userEvent.click(saveBtn);
        // wait for it... to complete action
        await act(() => api.createSpecies());
        // mock-adding the new species --- DOESN'T WORK
        speciesValues.speciesList.push({
          id: 2,
          name: 'water melon',
          desc: 'fruit',
        });
        await waitForElementToBeRemoved(dialog);
      });

      it('api.createSpecies should be called with "water melon"', () => {
        expect(api.createSpecies.mock.calls[0][0].name).toBe('water melon');
      });

      it('species list should be 3 (1 added)', () => {
        expect(speciesValues.speciesList).toHaveLength(3);
      });

      it('has 3 species', () => {
        const items = screen.getAllByTestId('species');
        const speciesNames = items.map((el) => el.textContent);
        console.log('speciesNames', speciesNames);
        expect(items).toHaveLength(3);
      });

      it('added species should show on the screen', () => {
        expect(screen.getByText('water melon')).toBeTruthy();
      });
    });
  });
});
