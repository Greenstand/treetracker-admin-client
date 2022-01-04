import React, { useState, useEffect, useContext } from 'react';

import Navbar from 'components/Navbar';
import Inbox from './Inbox';
import MessageBody from './MessageBody';
import Survey from './Survey';
import AnnounceMessage from './AnnounceMessage';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';
import { MessagingContext } from '../../context/MessagingContext';

const useStyles = makeStyles((theme) => ({
  rootContainer: {
    paddingBottom: '1em',
    marginBottom: '2em',
  },
  title: {
    marginLeft: theme.spacing(7),
    fontSize: '24px',
  },
  button: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: '50px',
    color: 'white',
    margin: '5px',
  },
  buttonContainer: {
    margin: '2em',
    marginLeft: 'auto',
  },
  messagesContainer: {
    margin: '2em',
    padding: '2em',
  },
  container: {
    width: '90vw',
    height: '85vh',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '6em',
    border: '1px solid black',
    borderRadius: '5px',
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
  const {
    rootContainer,
    title,
    button,
    buttonContainer,
    container,
    inbox,
    body,
  } = useStyles();

  const { messages, loadMessages, loadRegions } = useContext(MessagingContext);

  useEffect(() => {
    loadMessages();
    loadRegions();
  }, []);

  const [toggleAnnounceMessage, setToggleAnnounceMessage] = useState(false);
  const [toggleSurvey, setToggleSurvey] = useState(false);
  const [messageRecipient, setMessageRecipient] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (messages.length && messageRecipient === '') {
      setMessageRecipient(messages[0].userName);
    }
  }, [messages]);

  const handleListItemClick = (e, i, userName) => {
    setSelectedIndex(i);
    setMessageRecipient(userName);
  };

  return (
    <>
      <Navbar />
      <Grid container direction="row" className={rootContainer}>
        <Grid item className={title}>
          <h1>Inbox</h1>
        </Grid>
        <Grid item className={buttonContainer}>
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
          {toggleAnnounceMessage ? (
            <AnnounceMessage
              toggleAnnounceMessage={toggleAnnounceMessage}
              setToggleAnnounceMessage={setToggleAnnounceMessage}
            />
          ) : (
            <></>
          )}
          {toggleSurvey ? (
            <Survey
              toggleSurvey={toggleSurvey}
              setToggleSurvey={setToggleSurvey}
            />
          ) : (
            <></>
          )}
        </Grid>
      </Grid>
      <Grid container className={container}>
        <Grid item className={inbox} xs={5} md={4}>
          <Inbox
            messages={messages}
            selectedIndex={selectedIndex}
            messageRecipient={messageRecipient}
            handleListItemClick={handleListItemClick}
          />
        </Grid>
        <Grid item className={body} xs={7} md={8}>
          {messages.length ? (
            <MessageBody
              messages={messages[selectedIndex].messages}
              messageRecipient={messageRecipient}
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
