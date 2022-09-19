import React, { useState, createContext, useEffect } from 'react';
import api from '../api/treeTrackerApi';
import * as loglevel from 'loglevel';

const log = loglevel.getLogger('../context/CaptureDetailContext');

export const CaptureType = {
  RawCapture: 'raw-capture',
  Capture: 'capture',
};

export const CaptureDetailContext = createContext({
  capture: null,
  species: null,
  tags: [],
  getCaptureDetail: () => {},
  getSpecies: () => {},
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
    getSpecies(state.capture?.species_id);
  }, [state.capture]);

  // STATE HELPER FUNCTIONS

  function reset() {
    setState(STATE_EMPTY);
  }

  // EVENT HANDLERS

  const getCaptureDetail = async (captureType, id) => {
    if (id == null) {
      log.debug('getCapture called with no id');
      return Promise.resolve(STATE_EMPTY.capture);
    }

    if (id) {
      let capturePromise;
      switch (captureType) {
        case CaptureType.Capture:
          capturePromise = api.getCaptureById(id);
          break;
        case CaptureType.RawCapture:
          capturePromise = api.getRawCaptureById(id);
          break;
        default:
          capturePromise = Promise.reject(
            `Unexpected capture type ${captureType}. Should be either "capture" or "raw-capture"`
          );
          break;
      }
      return capturePromise.then((capture) => {
        setState({ ...state, capture, tags: capture.tags || [] });
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

  const value = {
    capture: state.capture,
    species: state.species,
    tags: state.tags,
    getCaptureDetail,
    getSpecies,
    reset,
  };

  return (
    <CaptureDetailContext.Provider value={value}>
      {props.children}
    </CaptureDetailContext.Provider>
  );
}
