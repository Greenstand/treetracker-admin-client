/*
 * The model for species function
 */
import * as loglevel from 'loglevel';
import api from '../api/treeTrackerApi';

const log = loglevel.getLogger('../models/species');

const species = {
  state: {
    speciesList: [],
    speciesInput: '',
    speciesDesc: '',
  },
  reducers: {
    setSpeciesList(state, speciesList) {
      const sortedSpeciesList = speciesList
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name));
      return {
        ...state,
        speciesList: sortedSpeciesList,
      };
    },
    setSpeciesInput(state, text) {
      return {
        ...state,
        speciesInput: text,
      };
    },
    setSpeciesDesc(state, text) {
      return {
        ...state,
        speciesDesc: text,
      };
    },
  },
  effects: {
    async loadSpeciesList(forceReload = false, state) {
      if (state.species.speciesList.length && !forceReload) {
        return;
      }
      const speciesList = await api.getSpecies();
      // Initially set the species list without counts
      this.setSpeciesList(speciesList);
      log.debug('load species from api:', speciesList.length);
      const speciesListWithCount = await Promise.all(
        speciesList.map(async (species) => {
          const captureCount = await api.getCaptureCountPerSpecies(species.id);
          species.captureCount = captureCount.count;
          return species;
        }),
      );
      this.setSpeciesList(speciesListWithCount);
    },
    onChange(text) {
      console.log('on change:"', text, '"');
      this.setSpeciesInput(text);
    },
    isNewSpecies(payload, state) {
      //if there are some input, and it don't exist, then new species
      if (!state.species.speciesInput) {
        log.debug('empty species, false');
        return false;
      }
      log.debug(
        'to find species %s in list:%d',
        state.species.speciesInput,
        state.species.speciesList.length,
      );
      return state.species.speciesList.every(
        (c) =>
          c.name.toLowerCase() !== state.species.speciesInput.toLowerCase(),
      );
    },
    async createSpecies(payload, state) {
      const species = await api.createSpecies(
        payload || {
          name: state.species.speciesInput,
          desc: '',
        },
      );
      console.debug('created new species:', species);
      //update the list
      this.setSpeciesList([species, ...state.species.speciesList]);
      return species;
    },
    /*
     * to get the species id according the input
     */
    getSpeciesId(payload, state) {
      if (state.species.speciesInput) {
        return state.species.speciesList.reduce((a, c) => {
          if (a) {
            return a;
          } else if (c.name === state.species.speciesInput) {
            return c.id;
          } else {
            return a;
          }
        }, undefined);
      }
    },
    /*
     * to edit the species
     */
    async editSpecies(payload) {
      const { id, name, desc } = payload;
      const editedSpecies = await api.editSpecies(id, name, desc);
      console.debug('edit old species:', editedSpecies);
    },
    /*
     * to delete the species
     */
    async deleteSpecies(payload) {
      const { id } = payload;
      const deletedSpecies = await api.deleteSpecies(id);
      console.debug('delete outdated species:', deletedSpecies);
    },

    async combineSpecies(payload) {
      const { combine, name, desc } = payload;
      await api.combineSpecies(combine, name, desc);
    },
  },
};

export default species;
