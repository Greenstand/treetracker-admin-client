import React, { useState, createContext } from 'react';
import api from '../api/treeTrackerApi';
import * as loglevel from 'loglevel';

const log = loglevel.getLogger('../context/CaptureDetailContext');

export const CaptureDetailContext = createContext({
  capture: null,
  species: null,
  tags: [],
  getCaptureDetail: () => {},
  getCapture: () => {},
  getSpecies: () => {},
  getTags: () => {},
  reset: () => {},
});

const STATE_EMPTY = {
  capture: null,
  species: null,
  tags: [],
};

export function CaptureDetailProvider(props) {
  const [state, setState] = useState(STATE_EMPTY);

  // STATE HELPER FUNCTIONS

  function reset() {
    setState(STATE_EMPTY);
  }

  // EVENT HANDLERS

  const getCaptureDetail = async (id) => {
    reset();

    return getCapture(id).then((capture) => {
      getSpecies(capture && capture.speciesId);
      getTags(capture && capture.treeTags);
    });
  };

  const getCapture = async (id) => {
    if (id == null) {
      log.debug('getCapture called with no id');
      return Promise.resolve(STATE_EMPTY.capture);
    }

    return api.getCaptureById(id).then((capture) => {
      setState({ ...state, capture });
    });
  };

  const getSpecies = async (speciesId) => {
    if (speciesId == null) {
      return Promise.resolve(STATE_EMPTY.species);
    }

    return api.getSpeciesById(speciesId).then((species) => {
      setState({ ...state, species });
    });
  };

  const getTags = async (captureTags) => {
    if (captureTags == null) {
      return Promise.resolve(STATE_EMPTY.tags);
    }

    Promise.all(
      captureTags.map((tag) => {
        return api.getTagById(tag.tagId);
      }),
    ).then((tags) => {
      setState({ ...state, tags });
    });
  };

  const value = {
    capture: state.capture,
    species: state.species,
    tags: state.tags,
    getCaptureDetail,
    getCapture,
    getSpecies,
    getTags,
    reset,
  };

  return (
    <CaptureDetailContext.Provider value={value}>
      {props.children}
    </CaptureDetailContext.Provider>
  );
}
