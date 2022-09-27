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
import { ORGS, TAGS, CAPTURE_TAGS, tagsValues } from './fixtures';

import * as loglevel from 'loglevel';
const log = loglevel.getLogger('../tests/tags.test');

describe('tags', () => {
  let api;
  let component;

  beforeEach(() => {
    //mock the api
    api = require('../../api/treeTrackerApi').default;
    // VERIFY CONTEXT
    api.getRawCaptures = jest.fn(() => Promise.resolve([{ id: '1' }]));

    // TAGS CONTEXT
    api.getTags = jest.fn((filter) => {
      // log.debug('mock getTags:');
      return Promise.resolve({ tags: TAGS });
    });

    tagsValues.setTagInput = jest.fn((filter) => {
      // log.debug('mock setTagInput:');
      return Promise.resolve(['newly_created_tag']);
    });

    api.createTag = jest.fn((tagName) => {
      // log.debug('mock createTag');
      return Promise.resolve({
        id: 2,
        name: 'new_tag',
        isPublic: true,
        status: 'active',
        owner_id: null,
      });
    });
  });

  describe('CaptureTags (alone)', () => {
    describe('renders', () => {
      beforeEach(async () => {
        render(
          <TagsProvider value={tagsValues}>
            <CaptureTags placeholder="test placeholder text" />
          </TagsProvider>
        );

        await act(async () => await api.getTags());
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

      it('can enter text to search tags', async () => {
        let input = await screen.findByRole('textbox');
        expect(input).toBeInTheDocument();
        userEvent.type(input, 'searchTag');

        const result = await screen.findByDisplayValue(/searchTag/i);
        expect(result).toBeInTheDocument();
      });

      it('shows suggestions and chips when tags are entered', async () => {
        const textbox = await screen.findByRole('textbox');
        expect(textbox).toBeInTheDocument();
        userEvent.type(textbox, 'testTag{enter}');
        // userEvent.click(textbox);
        // screen.logTestingPlaygroundURL();

        const suggestion = await screen.findByTestId('tag-suggestion');
        expect(suggestion).toBeInTheDocument();

        const chip = await screen.findByTestId('tag-chip-input');
        expect(chip).toBeInTheDocument();

        const text = await screen.findByText('testTag');
        expect(text).toBeTruthy();
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
        </ThemeProvider>
      );

      await act(async () => await api.getTags());
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

      it('shows suggestions and chips when tags are entered', async () => {
        const textbox = await screen.findByPlaceholderText(
          /Add other text tags/i
        );
        expect(textbox).toBeInTheDocument();

        userEvent.type(textbox, 'testTag{enter}');
        userEvent.type(textbox, 'test');

        const suggestion = await screen.findByTestId('tag-suggestion');
        expect(suggestion).toBeInTheDocument();

        const chip = await screen.findByTestId('tag-chip-input');
        expect(chip).toBeInTheDocument();

        // const sidepanel = await screen.findByTestId('capture-tags');
        // screen.logTestingPlaygroundURL(sidepanel);

        // const item = await screen.findByText('testTag');
        // expect(item).toBeTruthy();

        // const text = await screen.findByDisplayValue('test');
        // expect(text).toBeInTheDocument();
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
        </AppProvider>
      );

      await act(async () => await api.getTags());
    });

    afterEach(cleanup);

    describe('filter top', () => {
      it('renders subcomponents of filter top', () => {
        expect(screen.getByLabelText(/token status/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
        expect(screen.getByLabelText('Grower Account ID')).toBeInTheDocument();
        expect(screen.getByLabelText(/capture id/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/device identifier/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/wallet/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/species/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/tag/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/organization/i)).toBeInTheDocument();

        expect(
          screen.getByRole('button', { name: /apply/i })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: /reset/i })
        ).toBeInTheDocument();
      });

      it('can click the dropdown to see the tag options', async () => {
        // const filter = screen.getByRole('button', { name: /filter/i });
        // userEvent.click(filter);

        const dropdown = await screen.findByTestId('tag-dropdown');
        expect(dropdown).toBeInTheDocument();

        const open = await screen.findByRole('button', { name: /open/i });
        userEvent.click(open);

        const optionList = await screen.findByRole('presentation');
        expect(optionList).toBeInTheDocument();

        // screen.logTestingPlaygroundURL();
        const options = await screen.findAllByRole('option');
        const tags = options.map((option) => option.textContent);
        log.debug('tags', tags);
        await waitFor(() => {
          expect(tags[0]).toBe('tag_a');
          expect(tags[1]).toBe('tag_b');
          expect(screen.getByText(/tag_a/i)).toBeInTheDocument();
          expect(screen.getByText(/tag_b/i)).toBeInTheDocument();
        });
      });

      it('can enter a search tag', async () => {
        // const filter = screen.getByRole('button', { name: /filter/i });
        // userEvent.click(filter);

        const input = await screen.findByRole('textbox', { name: /tag/i });
        expect(input).toBeInTheDocument();
        userEvent.type(input, 'something{enter}');

        expect(
          await screen.findByDisplayValue('something')
        ).toBeInTheDocument();
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
  //       const tagName = TagsContext.tagList.map((el) => el.name);
  //       expect(tagName).toStrictEqual(['tag_a', 'tag_b']);
  //     });
  //   });

  //   describe('input: new_tag, create tags', () => {
  //     beforeEach(async () => {
  //       await act(api.setTagInput(['newly_created_tag']));
  //       await act(api.createTag());
  //     });

  //     it('api.createTag should be called with newly_created_tag', () => {
  //       log.debug('createTag mock calls 1', api.createTag.mock.calls);
  //       // screen.logTestingPlaygroundURL();
  //       expect(api.createTag.mock.calls[0][0]).toBe('newly_created_tag');
  //     });
  //   });
  // });
});
