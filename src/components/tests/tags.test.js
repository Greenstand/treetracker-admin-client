import React from 'react';
import { act, render, cleanup, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import theme from '../common/theme';
import { ThemeProvider } from '@material-ui/core/styles';
import userEvent from '@testing-library/user-event';
import { AppProvider } from '../../context/AppContext';
import { TagsContext, TagsProvider } from '../../context/TagsContext';
import Verify from '../Verify';
import CaptureTags from '../CaptureTags';
import CaptureFilter from '../CaptureFilter';
import { ORGS, TAGS, tagsValues } from './fixtures';

import * as loglevel from 'loglevel';
const log = loglevel.getLogger('../tests/tags.test');

describe('tags', () => {
  let api;
  let component;

  beforeEach(() => {
    //mock the api
    api = require('../../api/treeTrackerApi').default;
    // VERIFY CONTEXT
    api.getCaptureImages = jest.fn(() => Promise.resolve([{ id: '1' }]));

    // TAGS CONTEXT
    api.getTags = jest.fn((filter) => {
      log.debug('mock getTags:');
      return Promise.resolve(TAGS);
    });

    tagsValues.setTagInput = jest.fn((filter) => {
      log.debug('mock setTagInput:');
      return Promise.resolve(['newly_created_tag']);
    });

    api.createTag = jest.fn((tagName) => {
      log.debug('mock createTag');
      return Promise.resolve({
        id: 2,
        tagName: 'new_tag',
        public: true,
        active: true,
      });
    });
  });

  describe('CaptureTags (alone)', () => {
    describe('renders', () => {
      beforeEach(async () => {
        render(
          <TagsProvider value={tagsValues}>
            <CaptureTags placeholder="test placeholder text" />
          </TagsProvider>,
        );

        await act(() => api.getTags());
      });

      afterEach(cleanup);

      it('renders subcomponents of capture tags', () => {
        const textbox = screen.getByRole('textbox');
        expect(textbox).toBeInTheDocument();

        const suggestion = screen.getByTestId('tag-suggestion');
        expect(suggestion).toBeInTheDocument();

        const chip = screen.getByTestId('tag-chip-input');
        expect(chip).toBeInTheDocument();
      });

      it('can enter text to search tags', () => {
        let input = screen.getByRole('textbox');
        expect(input).toBeInTheDocument();
        userEvent.type(input, 'searchTag');

        const result = screen.getByDisplayValue(/searchTag/i);
        expect(result).toBeInTheDocument();
      });

      it('shows suggestions and chips when tags are entered', () => {
        const textbox = screen.getByRole('textbox');
        expect(textbox).toBeInTheDocument();
        userEvent.type(textbox, 'testTag{enter}');
        // userEvent.click(textbox);
        // screen.logTestingPlaygroundURL();

        const suggestion = screen.getByTestId('tag-suggestion');
        expect(suggestion).toBeInTheDocument();

        const chip = screen.getByTestId('tag-chip-input');
        expect(chip).toBeInTheDocument();

        const text = screen.getByText('testTag');
        expect(text).toBeTruthy();
      });

      it('api.getTags should be called', async () => {
        console.log('mock calls -- ', api.getTags.mock.calls);
        await waitFor(() => expect(api.getTags).toHaveBeenCalledTimes(3));
        expect(api.getTags.mock.calls[1][0]).toBe('searchTag');
        // expect(api.getTags.mock.calls[2][0]).toBe('testTag');
      });
    });

    //}}}
  });

  describe('CaptureTags renders in Verify', () => {
    beforeEach(async () => {
      render(
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <AppProvider>
              <TagsContext.Provider value={tagsValues}>
                <Verify>
                  {/* <CaptureTags placeholder="test placeholder text" /> */}
                </Verify>
              </TagsContext.Provider>
            </AppProvider>
          </BrowserRouter>
        </ThemeProvider>,
      );

      await act(() => api.getTags());
    });

    afterEach(cleanup);

    describe('capture tags', () => {
      it('renders subcomponents of capture tags', () => {
        const textbox = screen.getByPlaceholderText(/Add other text tags/i);
        expect(textbox).toBeInTheDocument();

        const suggestion = screen.getByTestId('tag-suggestion');
        expect(suggestion).toBeInTheDocument();

        const chip = screen.getByTestId('tag-chip-input');
        expect(chip).toBeInTheDocument();
      });

      it('shows suggestions and chips when tags are entered', () => {
        const textbox = screen.getByPlaceholderText(/Add other text tags/i);
        expect(textbox).toBeInTheDocument();
        userEvent.type(textbox, 'testTag{enter}');
        userEvent.type(textbox, 'test');

        const suggestion = screen.getByTestId('tag-suggestion');
        expect(suggestion).toBeInTheDocument();

        const chip = screen.getByTestId('tag-chip-input');
        expect(chip).toBeInTheDocument();
        // screen.logTestingPlaygroundURL(chip);

        const item = screen.findByText('testTag');
        expect(item).toBeTruthy();

        const text = screen.getByDisplayValue('test');
        expect(text).toBeInTheDocument();
      });
    });
  });

  describe('CaptureFilter renders tags search and dropdown', () => {
    beforeEach(async () => {
      render(
        <AppProvider value={{ orgList: ORGS }}>
          <TagsProvider value={tagsValues}>
            <CaptureFilter />
          </TagsProvider>
        </AppProvider>,
      );

      await act(() => api.getTags());
    });

    afterEach(cleanup);

    describe('filter top', () => {
      it('renders subcomponents of filter top', () => {
        // const filter = screen.getByRole('button', { name: /filter/i });
        // userEvent.click(filter);

        expect(
          screen.getByLabelText(/verification status/i),
        ).toBeInTheDocument();

        expect(screen.getByLabelText(/token status/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
        expect(screen.getByLabelText('Grower ID')).toBeInTheDocument();
        expect(screen.getByLabelText(/capture id/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/device identifier/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/grower identifier/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/species/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/tag/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/organization/i)).toBeInTheDocument();

        // expect(screen.getByLabelText(/submit/i)).toBeInTheDocument();

        // expect(screen.getByLabelText(/reset/i)).toBeInTheDocument();
      });

      it('can click the dropdown to see the tag options', async () => {
        // const filter = screen.getByRole('button', { name: /filter/i });
        // userEvent.click(filter);

        const dropdown = screen.getByTestId('tag-dropdown');
        expect(dropdown).toBeInTheDocument();

        const open = screen.getByRole('button', { name: /open/i });
        userEvent.click(open);

        const optionList = await screen.findByRole('presentation');
        expect(optionList).toBeInTheDocument();

        // screen.logTestingPlaygroundURL();
        const options = await screen.findAllByRole('option');
        const tags = options.map((option) => option.textContent);
        console.log('tags', tags);

        expect(tags[0]).toBe('tag_a');
        expect(tags[1]).toBe('tag_b');
        expect(screen.getByText(/tag_a/i)).toBeInTheDocument();
        expect(screen.getByText(/tag_b/i)).toBeInTheDocument();
      });

      it('can enter a search tag', async () => {
        // const filter = screen.getByRole('button', { name: /filter/i });
        // userEvent.click(filter);

        const input = screen.getByRole('textbox', { name: /tag/i });
        expect(input).toBeInTheDocument();
        userEvent.type(input, 'something{enter}');

        expect(screen.getByDisplayValue('something')).toBeInTheDocument();
      });
    });
    //}}}
  });

  // describe('TagsContext', () => {
  //   beforeEach(async () => {
  //     render(
  //       <ThemeProvider theme={theme}>
  //         <BrowserRouter>
  //           <AppProvider>
  //             <Verify>
  //               <TagsProvider value={tagsValues}>
  //                 {(value) => value.tagList.map((tag) => <p>{tag}</p>)}
  //               </TagsProvider>
  //             </Verify>
  //           </AppProvider>
  //         </BrowserRouter>
  //       </ThemeProvider>,
  //     );

  //     await act(() => api.getTags());
  //   });

  //   describe('query all tags', () => {
  //     it('loaded all tags', () => {
  //       let taglist = screen.getByRole('listbox');
  //       expect(tagList.map((t) => t.id).sort()).toStrictEqual(
  //         TAGS.map((t) => t.id).sort(),
  //       );
  //     });

  //     it('tags are sorted alphabetically', () => {
  //       const tagNames = TagsContext.tagList.map((el) => el.tagName);
  //       expect(tagNames).toStrictEqual(['tag_a', 'tag_b']);
  //     });
  //   });

  //   describe('input: new_tag, create tags', () => {
  //     beforeEach(async () => {
  //       await act(api.setTagInput(['newly_created_tag']));
  //       await act(api.createTag());
  //     });

  //     it('api.createTag should be called with newly_created_tag', () => {
  //       console.log('createTag mock calls 1', api.createTag.mock.calls);
  //       // screen.logTestingPlaygroundURL();
  //       expect(api.createTag.mock.calls[0][0]).toBe('newly_created_tag');
  //     });
  //   });
  // });
});
