import React, { useEffect } from 'react';

import { SpeciesProvider } from '../context/SpeciesContext';
import { TagsProvider } from '../context/TagsContext';
import Verify from '../components/Verify';
import { VerifyProvider } from '../context/VerifyContext';
import { documentTitle } from '../common/variables';

function VerifyView() {
  useEffect(() => {
    document.title = `Verify Captures - ${documentTitle}`;
  }, []);

  return (
    <VerifyProvider>
      <SpeciesProvider>
        <TagsProvider>
          <Verify />
        </TagsProvider>
      </SpeciesProvider>
    </VerifyProvider>
  );
}

export default VerifyView;
