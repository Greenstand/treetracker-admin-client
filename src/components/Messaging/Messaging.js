import React, { useState, useEffect, useContext } from 'react';

import Inbox from './Inbox';
import MessageBody from './MessageBody';
import Survey from './Survey';
import AnnounceMessage from './AnnounceMessage';
import NewMessage from './NewMessage';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';
import { MessagingContext } from '../../context/MessagingContext';

const useStyles = makeStyles((theme) => ({
  headerGrid: {
    width: '90%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 'auto',
  },
  button: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: '50px',
    color: 'white',
    margin: '5px',
    border: 'none',
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      textDecoration: ' none',
      color: 'black',
    },
  },
  messagesContainer: {
    margin: '2em',
    padding: '2em',
  },
  container: {
    width: '90vw',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '5vw',
    border: '1px solid black',
    borderRadius: '5px',
    display: 'flex',
    flexGrow: 1,
  },
  inbox: {
    width: '30%',
    height: '100%',
    border: '1px solid black',
  },
  body: {
    height: '100%',
    width: '100%',
    border: '1px solid black',
  },
}));

const Messaging = () => {
  // styles
  const { headerGrid, button, container, inbox, body } = useStyles();
  const { user, messages, loadMessages, loadRegions, loadAuthors } = useContext(
    MessagingContext
  );

  const [toggleAnnounceMessage, setToggleAnnounceMessage] = useState(false);
  const [toggleSurvey, setToggleSurvey] = useState(false);
  const [messageRecipient, setMessageRecipient] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const findMessageRecipient = (messages) => {
    messages.username !== user.userName
      ? setMessageRecipient(messages.username)
      : setMessageRecipient(user.userName);
  };

  useEffect(() => {
    console.log('Messaging.js: useEffect: loadMessages');
    loadMessages();
    loadRegions();
    loadAuthors();
  }, []);

  useEffect(() => {
    if (messages.length && messageRecipient === null) {
      findMessageRecipient(messages);
    }
  }, [messages]);

  const handleListItemClick = (e, i, userName) => {
    setMessageRecipient(userName);
    setSelectedIndex(i);
  };

  return (
    <>
      <Grid container id="Messaging" className={headerGrid}>
        <Grid item>
          <h1>Inbox</h1>
        </Grid>
        <Grid item>
          <Button className={button} onClick={handleOpen}>
            New Message
          </Button>
          <NewMessage openModal={openModal} handleClose={handleClose} />
          <Button
            className={button}
            onClick={() => setToggleAnnounceMessage(!toggleAnnounceMessage)}
          >
            Announce Message
          </Button>
          <Button
            className={button}
            onClick={() => setToggleSurvey(!toggleSurvey)}
          >
            Quick Survey
          </Button>
          {toggleAnnounceMessage && (
            <AnnounceMessage
              toggleAnnounceMessage={toggleAnnounceMessage}
              setToggleAnnounceMessage={setToggleAnnounceMessage}
            />
          )}
          {toggleSurvey && (
            <Survey
              toggleSurvey={toggleSurvey}
              setToggleSurvey={setToggleSurvey}
            />
          )}
        </Grid>
      </Grid>
      <Grid container className={container}>
        <Grid item className={inbox} xs={5} md={4}>
          <Inbox
            threads={messages}
            selectedIndex={selectedIndex}
            handleListItemClick={handleListItemClick}
          />
        </Grid>
        <Grid item className={body} xs={7} md={8}>
          {messages.length ? (
            <MessageBody
              messages={messages[selectedIndex].messages}
              messageRecipient={messages[selectedIndex].userName}
            />
          ) : (
            <MessageBody />
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default Messaging;
