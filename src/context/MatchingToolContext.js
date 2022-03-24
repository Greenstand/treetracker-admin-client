import React from 'react';
import * as loglevel from 'loglevel';

const log = loglevel.getLogger('../context/MatchingToolContext');

export const MatchingToolContext = React.createContext({
  handleFilterToggle: () => {},
  handleFilter: () => {},
});

export function MatchingToolProvider(props) {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  // EVENT HANDLERS
  function handleFilterToggle() {
    log.warn('toggle filter');
    setIsFilterOpen(!isFilterOpen);
  }

  const value = {
    isFilterOpen,
    handleFilterToggle,
  };

  return (
    <MatchingToolContext.Provider value={value}>
      {props.children}
    </MatchingToolContext.Provider>
  );
}
