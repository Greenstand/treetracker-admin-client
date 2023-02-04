import React, { useContext, useState, createContext, useEffect } from 'react';
import api from '../api/treeTrackerApi';
import { AppContext } from './AppContext';

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
  const { orgId } = useContext(AppContext);
  const [tagList, setTagList] = useState([]);
  const [tagInput, setTagInput] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    loadTags(orgId, { signal: abortController.signal });
    return () => abortController.abort();
  }, [orgId]);

  // EVENT HANDLERS
  const loadTags = async (orgId, abortSignal) => {
    const response = await api.getTags(orgId, abortSignal);
    setTagList(response.tags);
  };

  /*
   * check for new tags in tagInput and add them to the database
   */
  const createTags = async () => {
    const newTagTemplate = {
      isPublic: orgId ? false : true,
      owner_id: orgId,
    };
    const promises = [...tagInput].map(async (t) => {
      const existingTag = tagList.find((tag) => tag.name === t);
      if (!existingTag) {
        return api.createTag({ ...newTagTemplate, name: t });
      }
      return existingTag;
    });
    const savedTags = await Promise.all(promises);
    log.debug('savedTags:', savedTags);
    // Refresh the tag list to see new tag
    loadTags(orgId);
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
