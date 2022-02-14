import React, { useEffect } from 'react';
import { documentTitle } from '../common/variables';
import Messaging from 'components/Messaging/Messaging';
import Navbar from 'components/Navbar';

const MessagingView = () => {
  // set Title
  useEffect(() => {
    document.title = `Messaging - ${documentTitle}`;
  }, []);

  return (
    <>
      <Navbar />
      <Messaging />;
    </>
  );
};

export default MessagingView;
