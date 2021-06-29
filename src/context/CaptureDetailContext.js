import React, { Component, createContext } from 'react';
import * as loglevel from 'loglevel';
import api from '../api/treeTrackerApi';
// import { getOrganization } from '../api/apiUtils';
// import { session } from '../models/auth';
// import FilterModel from '../models/Filter';

const log = loglevel.getLogger('../context/CaptureDetailContext');

const CaptureDetailContext = createContext({
  capture: null,
  species: null,
  tags: [],
  getCaptureDetail: () => {},
  getCapture: () => {},
  getSpecies: () => {},
  getTags: () => {},
});

export default CaptureDetailContext;

const STATE_EMPTY = {
  capture: null,
  species: null,
  tags: [],
};

export class CaptureDetailProvider extends Component {
  // export const CaptureProvider = (props) => {
  state = {
    capture: null,
    species: null,
    tags: [],
  };

  // STATE HELPER FUNCTIONS

  setCapture(capture) {
    return { ...this.state, capture };
  }

  setSpecies(species) {
    return { ...this.state, species };
  }

  setTags(tags) {
    return { ...this.state, tags };
  }

  reset() {
    return STATE_EMPTY;
  }

  // EVENT HANDLERS

  getCaptureDetail = async (id) => {
    this.reset();

    return this.getCapture(id).then((capture) => {
      this.getSpecies(capture && capture.speciesId);
      this.getTags(capture && capture.treeTags);
    });
  };

  getCapture = async (id) => {
    if (id == null) {
      log.debug('getCapture called with no id');
      return Promise.resolve(STATE_EMPTY.capture);
    }

    return api.getCaptureById(id).then((capture) => {
      this.setCapture(capture);
      return capture;
    });
  };

  getSpecies = async (speciesId) => {
    if (speciesId == null) {
      return Promise.resolve(STATE_EMPTY.speciesId);
    }

    return api.getSpeciesById(speciesId).then((species) => {
      this.setSpecies(species);
      return species;
    });
  };

  getTags = async (captureTags) => {
    if (captureTags == null) {
      return Promise.resolve(STATE_EMPTY.tags);
    }

    Promise.all(
      captureTags.map((tag) => {
        return api.getTagById(tag.tagId);
      }),
    ).then((tags) => {
      this.setTags(tags);
      return tags;
    });
  };

  render() {
    const value = {
      capture: null,
      species: null,
      tags: [],
      getCaptureDetail: this.getCaptureDetail,
      getCapture: this.getCapture,
      getSpecies: this.getSpecies,
      getTags: this.getTags,
    };
    return (
      <CaptureDetailContext.Provider value={value}>
        {this.props.children}
      </CaptureDetailContext.Provider>
    );
  }
}
