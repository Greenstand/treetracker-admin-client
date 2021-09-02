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
  setTagInput: () => {},
});

export function TagsProvider(props) {
  const [tagList, setTagList] = useState([]);
  const [tagInput, setTagInput] = useState([]);

  // STATE HELPER FUNCTIONS

  const appendToTagList = (tags) => {
    const sortedTagList = _.unionBy(tagList, tags, 'id').sort((a, b) =>
      a.tagName.localeCompare(b.tagName),
    );
    setTagList(sortedTagList);
  };

  // EVENT HANDLERS

  const getTags = async (filter, abortController) => {
    const newTags = await api.getTags(filter, abortController);
    log.debug('load (more) tags from api:', newTags.length);
    appendToTagList(newTags);
  };
  /*
   * check for new tags in tagInput and add them to the database
   */
  const createTags = () => {
    const savedTags = tagInput.map(async (t) => {
      return api.createTag(t);
    });

    return Promise.all(savedTags);
  };

  const value = {
    tagList,
    tagInput,
    getTags,
    createTags,
    setTagInput,
  };

  return (
    <TagsContext.Provider value={value}>{props.children}</TagsContext.Provider>
  );
}
