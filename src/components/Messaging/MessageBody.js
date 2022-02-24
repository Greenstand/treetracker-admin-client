import React, { useState, useContext } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Avatar, Grid, Typography, Paper } from '@material-ui/core';
import { TextInput } from './TextInput.js';

import { MessagingContext } from 'context/MessagingContext.js';
import SurveyCharts from './SurveyCharts.js';

const useStyles = makeStyles((theme) =>
  createStyles({
    messageRow: {
      display: 'flex',
    },
    messageRowRight: {
      display: 'flex',
      justifyContent: 'flex-end',
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
      backgroundColor: theme.palette.primary.main,
      textAlign: 'left',
      borderRadius: '10px',
    },
    messageContent: {
      padding: 0,
      margin: 0,
      wordWrap: 'break-word',
    },
    messageTimeStampLeft: {
      display: 'flex',
      marginRight: 'auto',
      alignItems: 'center',
      color: 'grey',
    },
    messageTimeStampRight: {
      display: 'flex',
      marginLeft: 'auto',
      alignItems: 'center',
      color: 'grey',
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
    },
    textInput: {
      borderTop: '2px solid black',
    },
    surveyContent: {
      color: '#fff',
    },
  })
);

export const AnnounceMessage = ({ message }) => {
  const {
    messageRow,
    recievedMessage,
    messageContent,
    messageTimeStampRight,
  } = useStyles();

  return (
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
  );
};

export const SurveyMessage = ({ message }) => {
  const {
    messageRow,
    messageRowRight,
    sentMessage,
    surveyContent,
  } = useStyles();

  const { questions } = message.survey;
  if (1 === Math.round(1.1))
    return <div className={messageRow}>[Hidden Survey Message]</div>;
  return (
    <div className={messageRowRight}>
      <Grid item className={sentMessage}>
        <Typography variant={'h5'} className={surveyContent}>
          {message.body ? message.body : ''}
        </Typography>
        {questions.map((question, i) => (
          <div key={i} className={surveyContent}>
            <Typography variant={'h6'}>
              Question {i + 1}:{' '}
              <Typography variant={'body1'}>{question.prompt}</Typography>
            </Typography>
            <Typography variant={'h6'}>
              Choices:
              <ol type="A">
                {question.choices.map((choice) => (
                  <li key={choice}>{choice}</li>
                ))}
              </ol>
            </Typography>
          </div>
        ))}
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

const SenderInformation = ({ messageRecipient, id }) => {
  const { senderInfo, senderItem, avatar } = useStyles();

  return (
    <Grid container className={senderInfo}>
      <Grid item className={senderItem}>
        <Avatar src="" className={avatar}></Avatar>
      </Grid>
      <Grid item className={senderItem}>
        <Typography variant="h5">{messageRecipient}</Typography>
        <Typography align="left" color="primary" variant="h5">
          ID:{id}
        </Typography>
      </Grid>
    </Grid>
  );
};

function getSurveyId(messages) {
  return messages.reduce(
    (a, c) => (c.subject.includes('Survey') ? c.id : a),
    undefined
  );
}

const MessageBody = ({ messages, messageRecipient }) => {
  const { paper, messagesBody, textInput } = useStyles();
  const { user, postMessageSend } = useContext(MessagingContext);
  const [messageContent, setMessageContent] = useState('');

  const handleSubmit = async (e) => {
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
        await postMessageSend(messagePayload);
      }
    }
    setMessageContent('');
  };

  return (
    <>
      <Paper className={paper}>
        {messageRecipient && messages ? (
          <SenderInformation messageRecipient={messageRecipient} id={''} />
        ) : (
          <SenderInformation></SenderInformation>
        )}
        <div id="style-1" className={messagesBody}>
          {messages ? (
            messages.map((message, i) => {
              if (message.subject === 'Message') {
                return message.from === user.userName ? (
                  <SentMessage
                    key={message.id ? message.id : i}
                    message={message}
                  />
                ) : message.body.length > 1 ? (
                  <RecievedMessage
                    key={message.id ? message.id : i}
                    message={message}
                  />
                ) : (
                  <div key={i}></div>
                );
              } else if (message.subject.includes('Survey')) {
                return (
                  <SurveyMessage
                    key={message.id ? message.id : i}
                    message={message}
                  />
                );
              } else if (message.subject.includes('Announce')) {
                return (
                  <AnnounceMessage
                    key={message.id ? message.id : i}
                    message={message}
                  />
                );
              }
            })
          ) : (
            <div>Loading ...</div>
          )}
        </div>
        <TextInput
          messageRecipient={messageRecipient}
          handleSubmit={handleSubmit}
          messageContent={messageContent}
          setMessageContent={setMessageContent}
          className={textInput}
        />
      </Paper>
      {messages && getSurveyId(messages) && (
        <SurveyCharts surveyId={getSurveyId(messages)} />
      )}
    </>
  );
};

export default MessageBody;
