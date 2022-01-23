import React from 'react';
import { act, render, screen, within, cleanup } from '@testing-library/react';
import theme from '../common/theme';
import { ThemeProvider } from '@material-ui/core/styles';
import { CapturesContext } from '../../context/CapturesContext';
import { SpeciesContext } from '../../context/SpeciesContext';
import { TagsContext } from '../../context/TagsContext';
import CaptureGallery from './CaptureGallery';
import {
  CAPTURES,
  capturesValues,
  tagsValues,
  speciesValues,
} from '../tests/fixtures';

jest.setTimeout(7000);
jest.mock('../../api/treeTrackerApi');

describe('Captures', () => {
  // mock captures context api methods
  const getCaptures = () => {
    return Promise.resolve(CAPTURES);
  };
  const getCaptureCount = () => {
    return Promise.resolve({ count: 4 });
  };

  describe('with default values', () => {
    beforeEach(async () => {
      render(
        <ThemeProvider theme={theme}>
          <CapturesContext.Provider value={capturesValues}>
            <SpeciesContext.Provider value={speciesValues}>
              <TagsContext.Provider value={tagsValues}>
                <CaptureGallery
                  setShowGallery={true}
                  handleShowCaptureDetail={() => {}}
                  handleShowGrowerDetail={() => {}}
                />
              </TagsContext.Provider>
            </SpeciesContext.Provider>
          </CapturesContext.Provider>
        </ThemeProvider>
      );

      await act(() => getCaptures());
      await act(() => getCaptureCount());
    });

    afterEach(cleanup);

    it('should show captures per page at top and bottom', () => {
      const pageNums = screen.getAllByRole('button', {
        name: /captures per page: 24/i,
      });
      expect(pageNums).toHaveLength(2);
    });

    it('should show page # and capture count', () => {
      const counts = Array.from(
        document.querySelectorAll('.MuiTablePagination-caption')
      );
      const arr = counts.map((count) => count.firstChild.textContent);
      expect(arr[1]).toBe('1-4 of 4');
    });

    it('renders side panel', () => {
      expect(screen.getByText(/approve/i));
      expect(screen.getByText(/reject/i));
      expect(screen.getByText(/morphology/i));
      expect(screen.getByText(/additional tags/i));
    });

    it('renders captures cards', () => {
      const cards = screen.getAllByTestId('capture-card');
      expect(cards).toHaveLength(4);
    });

    it('renders capture detail buttons for each card', () => {
      const gallery = screen.getByTestId('captures-gallery');
      const captureDetailBtns = within(gallery).getAllByRole('button', {
        name: /capture details/i,
      });
      const arr = captureDetailBtns.map((link) => link.title);
      expect(arr).toHaveLength(4);
    });

    it('renders grower detail buttons for each card', () => {
      const gallery = screen.getByTestId('captures-gallery');
      const growerDetailBtns = within(gallery).getAllByRole('button', {
        name: /grower details/i,
      });
      const arr = growerDetailBtns.map((link) => link.title);
      expect(arr).toHaveLength(4);
    });

    it('renders capture location buttons for each card', () => {
      const gallery = screen.getByTestId('captures-gallery');
      const captureDetailBtns = within(gallery).getAllByRole('link', {
        name: /capture location/i,
      });
      const arr = captureDetailBtns.map((link) => link.title);
      expect(arr).toHaveLength(4);
    });

    it('renders grower map buttons for each card', () => {
      const gallery = screen.getByTestId('captures-gallery');
      const growerDetailBtns = within(gallery).getAllByRole('link', {
        name: /grower map/i,
      });
      const arr = growerDetailBtns.map((link) => link.title);
      expect(arr).toHaveLength(4);
    });
  });
});
