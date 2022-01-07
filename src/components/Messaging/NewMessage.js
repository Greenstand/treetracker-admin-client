import React, { useState, useContext } from 'react';
import { MessagingContext } from 'context/MessagingContext';
import {
  FormControl,
  Box,
  Modal,
  TextField,
  Select,
  MenuItem,
  Typography,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import GSInputLabel from 'components/common/InputLabel';

const useStyles = makeStyles((theme) => ({
  box: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    height: 400,
    backgroundColor: '#FFF',
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: 20,
    boxShadow: 24,
    padding: 20,
    textAlign: 'center',
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
  const { box, header, button } = useStyles();
  const { user, postMessageSend } = useContext(MessagingContext);
  const [messageContent, setMessageContent] = useState({ to: '', body: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessageContent({
      ...messageContent,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const messagePayload = {
      author_handle: user.userName,
      recipient_handle: messageContent.to,
      subject: 'Message',
      body: messageContent.body,
    };
    ``;

    if (
      messagePayload.body !== '' &&
      user.userName &&
      messagePayload.to !== ''
    ) {
      await postMessageSend(messagePayload);
    }
    setMessageContent({ to: '', body: '' });
  };
  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className={box}>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth spacing={2}>
            <Box className={header} my={1}>
              <Typography variant="h3">Send New Message</Typography>
            </Box>
            <GSInputLabel
              id="select-label"
              text="Choose the message recipient"
            />
            <Select
              labelId="select-label"
              id="select"
              variant="filled"
              label="Recipient"
              name="to"
              value={messageContent.to}
              onChange={handleChange}
            >
              <MenuItem>Something</MenuItem>
            </Select>
            <GSInputLabel text="Message" />
            <TextField
              multiline
              placeholder="Write you message here ..."
              name="body"
              value={messageContent.body}
              onChange={handleChange}
            />
            <Button type="submit" size="large" className={button}>
              Send Message
            </Button>
          </FormControl>
        </form>
      </Box>
    </Modal>
  );
};

export default NewMessage;
