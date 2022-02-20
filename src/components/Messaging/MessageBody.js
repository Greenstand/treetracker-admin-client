import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Announcement } from '@material-ui/icons';
import { Avatar, Grid, Typography, Paper, Button } from '@material-ui/core';
import { TextInput } from './TextInput.js';
import dateFormat from 'dateformat';

import { MessagingContext } from 'context/MessagingContext.js';

const useStyles = makeStyles((theme) => ({
  messageRow: {
    display: 'flex',
    padding: '3px',
  },
  messageRowRight: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  messageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  announceMessage: {
    position: 'relative',
    marginLeft: '20px',
    marginBottom: '10px',
    padding: '10px',
    // backgroundColor: 'lightGrey',
    background: theme.palette.primary.main,
    color: 'white',
    textAlign: 'left',
    borderRadius: '10px',
  },
  recievedMessage: {
    position: 'relative',
    marginLeft: '20px',
    marginBottom: '10px',
    padding: '10px',
    backgroundColor: 'lightGrey',
    textAlign: 'left',
    borderRadius: '10px',
  },
  sentMessage: {
    position: 'relative',
    marginRight: '20px',
    marginBottom: '10px',
    padding: '10px',
    backgroundColor: theme.palette.primary.lightMed,
    // backgroundColor: theme.palette.primary.main,
    textAlign: 'left',
    borderRadius: '10px',
  },
  messageTitle: {
    padding: 0,
    margin: 0,
    wordWrap: 'break-word',
    fontWeight: 'bold',
  },
  messageContent: {
    padding: 0,
    margin: 0,
    wordWrap: 'break-word',
  },
  messageTimeStampLeft: {
    display: 'flex',
    marginRight: 'auto',
    alignItems: 'top',
    color: 'grey',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  messageTimeStampRight: {
    display: 'flex',
    marginLeft: 'auto',
    alignItems: 'center',
    color: 'grey',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  displayName: {
    marginLeft: '20px',
  },
  paper: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  senderInfo: {
    padding: '10px',
    borderBottom: '2px solid black',
  },
  messagesBody: {
    height: '80%',
    width: '95%',
    padding: '7.5px',
    overflowY: 'auto',
  },
  senderItem: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  avatar: {
    width: '5em',
    height: '5em',
    [theme.breakpoints.down('md')]: {
      width: '4em',
      height: '4em',
    },
    [theme.breakpoints.down('sm')]: {
      width: '2em',
      height: '2em',
    },
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  textInput: {
    borderTop: '2px solid black',
  },
  surveyContent: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 'auto',
    backgroundColor: theme.palette.primary.lightMed,
    // backgroundColor: theme.palette.primary.main,
    // color: '#fff',
    width: '65%',
    borderRadius: '10px',
    padding: '10px',
  },
  dataContainer: {
    marginLeft: 'auto',
    alignSelf: 'center',
  },
  button: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: '50px',
    color: 'white',
    margin: '5px',
  },
}));

export const AnnounceMessage = ({ message }) => {
  const {
    messageRow,
    messageHeader,
    announceMessage,
    messageTitle,
    messageContent,
    messageTimeStampRight,
  } = useStyles();

  return (
    <div className={messageRow}>
      <div className={announceMessage}>
        <div className={messageHeader}>
          <Announcement color="white" style={{ padding: '2px' }} />
          <Typography className={messageTitle}>{message.body}</Typography>
        </div>
        {message.video_link && (
          <div>
            <br />
            <Typography className={messageContent} variant="body1">
              {message.video_link}
            </Typography>
          </div>
        )}
      </div>
      <Grid item className={messageTimeStampRight}>
        <Typography>{message.composed_at.slice(0, 10)}</Typography>
      </Grid>
    </div>
  );
};

export const SurveyMessage = ({ message }) => {
  const { messageRow, surveyContent, messageTimeStampLeft } = useStyles();

  return (
    <div className={messageRow}>
      <Grid item className={messageTimeStampLeft}>
        <Typography>
          {dateFormat(message.composed_at, 'yyyy-mm-dd hh:mm')}
        </Typography>
      </Grid>
      <Grid item className={surveyContent}>
        {/* <Typography variant={'h6'}>
          {message.from.author ? message.from.author : ''}
        </Typography> */}
        {message.survey.response ? (
          <>
            {message.survey?.answers &&
              message.survey.answers.map((answer, i) => (
                <div key={`answer - ${i}`}>
                  <Typography>{answer}</Typography>
                </div>
              ))}
          </>
        ) : (
          <>
            {message.survey.questions.map((question, i) => (
              <div key={question + `:${i + 1}`}>
                <Typography variant={'h6'}>
                  Question {i + 1}:{' '}
                  <Typography variant={'body1'}>{question.prompt}</Typography>
                </Typography>
                <Typography variant={'h6'}>
                  Choices:
                  <ol type="A">
                    {question.choices.map((choice, i) => (
                      <li key={choice ? `choice ${i + 1}:${choice}` : i}>
                        {choice}
                      </li>
                    ))}
                  </ol>
                </Typography>
              </div>
            ))}
          </>
        )}
      </Grid>
    </div>
  );
};

export const RecievedMessage = ({ message }) => {
  const {
    messageRow,
    messageTimeStampRight,
    messageContent,
    recievedMessage,
  } = useStyles();
  return (
    <>
      <div className={messageRow}>
        <div className={recievedMessage}>
          <div>
            <Typography className={messageContent}>{message.body}</Typography>
          </div>
        </div>
        <Grid item className={messageTimeStampRight}>
          <Typography>{message.composed_at.slice(0, 10)}</Typography>
        </Grid>
      </div>
    </>
  );
};

export const SentMessage = ({ message }) => {
  const {
    messageRowRight,
    messageContent,
    messageTimeStampLeft,
    sentMessage,
  } = useStyles();

  return (
    <>
      {message.body ? (
        <Grid className={messageRowRight} container>
          <Grid item className={messageTimeStampLeft}>
            <Typography>{message.composed_at.slice(0, 10)}</Typography>
          </Grid>
          <Grid item className={sentMessage}>
            <Typography className={messageContent}>{message.body}</Typography>
          </Grid>
        </Grid>
      ) : (
        <div></div>
      )}
    </>
  );
};

const SenderInformation = ({ message, messageRecipient, subject, id }) => {
  const { senderInfo, senderItem, avatar, button, dataContainer } = useStyles();

  return (
    <Grid container className={senderInfo}>
      <Grid item className={senderItem}>
        <Avatar src="" className={avatar}></Avatar>
      </Grid>
      <Grid item className={senderItem}>
        <Typography variant="h5">
          {subject === 'Survey' ? subject : messageRecipient}
        </Typography>

        {(subject === 'Survey' || subject === 'Announce') && (
          <Typography>
            DATE: {dateFormat(message?.composed_at, 'yyyy/mm/dd')}
          </Typography>
        )}

        <Typography align="left" color="primary">
          {subject === 'Survey' ? messageRecipient : `ID: ${id}`}
        </Typography>
      </Grid>
      {subject === 'Survey' && (
        <Grid item className={dataContainer}>
          <Button className={button}>Survey Data</Button>
        </Grid>
      )}
    </Grid>
  );
};

const MessageBody = ({ messages, messageRecipient }) => {
  const { paper, messagesBody, textInput } = useStyles();
  const { user, authors, postMessageSend } = useContext(MessagingContext);
  const [messageContent, setMessageContent] = useState('');
  const [subject, setSubject] = useState('');
  const [recipientId, setRecipientId] = useState('');

  useEffect(() => {
    if (messages) {
      setSubject(messages[0].subject);
    }
  }, [messages]);

  useEffect(() => {
    if (authors && messageRecipient) {
      let res = authors.find((author) => author.handle === messageRecipient);

      if (res) {
        setRecipientId(res.id);
      }
    }
  }, [authors, messageRecipient]);

  const handleSubmit = (e) => {
    e.preventDefault();

    let lastMessage = messages[messages.length - 1];

    const messagePayload = {
      parent_message_id: lastMessage.id ? lastMessage.id : null,
      author_handle: user.userName,
      recipient_handle: messageRecipient,
      subject: 'Message',
      body: messageContent,
    };

    if (messageContent !== '') {
      if (user.userName && messageRecipient) {
        postMessageSend(messagePayload);
      }
    }
    setMessageContent('');
  };

  return (
    <Paper className={paper}>
      {messageRecipient && messages ? (
        <SenderInformation
          message={messages[0]}
          messageRecipient={messageRecipient}
          subject={subject}
          id={recipientId}
        />
      ) : (
        <SenderInformation />
      )}
      <div id="style-1" className={messagesBody}>
        {messages ? (
          messages.map((message, i) => {
            if (message.subject === 'Message') {
              return message.from.author === user.userName ? (
                <SentMessage
                  key={message.id ? `messageId=${message.id}i=${i}` : `i`}
                  message={message}
                />
              ) : message.body.length > 1 ? (
                <RecievedMessage
                  key={message.id ? `messageId=${message.id}i=${i}` : `i`}
                  message={message}
                />
              ) : (
                <div key={i}></div>
              );
            } else if (message.subject.includes('Survey')) {
              return (
                <SurveyMessage
                  key={message.id ? `messageId=${message.id}i=${i}` : i}
                  message={message}
                />
              );
            } else if (message.subject.includes('Announce')) {
              return (
                <AnnounceMessage
                  key={message.id ? `messageId=${message.id}i=${i}` : i}
                  message={message}
                />
              );
            }
          })
        ) : (
          <div>Loading ...</div>
        )}
      </div>
      {subject !== 'Survey' && (
        <TextInput
          messageRecipient={messageRecipient}
          handleSubmit={handleSubmit}
          messageContent={messageContent}
          setMessageContent={setMessageContent}
          className={textInput}
        />
      )}
    </Paper>
  );
};

export default MessageBody;
