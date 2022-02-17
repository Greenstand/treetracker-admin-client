import React, { useState, useContext, useEffect } from 'react';
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
  const { user, authors, postMessageSend } = useContext(MessagingContext);
  const [messageContent, setMessageContent] = useState('');
  const [recipient, setRecipient] = useState(null);

  useEffect(() => {
    if (openModal === false) {
      setMessageContent('');
      setRecipient(null);
    }
  }, [openModal]);

  const handleChange = (e) => {
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
      subject: 'Message',
      body: messageContent,
    };

    if (
      messagePayload.body !== '' &&
      user.userName &&
      messagePayload.to !== ''
    ) {
      await postMessageSend(messagePayload);
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
          <FormControl>
            <GSInputLabel text="Choose the Message Recipient" />
            <Autocomplete
              name="to"
              defaultValue={messageContent.to}
              onChange={handleChange}
              options={authors.map((author) => author.handle)}
              id="controllable-states-demo"
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
              placeholder="Write you message here ..."
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
