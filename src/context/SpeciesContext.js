import React, { useState, useEffect, createContext } from 'react';
import api from '../api/treeTrackerApi';
import * as loglevel from 'loglevel';

const log = loglevel.getLogger('../context/SpeciesContext');

export const SpeciesContext = createContext({
  speciesList: [],
  speciesInput: '',
  setSpeciesInput: () => {},
  loadSpeciesList: () => {},
  onChange: () => {},
  isNewSpecies: () => {},
  createSpecies: () => {},
  getSpeciesId: () => {},
  editSpecies: () => {},
  deleteSpecies: () => {},
  combineSpecies: () => {},
});

export function SpeciesProvider(props) {
  const [speciesList, setSpeciesList] = useState([]);
  const [speciesInput, setSpeciesInput] = useState(''); // only used by Species dropdown and Verify

  useEffect(() => {
    const abortController = new AbortController();
    loadSpeciesList({ signal: abortController.signal });
    return () => abortController.abort();
  }, []);

  // EVENT HANDLERS

  const loadSpeciesList = async (abortController) => {
    const species = await api.getSpecies(abortController);
    log.debug('load species from api:', species.length);

    // const speciesListWithCount = await Promise.all(
    //   species.map(async (species) => {
    //     let captureCount = await api.getCaptureCountPerSpecies(
    //       species.id,
    //       abortController,
    //     );
    //     species.captureCount = captureCount?.count;
    //     return species;
    //   }),
    // );
    // console.log('species with count', speciesListWithCount);
    setSpeciesList(species);
  };

  // only used by Species dropdown
  const onChange = async (text) => {
    console.log('on change:"', text, '"');
    setSpeciesInput(text);
  };

  // only used by Verify
  const isNewSpecies = () => {
    //check input is valid and doesn't already exist
    if (!speciesInput) {
      log.debug('empty species, false');
      return false;
    }
    log.debug(
      'to find species %s in list:%d',
      speciesInput,
      speciesList.length,
    );
    return speciesList.every(
      (c) => c.name.toLowerCase() !== speciesInput.toLowerCase(),
    );
  };

  const createSpecies = async (payload) => {
    const species = await api.createSpecies(
      payload || {
        name: speciesInput,
        desc: '',
      },
    );
    console.debug('created new species:', species);
    setSpeciesList([species, ...speciesList]);
  };

  //to get the species id according the current speciesInput
  const getSpeciesId = () => {
    if (speciesInput) {
      return speciesList.reduce((a, c) => {
        if (a) {
          return a;
        } else if (c.name === speciesInput) {
          return c.id;
        } else {
          return a;
        }
      }, undefined);
    }
  };

  const editSpecies = async (payload) => {
    const { id, name, desc } = payload;
    const editedSpecies = await api.editSpecies(id, name, desc);
    console.debug('edit old species:', editedSpecies);
  };

  const deleteSpecies = async (payload) => {
    const { id } = payload;
    const deletedSpecies = await api.deleteSpecies(id);
    console.debug('delete outdated species:', id, deletedSpecies);
  };

  const combineSpecies = async (payload) => {
    const { combine, name, desc } = payload;
    await api.combineSpecies(combine, name, desc);
  };

  const value = {
    speciesList,
    speciesInput,
    setSpeciesInput,
    loadSpeciesList,
    onChange,
    isNewSpecies,
    createSpecies,
    getSpeciesId,
    editSpecies,
    deleteSpecies,
    combineSpecies,
  };
  return (
    <SpeciesContext.Provider value={value}>
      {props.children}
    </SpeciesContext.Provider>
  );
}
