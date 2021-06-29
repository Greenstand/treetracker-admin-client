/*
 * The model for species function
 */
import * as loglevel from 'loglevel';
import api from '../api/treeTrackerApi';

const log = loglevel.getLogger('../models/species');

const species = {
  state: {
    speciesList: [],
    selectedSpecies: null,
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
    setSelectedSpecies(state, selectedSpecies) {
      return {
        ...state,
        selectedSpecies,
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
    },
    async updateSpeciesCount(speciesId, state) {
      if (speciesId == null) {
        return;
      }
      const captureCount = await api.getCaptureCountPerSpecies(speciesId);
      const speciesList = state.species.speciesList.map((species) => {
        if (species.id === speciesId) {
          return {
            ...species,
            captureCount: captureCount.count,
          };
        } else {
          return species;
        }
      });
      this.setSpeciesList(speciesList);
    },
    async createSpecies(payload, state) {
      const species = await api.createSpecies(payload);
      console.debug('created new species:', species);
      //update the list
      this.setSpeciesList([species, ...state.species.speciesList]);
      return species;
    },
    /*
     * to get the selected species id
     */
    getSpeciesId(payload, state) {
      return state.species.selectedSpecies?.id;
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
