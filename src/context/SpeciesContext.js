import React, { Component, createContext } from 'react';
import * as loglevel from 'loglevel';
import api from '../api/treeTrackerApi';

const log = loglevel.getLogger('../context/SpeciesContext');

const SpeciesContext = createContext({
  speciesList: [],
  speciesInput: '',
  speciesDesc: '',
  loadSpeciesList: () => {},
  onChange: () => {},
  isNewSpecies: () => {},
  createSpecies: () => {},
  getSpeciesId: () => {},
  editSpecies: () => {},
  deleteSpecies: () => {},
  combineSpecies: () => {},
  set: () => {},
});

export default SpeciesContext;

export class SpeciesProvider extends Component {
  state = {
    speciesList: [],
    speciesInput: '',
    speciesDesc: '',
  };

  // STATE HELPER FUNCTIONS

  setSpeciesList(speciesList) {
    const sortedSpeciesList = speciesList
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name));
    this.setState({
      ...this.state,
      speciesList: sortedSpeciesList,
    });
  }

  setSpeciesInput(text) {
    this.setState({
      ...this.state,
      speciesInput: text,
    });
  }

  setSpeciesDesc(text) {
    this.setState({
      ...this.state,
      speciesDesc: text,
    });
  }

  // ALLOW STATE TO BE SET FROM CHILD COMPONENT

  set = (obj) => {
    this.setState({
      ...this.state,
      ...obj,
    });
  };

  // EVENT HANDLERS

  loadSpeciesList = async () => {
    const speciesList = await api.getSpecies();
    log.debug('load species from api:', this.state.speciesList.length);
    const speciesListWithCount = await Promise.all(
      speciesList.map(async (species) => {
        let captureCount = await api.getCaptureCountPerSpecies(species.id);
        species.captureCount = captureCount.count;
        return species;
      }),
    );
    this.setSpeciesList(speciesListWithCount);
  };

  onChange = async (text) => {
    console.log('on change:"', text, '"');
    this.setSpeciesInput(text);
  };

  isNewSpecies = () => {
    //if there are some input, and it don't exist, then new species
    if (!this.state.speciesInput) {
      log.debug('empty species, false');
      return false;
    }
    this.log.debug(
      'to find species %s in list:%d',
      this.state.speciesInput,
      this.state.speciesList.length,
    );
    return this.state.speciesList.every(
      (c) => c.name.toLowerCase() !== this.state.speciesInput.toLowerCase(),
    );
  };

  createSpecies = async (payload) => {
    const species = await api.createSpecies(
      payload || {
        name: this.state.speciesInput,
        desc: '',
      },
    );
    console.debug('created new species:', species);
    //update the list
    console.log('createSpecies THIS', this);
    this.setSpeciesList([species, ...this.state.speciesList]);
    // return species;
  };

  //to get the species id according the current speciesInput
  getSpeciesId = () => {
    if (this.state.speciesInput) {
      return this.state.speciesList.reduce((a, c) => {
        if (a) {
          return a;
        } else if (c.name === this.state.speciesInput) {
          return c.id;
        } else {
          return a;
        }
      }, undefined);
    }
  };

  editSpecies = async (payload) => {
    const { id, name, desc } = payload;
    const editedSpecies = await api.editSpecies(id, name, desc);
    console.debug('edit old species:', editedSpecies);
  };

  deleteSpecies = async (payload) => {
    const { id } = payload;
    const deletedSpecies = await api.deleteSpecies(id);
    console.debug('delete outdated species:', id, deletedSpecies);
  };

  combineSpecies = async (payload) => {
    const { combine, name, desc } = payload;
    await api.combineSpecies(combine, name, desc);
  };

  render() {
    const value = {
      speciesList: this.state.speciesList,
      speciesInput: this.state.speciesInput,
      speciesDesc: this.state.speciesDesc,
      loadSpeciesList: this.loadSpeciesList,
      onChange: this.onChange,
      isNewSpecies: this.isNewSpecies,
      createSpecies: this.createSpecies,
      getSpeciesId: this.getSpeciesId,
      editSpecies: this.editSpecies,
      deleteSpecies: this.deleteSpecies,
      combineSpecies: this.combineSpecies,
      set: this.set,
    };
    return (
      <SpeciesContext.Provider value={value}>
        {this.props.children}
      </SpeciesContext.Provider>
    );
  }
}
