import React, { useState, useContext, useEffect } from 'react';
import uuid from 'uuid/v4';
import { MessagingContext } from 'context/MessagingContext';
import {
  FormControl,
  Box,
  Modal,
  TextField,
  Typography,
  Button,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';

import GSInputLabel from 'components/common/InputLabel';
const log = require('loglevel');

const useStyles = makeStyles((theme) => ({
  box: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#FFF',
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: 20,
    boxShadow: 24,
    padding: 20,
    textAlign: 'center',
    [theme.breakpoints.down('md')]: {
      height: 450,
      width: 300,
    },
    [theme.breakpoints.up('md')]: {
      height: 550,
      width: 400,
    },
    [theme.breakpoints.up('lg')]: {
      height: 650,
      width: 500,
    },
  },
  formContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    height: '90%',
    padding: '1em',
  },
  header: {
    color: theme.palette.primary.main,
    borderBottom: `2px solid black`,
    padding: 10,
  },
  button: {
    margin: '10px 0',
    background: theme.palette.primary.main,
    color: 'white',
  },
}));

const NewMessage = ({ openModal, handleClose }) => {
  const { box, formContent, header, button } = useStyles();
  const {
    setErrorMessage,
    user,
    authors,
    threads,
    setThreads,
    postMessageSend,
  } = useContext(MessagingContext);
  const [messageContent, setMessageContent] = useState('');
  const [recipient, setRecipient] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (openModal === false) {
      setMessageContent('');
      setRecipient('');
    }
  }, [openModal]);

  const handleChange = (e) => {
    setError(false);
    const { name, value } = e.target;
    name === 'body'
      ? setMessageContent(value)
      : setRecipient(e.target.textContent);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const messagePayload = {
      author_handle: user.userName,
      recipient_handle: recipient,
      type: 'message',
      body: messageContent,
    };

    if (
      !recipient ||
      recipient === '' ||
      !messageContent ||
      messageContent === ''
    ) {
      setError(true);
      return;
    }

    if (
      messagePayload.body !== '' &&
      user.userName &&
      messagePayload.to !== ''
    ) {
      const res = await postMessageSend(messagePayload);
      log.debug('NewMessage submit', threads, res);

      if (res.error) {
        setErrorMessage(res.message);
      } else {
        const newMessage = {
          parent_message_id: null,
          body: messageContent,
          composed_at: new Date().toISOString(),
          from: user.userName,
          id: uuid(),
          recipient_organization_id: null,
          recipient_region_id: null,
          survey: null,
          to: recipient,
          type: 'message',
          video_link: null,
        };

        log.debug('...update threads after postMessageSend');
        // update the full set of threads
        setThreads((prev) => {
          const updated = prev
            .reduce(
              (threads, thread) => {
                if (thread.userName === recipient) {
                  thread.messages.push(newMessage);
                }
                return threads;
              },
              [...prev]
            )
            .sort(
              (a, b) =>
                new Date(b?.messages?.at(-1).composed_at) -
                new Date(a?.messages?.at(-1).composed_at)
            );
          return updated;
        });
      }
    }
    handleClose();
  };

  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className={box}>
        <form className={formContent} onSubmit={handleSubmit}>
          <Box className={header} my={1}>
            <Typography variant="h3">Send New Message</Typography>
          </Box>
          {error ? (
            <Typography
              style={{
                color: 'red',
                fontWeight: 'bold',
                margin: '20px 10px 0px',
              }}
            >
              Please select a recipient and enter a message!
            </Typography>
          ) : null}
          <FormControl>
            <GSInputLabel text="Choose the Message Recipient" />
            <Autocomplete
              name="to"
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              value={recipient}
              onChange={handleChange}
              options={
                authors.length &&
                authors.map((author) => author.handle || '').sort()
              }
              inputValue={inputValue}
              getOptionSelected={(option, value) => option === value}
              onInputChange={(e, val) => setInputValue(val)}
              id="controllable-states-demo"
              freeSolo
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Message Recipient" />
              )}
            />
          </FormControl>
          <FormControl>
            <GSInputLabel text="Message" />
            <TextField
              multiline
              placeholder="Write your message here ..."
              name="body"
              value={messageContent}
              onChange={handleChange}
            />
          </FormControl>
          <Button type="submit" size="large" className={button}>
            Send Message
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default NewMessage;
