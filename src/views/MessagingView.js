import React, { useEffect, useContext } from 'react';
import { documentTitle } from '../common/variables';
import Messaging from 'components/Messaging/Messaging';
import Navbar from 'components/Navbar';
import { MessagingContext } from 'context/MessagingContext';

const MessagingView = () => {
  const { user, messages, loadMessages, loadRegions, loadAuthors } = useContext(
    MessagingContext
  );

  // set Title
  useEffect(() => {
    document.title = `Messaging - ${documentTitle}`;
    loadMessages();
    loadRegions();
    loadAuthors();
  }, []);

  return (
    <>
      <Navbar />
      <Messaging user={user} messages={messages} />
    </>
  );
};

export default MessagingView;
