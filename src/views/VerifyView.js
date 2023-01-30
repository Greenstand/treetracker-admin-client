import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { documentTitle } from '../common/variables';
import Verify from '../components/Verify';
import { VerifyProvider } from '../context/VerifyContext';
import { SpeciesProvider } from '../context/SpeciesContext';
import { TagsProvider } from '../context/TagsContext';

function VerifyView() {
  useEffect(() => {
    document.title = `Verify Captures - ${documentTitle}`;
  }, []);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  return (
    <VerifyProvider searchParams={searchParams}>
      <SpeciesProvider>
        <TagsProvider>
          <Verify />
        </TagsProvider>
      </SpeciesProvider>
    </VerifyProvider>
  );
}

export default VerifyView;
