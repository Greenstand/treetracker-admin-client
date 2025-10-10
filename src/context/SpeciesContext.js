import React, { useState, createContext } from 'react';
import api from '../api/treeTrackerApi';
import * as loglevel from 'loglevel';
import { useQuery, useQueryClient } from '@tanstack/react-query';


export const SpeciesContext = createContext({
  isLoading: false,
  speciesList: [],
  speciesInput: '',
  setSpeciesInput: () => {},
  onChange: () => {},
  isNewSpecies: () => {},
  createSpecies: () => {},
  getSpeciesId: () => {},
  editSpecies: () => {},
  deleteSpecies: () => {},
  combineSpecies: () => {},
});

export function SpeciesProvider({ children }) {
  const [speciesInput, setSpeciesInput] = useState('');
  const queryClient = useQueryClient();

  const { data: speciesList = [], isLoading } = useQuery({
    queryKey: ['species'],
    queryFn: () => api.getSpecies(), // API already has getSpecies
    staleTime: 1000 * 60 * 5, // cache for 5 mins
    refetchOnWindowFocus: false,
    enabled: false, // ✅ Disable automatic fetching until Home mounts
  });

  // only used by Species dropdown
  const onChange = (text) => {
    console.log('on change:"', text, '"');
    setSpeciesInput(text);
  };

  const isNewSpecies = () => {
    if (!speciesInput) return false;
    return speciesList.every(
      (c) => c.name.toLowerCase() !== speciesInput.toLowerCase()
    );
  };

  const createSpecies = async (payload) => {
    const species = await api.createSpecies(
      payload || { name: speciesInput, desc: '' }
    );
    console.debug('created new species:', species);
    // update cache
    queryClient.setQueryData(['species'], (old = []) => [species, ...old]);
  };

  const getSpeciesId = () => {
    if (speciesInput) {
      return speciesList.find((c) => c.name === speciesInput)?.id;
    }
  };

  const editSpecies = async ({ id, name, desc }) => {
    const editedSpecies = await api.editSpecies(id, name, desc);
    console.debug('edit old species:', editedSpecies);
    // refetch species list after editing
    queryClient.invalidateQueries(['species']);
  };

  const deleteSpecies = async ({ id }) => {
    await api.deleteSpecies(id);
    console.debug('delete outdated species:', id);
    queryClient.invalidateQueries(['species']);
  };

  const combineSpecies = async ({ combine, name, desc }) => {
    await api.combineSpecies(combine, name, desc);
    queryClient.invalidateQueries(['species']);
  };

  const value = {
    isLoading,
    speciesList,
    speciesInput,
    setSpeciesInput,
    onChange,
    isNewSpecies,
    createSpecies,
    getSpeciesId,
    editSpecies,
    deleteSpecies,
    combineSpecies,
  };

  return (
    <SpeciesContext.Provider value={value}>{children}</SpeciesContext.Provider>
  );
}
