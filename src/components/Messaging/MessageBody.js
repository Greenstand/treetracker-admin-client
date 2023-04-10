import React, { useState, useContext, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import {
  Announcement,
  Ballot,
  QuestionAnswerOutlined,
} from '@material-ui/icons';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  Grid,
  Modal,
  Paper,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import { TextInput } from './TextInput.js';
import { MessagingContext } from 'context/MessagingContext.js';
import SurveyCharts from './SurveyCharts.js';
import * as loglevel from 'loglevel';

const log = loglevel.getLogger('./MessageBody.js');

const useStyles = makeStyles((theme) => ({
  messageRow: {
    display: 'flex',
    padding: '3px',
    flexDirection: 'column',
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
    marginBottom: '10px',
    padding: '10px',
    background: theme.palette.primary.main,
    color: 'white',
    textAlign: 'left',
    borderRadius: '10px',
    whiteSpace: 'pre-wrap',
  },
  recievedMessage: {
    position: 'relative',
    marginLeft: '20px',
    marginBottom: '10px',
    padding: '10px',
    backgroundColor: 'lightGrey',
    textAlign: 'left',
    borderRadius: '10px',
    width: 'fit-content',
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
    backgroundColor: theme.palette.primary.lightMed,
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
  },
  modalContainer: {
    backgroundColor: 'white',
    width: '45%',
    outline: 'none',
    borderRadius: '4px',
    padding: '20px',
    position: 'absolute',
    top: '30%',
    left: '22%',
  },
  centeredMessage: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20%',
    height: '50%',
  },
}));

export const AnnounceMessage = ({ message }) => {
  const {
    messageRow,
    messageHeader,
    messageTitle,
    announceMessage,
    messageContent,
  } = useStyles();

  return (
    <div className={messageRow}>
      <div className={announceMessage}>
        <div className={messageHeader}>
          <Announcement
            color="inherit"
            style={{ padding: '2px 8px 2px 0px' }}
          />
          <Typography className={messageTitle} variant="h6">
            {message.subject}
          </Typography>
        </div>
        <Typography className={messageContent}>{message.body}</Typography>
        {message.video_link && (
          <Typography className={messageContent} variant="body1">
            {message.video_link}
          </Typography>
        )}
      </div>
    </div>
  );
};

export const SurveyResponseMessage = ({ message }) => {
  const { messageRow, surveyResponse } = useStyles();
  const {
    survey: { questions },
    survey_response,
  } = message;

  return (
    <div className={messageRow}>
      <Grid className={surveyResponse}>
        <Grid item style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant={'h6'}>{message.from}</Typography>
          <Typography>{message.composed_at.slice(0, 10)}</Typography>
        </Grid>
        <hr style={{ border: '0.1px solid black', width: '100%' }} />
        {survey_response &&
          questions.map((question, i) => (
            <div key={`answer - ${i}`}>
              <Typography variant={'body1'}>
                <b>Q{i + 1}:</b> {question.prompt}
              </Typography>
              <Typography variant={'body1'}>
                <b>A:</b> {survey_response[i]}
              </Typography>
            </div>
          ))}
      </Grid>
    </div>
  );
};

export const SurveyMessage = ({ message, type }) => {
  const { messageRow, surveyContent } = useStyles();
  const { questions } = message.survey;

  return (
    <>
      {type === 'survey_response' ? (
        <SurveyResponseMessage message={message} />
      ) : (
        <div className={messageRow}>
          <Grid item className={surveyContent}>
            {questions.map((question, i) => {
              return (
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
                  <hr style={{ border: '0.1px solid black', width: '100%' }} />
                </div>
              );
            })}
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

const SenderInformation = ({
  message,
  messageRecipient,
  responseCount,
  type,
  id,
  avatar_url,
  showCharts,
  setShowCharts,
}) => {
  const { senderInfo, senderItem, avatar, button, dataContainer } = useStyles();

  return (
    <Grid container className={senderInfo}>
      <Grid item className={senderItem}>
        {type === 'message' ? (
          <Avatar src={avatar_url} className={avatar}></Avatar>
        ) : type === 'announce' ? (
          <Announcement
            color="inherit"
            style={{ padding: '2px', fontSize: '2rem' }}
          />
        ) : (
          <Ballot
            color="inherit"
            style={{ padding: '2px', fontSize: '2rem' }}
          />
        )}
      </Grid>
      <Grid item className={senderItem}>
        <Typography variant="h5">
          {type === 'survey' || type === 'survey_response'
            ? `Survey: ${message?.survey?.title}`
            : type === 'announce'
            ? `Announcement`
            : messageRecipient}
        </Typography>

        {(type === 'survey' ||
          type === 'survey_response' ||
          type === 'announce') && (
          <>
            <Typography align="left" color="primary">
              <b>DATE:</b>
              {message?.composed_at &&
                format(new Date(message.composed_at), 'yyyy/MM/dd')}
            </Typography>
            {message?.bulk_message_recipients &&
              message.bulk_message_recipients.map((recipient, i) => (
                <Chip
                  key={`${
                    recipient.organization
                      ? recipient.organization
                      : recipient.region
                  }-${i}`}
                  label={`${
                    recipient.organization
                      ? recipient.organization
                      : recipient.region
                  }`}
                  color="primary"
                  style={{
                    color: 'white',
                    borderRadius: '6px',
                    fontSize: '.8rem',
                    margin: '0.2rem',
                  }}
                />
              ))}
            {(type === 'survey' || type === 'survey_response') && (
              <Typography>
                <b>RESPONSES:</b> {responseCount}
              </Typography>
            )}
          </>
        )}

        {type === 'message' && id && (
          <Typography align="left" color="primary">
            ID: {id}
          </Typography>
        )}
      </Grid>
      {(type === 'survey' || type === 'survey_response') && responseCount > 0 && (
        <Grid item className={dataContainer}>
          <Badge
            badgeContent={responseCount}
            color="secondary"
            overlap="circular"
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {showCharts ? (
              <Button className={button} onClick={() => setShowCharts(false)}>
                Show Survey
              </Button>
            ) : (
              <Button
                className={button}
                onClick={() => setShowCharts(true)}
                disabled={responseCount === 0}
              >
                Show Survey Data
              </Button>
            )}
          </Badge>
        </Grid>
      )}
    </Grid>
  );
};

function getSurveyId(messages) {
  return messages[0].survey.id;
}

const MessageBody = ({ messages, messageRecipient, avatar }) => {
  const {
    paper,
    messagesBody,
    modalContainer,
    textInput,
    centeredMessage,
  } = useStyles();
  const {
    user,
    authors,
    isLoading,
    errorMessage,
    setErrorMessage,
    setIsLoading,
    setThreads,
    postMessageSend,
  } = useContext(MessagingContext);
  const [messageContent, setMessageContent] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [showCharts, setShowCharts] = useState(false);
  const [errors, setErrors] = useState(false);
  const [open, setOpen] = useState(false);
  const handleModalOpen = () => setOpen(true);
  const handleModalClose = () => setOpen(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const res = authors.find((author) => author.handle === messageRecipient);
    if (res?.id) {
      setRecipientId(res.id);
    }
  }, [authors, messageRecipient]);

  useEffect(() => {
    if (errorMessage !== '') {
      handleModalOpen();
      setIsLoading(false);
    }
  }, [errorMessage]);

  const scrollToBottom = () => {
    // without animation
    messagesEndRef.current.scrollIntoView();
    // with animation
    // messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  useEffect(scrollToBottom);

  const validateMessage = (payload) => {
    const errors = {};

    log.debug('body', /\w/g.test(payload.body.trim()));
    if (payload.body.length === 0 || !/\w/g.test(payload.body.trim())) {
      errors.body = 'Please enter a message';
    }

    if (!payload.recipient_handle) {
      errors.recipient = 'Please select a recipient';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const messagePayload = {
      parent_message_id: null,
      author_handle: user.userName,
      recipient_handle: messageRecipient,
      type: 'message',
      body: messageContent,
    };

    const errs = validateMessage(messagePayload);

    const errorsFound = Object.keys(errs).length > 0;
    if (errorsFound) {
      setErrors(true);
      log.debug('errors', errs);
    }

    if (messageContent !== '') {
      if (user.userName && messageRecipient) {
        const res = await postMessageSend(messagePayload);
        if (res.error) {
          setErrorMessage(res.message);
        } else {
          const newMessage = {
            parent_message_id: null,
            body: messageContent,
            composed_at: new Date().toISOString(),
            from: user.userName,
            id: uuidv4(),
            recipient_organization_id: null,
            recipient_region_id: null,
            survey: null,
            to: messageRecipient,
            type: 'message',
            video_link: null,
          };

          log.debug('...update threads after postMessageSend');
          // update the full set of threads
          setThreads((prev) =>
            prev
              .reduce((threads, thread) => {
                if (thread.userName === messageRecipient) {
                  thread.messages.push(newMessage);
                }
                threads.push(thread);
                return threads;
              }, [])
              .sort(
                (a, b) =>
                  new Date(b?.messages?.at(-1).composed_at) -
                  new Date(a?.messages?.at(-1).composed_at)
              )
          );
        }
      }
    }
    setMessageContent('');
  };

  return (
    <>
      <Paper className={paper}>
        {messageRecipient || messages ? (
          <SenderInformation
            message={messages[0]}
            messageRecipient={messageRecipient}
            responseCount={messages.length - 1}
            type={messages[0].type}
            id={recipientId || ''}
            avatar_url={avatar}
            showCharts={showCharts}
            setShowCharts={setShowCharts}
          />
        ) : null}
        <div id="style-1" className={messagesBody}>
          {isLoading ? (
            <Grid item xs className={centeredMessage}>
              <CircularProgress style={{ margin: '30px' }} />
              <Typography variant="h5">
                <QuestionAnswerOutlined
                  color="primary"
                  style={{ padding: '10px 10px 0 0', fontSize: '1.5rem' }}
                />
                Loading...
              </Typography>
            </Grid>
          ) : !isLoading && messages ? (
            messages.map((message, i) => {
              if (message.type === 'message') {
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
              } else if (
                message.type === 'survey' ||
                message.type === 'survey_response'
              ) {
                return (
                  <SurveyMessage
                    key={message.id ? `${message.id}${i}` : i}
                    message={message}
                    user={user}
                    type={message.type}
                  />
                );
              } else if (message.type === 'announce') {
                return (
                  <AnnounceMessage
                    key={message.id ? message.id : i}
                    message={message}
                  />
                );
              }
            })
          ) : (
            <Grid item xs className={centeredMessage}>
              <QuestionAnswerOutlined
                color="primary"
                style={{ padding: '2px', fontSize: '5rem' }}
              />

              {errorMessage !== '' ? (
                <Typography variant="h5">ERROR: {errorMessage}</Typography>
              ) : (
                <Typography variant="h5">You have no messages</Typography>
              )}
            </Grid>
          )}
          <div
            ref={messagesEndRef}
            style={{ height: '10px', width: '100%' }}
          ></div>
        </div>
        {errors && (
          <Typography
            style={{
              color: 'red',
              fontWeight: 'bold',
              margin: '20px 10px 0px',
            }}
          >
            Please enter a message before sending
          </Typography>
        )}
        {messages && messages[0]?.type === 'message' && (
          <TextInput
            messageRecipient={messageRecipient}
            handleSubmit={handleSubmit}
            messageContent={messageContent}
            setMessageContent={setMessageContent}
            className={textInput}
            setErrors={setErrors}
          />
        )}
      </Paper>
      {showCharts && getSurveyId(messages) && (
        <SurveyCharts
          surveyId={getSurveyId(messages)}
          setShowCharts={setShowCharts}
        />
      )}
      <Modal
        open={open}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={modalContainer}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {errorMessage}
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default MessageBody;
