import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
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
    borderBottom: '.3px solid #fff',
    marginBottom: '5px',
  },
  announceMessage: {
    position: 'relative',
    marginLeft: '20px',
    marginBottom: '10px',
    padding: '10px',
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
    flexGrow: 1,
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
    border: 'none',
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      textDecoration: ' none',
      color: 'black',
    },
  },
  surveyResponse: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'lightGrey',
    borderRadius: '10px',
    padding: '1em',
    margin: '5px',
    width: '35%',
  },
}));

export const AnnounceMessage = ({ message }) => {
  const {
    messageRow,
    messageHeader,
    messageTitle,
    announceMessage,
    messageContent,
    messageTimeStampRight,
  } = useStyles();

  return (
    <div className={messageRow}>
      <div className={announceMessage}>
        <div className={messageHeader}>
          <Announcement color="inherit" style={{ padding: '2px' }} />
          <Typography className={messageTitle}>{message.title}</Typography>
        </div>
        <Typography className={messageContent}>{message.body}</Typography>
        {message.video_link && (
          <Typography className={messageContent} variant="body1">
            {message.video_link}
          </Typography>
        )}
      </div>
      <Grid item className={messageTimeStampRight}>
        <Typography>{message.composed_at.slice(0, 10)}</Typography>
      </Grid>
    </div>
  );
};

export const SurveyResponseMessage = ({ message, user }) => {
  const { messageRow, messageTimeStampRight, surveyResponse } = useStyles();

  return (
    <div className={messageRow}>
      <Grid className={surveyResponse}>
        <Typography variant={'h5'}>
          {message.from.author === user.userName
            ? message.to[0].recipient
              ? `${message.body}: ${message.to[0].recipient}`
              : `${message.body}`
            : message.body}
        </Typography>
        <hr style={{ border: '0.1px solid black', width: '100%' }} />
        {message.survey?.answers &&
          message.survey.answers.map((answer, i) => (
            <div key={`answer - ${i}`}>
              <Typography variant={'h6'}>Question {i + 1}:</Typography>
              <Typography variant={'body1'}>{answer}</Typography>
            </div>
          ))}
      </Grid>
      <Grid item className={messageTimeStampRight}>
        <Typography>{message.composed_at.slice(0, 10)}</Typography>
      </Grid>
    </div>
  );
};

export const SurveyMessage = ({ message }) => {
  const { messageRow, surveyContent, messageTimeStampLeft } = useStyles();

  return (
    <>
      {message.survey.response ? (
        <SurveyResponseMessage message={message} />
      ) : (
        <div className={messageRow}>
          <Grid item className={messageTimeStampLeft}>
            <Typography>
              {dateFormat(message.composed_at, 'yyyy-mm-dd hh:mm')}
            </Typography>
          </Grid>
          <Grid item className={surveyContent}>
            <Typography variant={'h5'}>
              {message.body ? message.body : ''}
            </Typography>
            <hr style={{ border: '0.1px solid black', width: '100%' }} />
            {message.survey.questions.map((question, i) => (
              <div key={question + `:${i + 1}`}>
                <Typography variant={'h6'}>Question {i + 1}:</Typography>
                <Typography variant={'body1'}>{question.prompt}</Typography>
                <Typography variant={'h6'}>Choices:</Typography>
                <ol type="A">
                  {question.choices.map((choice, i) => (
                    <Typography
                      variant={'h6'}
                      key={choice ? `choice ${i + 1}:${choice}` : i}
                    >
                      <li>
                        <Typography variant={'body1'}>{choice}</Typography>
                      </li>
                    </Typography>
                  ))}
                </ol>
              </div>
            ))}
          </Grid>
        </div>
      )}
    </>
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

const SenderInformation = ({ message, messageRecipient, type, id }) => {
  const { senderInfo, senderItem, avatar, button, dataContainer } = useStyles();
  console.log('SenderInformation', messageRecipient);

  return (
    <Grid container className={senderInfo}>
      <Grid item className={senderItem}>
        <Avatar src="" className={avatar}></Avatar>
      </Grid>
      <Grid item className={senderItem}>
        <Typography variant="h5">
          {type === 'survey'
            ? `Survey: ${message?.survey?.title}`
            : messageRecipient}
        </Typography>

        {type === 'survey' && (
          <Typography>
            DATE: {dateFormat(message?.composed_at, 'yyyy/mm/dd')}
          </Typography>
        )}

        <Typography align="left" color="primary" variant="caption">
          ID: {id}
        </Typography>
      </Grid>
      {type === 'survey' && (
        <Grid item className={dataContainer}>
          <Button className={button}>Survey Data</Button>
        </Grid>
      )}
    </Grid>
  );
};

const MessageBody = ({ messages, messageRecipient }) => {
  const history = useHistory();
  const { paper, messagesBody, textInput } = useStyles();
  const { user, authors, postMessageSend } = useContext(MessagingContext);
  const [messageContent, setMessageContent] = useState('');
  const [subject, setSubject] = useState(messages ? messages[0].subject : '');
  const [recipientId, setRecipientId] = useState('');

  console.log('MessageBody', messageRecipient, subject);

  useEffect(() => {
    if (messages) {
      // messages are either Surveys or Messages/Announce Messages
      setSubject(messages[0].subject);
    }
  }, [messages, messageRecipient]);

  useEffect(() => {
    const res = authors.find((author) => author.handle === messageRecipient);
    if (res?.id) {
      setRecipientId(res.id);
    } else {
      // if not an author it must be an org or a region and the id is the handle
      setRecipientId(messageRecipient);
    }
  }, [authors, messageRecipient]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let lastMessage = messages[messages.length - 1];

    const messagePayload = {
      parent_message_id: lastMessage.id ? lastMessage.id : null,
      author_handle: user.userName,
      recipient_handle: messageRecipient,
      subject: '',
      type: 'message',
      body: messageContent,
    };

    if (messageContent !== '') {
      if (user.userName && messageRecipient) {
        await postMessageSend(messagePayload);
        history.go(0);
      }
    }
    setMessageContent('');
  };

  return (
    <Paper className={paper}>
      {messageRecipient && messages && recipientId ? (
        <SenderInformation
          message={messages[0]}
          messageRecipient={messageRecipient}
          type={messages[0].type}
          id={recipientId}
        />
      ) : (
        <SenderInformation />
      )}
      <div id="style-1" className={messagesBody}>
        {messages ? (
          messages.map((message, i) => {
            if (message.type === 'message') {
              return message.from === user.userName ? (
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
            } else if (message.type === 'survey') {
              return (
                <SurveyMessage
                  key={message.id ? `messageId=${message.id}i=${i}` : i}
                  message={message}
                  user={user}
                />
              );
            } else if (message.type === 'announce') {
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
