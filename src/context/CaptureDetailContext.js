import React, { useState, createContext, useEffect } from 'react';
import { handleResponse, handleError, getOrganization } from '../api/apiUtils';
import { session } from '../models/auth';
import api from '../api/treeTrackerApi';
import * as loglevel from 'loglevel';

const log = loglevel.getLogger('../context/CaptureDetailContext');

const TREETRACKER_API = `${process.env.REACT_APP_TREETRACKER_API_ROOT}`;
const API_ROOT = process.env.REACT_APP_API_ROOT;

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

  const getCaptureDetail = async (capture) => {
    log.debug('getCaptureDetail:', {
      reference_id: capture.reference_id,
      id: capture.id,
    });

    // getOrganization gets the wrong org when this is in the global context
    const BASE_URL = {
      LEGACY: `${API_ROOT}/api/${getOrganization()}trees/`,
      CAPTURE_MATCH: `${TREETRACKER_API}/captures?reference_id=`,
    };

    try {
      if (!capture?.id) {
        log.debug('getCapture called with no reference_id');
      } else {
        // NOTE: The reference_id in the new api === the id in the old api
        const query = `${
          BASE_URL[capture.reference_id ? 'CAPTURE_MATCH' : 'LEGACY']
        }${capture.reference_id || capture.id}`;

        fetch(query, {
          headers: {
            Authorization: session.token,
          },
        })
          .then(handleResponse)
          .then((data) => {
            if (data.captures) {
              // new treetracker-api
              setState({ ...state, capture: data.captures[0] });
            } else {
              // legacy api
              setState({ ...state, data });
            }
          });
      }
    } catch (error) {
      handleError(error);
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
