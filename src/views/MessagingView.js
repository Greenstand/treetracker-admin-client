import React, { useEffect } from 'react';
import { documentTitle } from '../common/variables';
import Messaging from 'components/Messaging/Messaging';
import { MessagingProvider } from 'context/MessagingContext';

const MessagingView = () => {
  // set Title
  useEffect(() => {
    document.title = `Messaging - ${documentTitle}`;
  }, []);

  return (
    <MessagingProvider>
      <Messaging />
    </MessagingProvider>
  );
};

export default MessagingView;
