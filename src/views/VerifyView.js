import React, { useEffect } from 'react';
import { documentTitle } from '../common/variables';
import Verify from '../components/Verify';
import { VerifyProvider } from '../context/VerifyContext';
import { SpeciesProvider } from '../context/SpeciesContext';
import { TagsProvider } from '../context/TagsContext';

function VerifyView({ search }) {
  useEffect(() => {
    document.title = `Verify Captures - ${documentTitle}`;
  }, []);

  return (
    <VerifyProvider search={search}>
      <SpeciesProvider>
        <TagsProvider>
          <Verify />
        </TagsProvider>
      </SpeciesProvider>
    </VerifyProvider>
  );
}

export default VerifyView;
