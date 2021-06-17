import React, { useState, createContext } from 'react';
import * as _ from 'lodash';
import api from '../api/treeTrackerApi';
import * as loglevel from 'loglevel';

const log = loglevel.getLogger('../context/TagsContext');

export const TagsContext = createContext({
  tagList: [],
  tagInput: [],
  getTags: () => {},
  createTags: () => {},
});

export function TagsProvider(props) {
  const [state, setState] = useState({
    tagList: [],
    tagInput: [],
  });

  // STATE HELPER FUNCTIONS

  const appendToTagList = (tags) => {
    const sortedTagList = _.unionBy(state.tagList, tags, 'id').sort((a, b) =>
      a.tagName.localeCompare(b.tagName),
    );
    setState({
      ...state,
      tagList: sortedTagList,
    });
  };

  // const setTagInput = (tags) => {
  //   setState({
  //     ...state,
  //     tagInput: tags,
  //   });
  // };

  // EVENT HANDLERS

  const getTags = async (filter) => {
    const newTags = await api.getTags(filter);
    log.debug('load more tags from api:', newTags.length);
    appendToTagList(newTags);
  };
  /*
   * check for new tags in tagInput and add them to the database
   */
  const createTags = (payload, state) => {
    const savedTags = state.tagInput.map(async (t) => {
      return api.createTag(t);
    });

    return Promise.all(savedTags);
  };

  const value = {
    tagList: state.tagList,
    tagInput: state.tagInput,
    getTags,
    createTags,
  };

  return (
    <TagsContext.Provider value={value}>{props.children}</TagsContext.Provider>
  );
}
