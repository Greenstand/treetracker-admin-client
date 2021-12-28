import React, { useEffect } from 'react';
import { documentTitle } from '../common/variables';
import Messaging from 'components/Messaging/Messaging';

const MessagingView = () => {
  // set Title
  useEffect(() => {
    document.title = `Messaging - ${documentTitle}`;
  }, []);

  return <Messaging />;
};

export default MessagingView;
