import React, { Component, createContext } from 'react';
import * as _ from 'lodash';
import * as loglevel from 'loglevel';
import api from '../api/treeTrackerApi';

const log = loglevel.getLogger('../context/CapturesContext');

const TagsContext = createContext({
  tagList: [],
  tagInput: [],
  getTags: () => {},
  createTags: () => {},
});

export default TagsContext;

export class TagsProvider extends Component {
  // export const CaptureProvider = (props) => {
  state = {
    tagList: [],
    tagInput: [],
  };

  // STATE HELPER FUNCTIONS

  appendToTagList(state, tags) {
    const sortedTagList = _.unionBy(state.tagList, tags, 'id').sort((a, b) =>
      a.tagName.localeCompare(b.tagName),
    );
    return {
      ...state,
      tagList: sortedTagList,
    };
  }

  setTagInput(state, tags) {
    return {
      ...state,
      tagInput: tags,
    };
  }

  // EVENT HANDLERS

  getTags = async (filter) => {
    const newTags = await api.getTags(filter);
    log.debug('load more tags from api:', newTags.length);
    this.appendToTagList(newTags);
  };
  /*
   * check for new tags in tagInput and add them to the database
   */
  createTags = (payload, state) => {
    const savedTags = state.tags.tagInput.map(async (t) => {
      return api.createTag(t);
    });

    return Promise.all(savedTags);
  };

  render() {
    const value = {
      tagList: [],
      tagInput: [],
      getTags: this.getTags,
      createTags: this.createTags,
    };
    return (
      <TagsContext.Provider value={value}>
        {this.props.children}
      </TagsContext.Provider>
    );
  }
}
