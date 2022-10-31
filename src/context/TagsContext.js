import React, { useContext, useState, createContext, useEffect } from 'react';
import api from '../api/treeTrackerApi';
import { getOrganizationId } from '../api/apiUtils';
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
  const { orgList } = useContext(AppContext);
  const [tagList, setTagList] = useState([]);
  const [tagInput, setTagInput] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    loadTags({ signal: abortController.signal });
    return () => abortController.abort();
  }, []);

  // EVENT HANDLERS
  const loadTags = async () => {
    const response = await api.getTags();
    setTagList(response.tags);
  };
  /*
   * check for new tags in tagInput and add them to the database
   */

  const createTags = async (newTag) => {
    const orgId = getOrganizationId();
    const { stakeholder_uuid = null } = orgList.find((org) => org.id === orgId);
    const newTagTemplate = {
      isPublic: orgId ? false : true,
      owner_id: stakeholder_uuid,
    };
    const promises = [...tagInput, newTag].map(async (t) => {
      const existingTag = tagList.find((tag) => tag.name === t);
      if (!existingTag) {
        return api.createTag({ ...newTagTemplate, name: t });
      }
      return existingTag;
    });
    const savedTags = await Promise.all(promises);
    log.debug('savedTags:', savedTags);
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
