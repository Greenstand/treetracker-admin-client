import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  wrapForm: {
    display: 'flex',
    alignSelf: 'flex-end',
    width: '100%',
    borderTop: '2px solid black',
  },
  wrapText: {
    width: '100%',
  },
  button: {
    background: 'white',
    color: theme.palette.primary.main,
    fontWeight: 'bold',
  },
}));

export const TextInput = ({
  handleSubmit,
  messageContent,
  setMessageContent,
}) => {
  const { wrapForm, wrapText, button } = useStyles();

  const handleChange = (e) => {
    setMessageContent(e.target.value);
  };

  return (
    <form
      className={wrapForm}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <TextField
        id="standard-text"
        label="TYPE MESSAGE HERE"
        className={wrapText}
        variant="filled"
        value={messageContent}
        onChange={handleChange}
      />
      <Button type="submit" variant="contained" className={button}>
        Send
      </Button>
    </form>
  );
};
