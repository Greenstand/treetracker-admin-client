import React, { useState, createContext, useEffect } from 'react';
import api from '../api/treeTrackerApi';
import * as loglevel from 'loglevel';

const log = loglevel.getLogger('../context/CaptureDetailContext');

export const CaptureDetailContext = createContext({
  capture: null,
  species: null,
  tags: [],
  getCaptureDetail: () => {},
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

  useEffect(() => {
    getSpecies(state.capture?.speciesId);
    getTags(state.capture?.treeTags);
  }, [state.capture]);

  // STATE HELPER FUNCTIONS

  function reset() {
    setState(STATE_EMPTY);
  }

  // EVENT HANDLERS

  const getCaptureDetail = async (id) => {
    if (id == null) {
      log.debug('getCapture called with no id');
      return Promise.resolve(STATE_EMPTY.capture);
    } else {
      return api.getCaptureById(id).then((capture) => {
        setState({ ...state, capture });
        return capture;
      });
    }
  };

  const getSpecies = async (speciesId) => {
    if (speciesId == null) {
      return Promise.resolve(STATE_EMPTY.species);
    }

    return api.getSpeciesById(speciesId).then((species) => {
      setState({ ...state, species });
      return species;
    });
  };

  const getTags = async (captureTags) => {
    if (captureTags == null) {
      return Promise.resolve(STATE_EMPTY.tags);
    }

    return Promise.all(
      captureTags.map((tag) => {
        return api.getTagById(tag.tagId);
      })
    ).then((tags) => {
      setState({ ...state, tags });
      return tags;
    });
  };

  const value = {
    capture: state.capture,
    species: state.species,
    tags: state.tags,
    getCaptureDetail,
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
