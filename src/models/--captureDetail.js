/*
 * The model for the CaptureDetailDialog component
 */
import * as loglevel from 'loglevel';
import api from '../api/treeTrackerApi';

const log = loglevel.getLogger('../models/captureDetail');

const STATE_EMPTY = {
  capture: null,
  species: null,
  tags: [],
};

const captureDetail = {
  state: STATE_EMPTY,
  reducers: {
    setCapture(state, capture) {
      return { ...state, capture };
    },
    setSpecies(state, species) {
      return { ...state, species };
    },
    setTags(state, tags) {
      return { ...state, tags };
    },
    reset() {
      return STATE_EMPTY;
    },
  },
  effects: {
    async getCaptureDetail(id) {
      this.reset();

      return this.getCapture(id).then((capture) => {
        this.getSpecies(capture && capture.speciesId);
        this.getTags(capture && capture.treeTags);
      });
    },
    async getCapture(id) {
      if (id == null) {
        log.debug('getCapture called with no id');
        return Promise.resolve(STATE_EMPTY.capture);
      }

      return api.getCaptureById(id).then((capture) => {
        this.setCapture(capture);
        return capture;
      });
    },
    async getSpecies(speciesId) {
      if (speciesId == null) {
        return Promise.resolve(STATE_EMPTY.speciesId);
      }

      return api.getSpeciesById(speciesId).then((species) => {
        this.setSpecies(species);
        return species;
      });
    },
    async getTags(captureTags) {
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
    },
  },
};

export default captureDetail;
