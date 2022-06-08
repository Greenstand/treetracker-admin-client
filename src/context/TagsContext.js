import React, { useState, createContext, useEffect } from 'react';
import api from '../api/treeTrackerApi';
import * as loglevel from 'loglevel';

const log = loglevel.getLogger('../context/TagsContext');

export const TagsContext = createContext({
  tagList: [],
  tagInput: [],
  loadTags: () => {},
  createTags: () => {},
  setTagInput: () => {},
});

export function TagsProvider(props) {
  const [tagList, setTagList] = useState([]);
  const [tagInput, setTagInput] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    loadTags({ signal: abortController.signal });
    return () => abortController.abort();
  }, []);

  // EVENT HANDLERS
  const loadTags = async () => {
    const { tags } = await api.getTags();
    log.debug('load tags from api:', tags?.length);
    setTagList(tags);
  };
  /*
   * check for new tags in tagInput and add them to the database
   */
  const createTags = async () => {
    const promises = tagInput.map(async (t) => {
      return api.createTag(t);
    });
    const savedTags = await Promise.all(promises);
    // Refresh the tag list
    loadTags();
    return savedTags;
  };

  const value = {
    tagList,
    tagInput,
    loadTags,
    createTags,
    setTagInput,
  };

  return (
    <TagsContext.Provider value={value}>{props.children}</TagsContext.Provider>
  );
}
