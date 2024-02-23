import React from 'react';
import { createContext } from 'react';

export const GrowerDetailStatusContext = createContext({
  growerDetailLoading: false,
  verificationStatus_: null,
  setGrowerDetailLoading: () => {},
  setVerificationStatus_: () => {},
});

export const GrowerDetailStatusProvider = (props) => {
  const [growerDetailLoading, setGrowerDetailLoading] = React.useState(false);
  const [verificationStatus_, setVerificationStatus] = React.useState(null);

  const value = {
    growerDetailLoading,
    verificationStatus_,
    setGrowerDetailLoading,
    setVerificationStatus,
  };

  return (
    <GrowerDetailStatusContext.Provider value={value}>
      {props.children}
    </GrowerDetailStatusContext.Provider>
  );
};
