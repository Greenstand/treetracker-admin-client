import React, { useState, useContext } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import SearchInbox from './SearchInbox';
import { MessagingContext } from 'context/MessagingContext';

const useStyles = makeStyles((theme) => ({
  paper: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  searchInbox: {
    alignSelf: 'flex-end',
  },
  list: {
    height: '100%',
    width: '100%',
    overflow: 'auto',
    padding: 0,
  },
  listItem: {
    border: '1px solid lightGrey',
    height: '5em',
    '&.Mui-selected': {
      background: '#FFF',
      borderRight: `5px solid ${theme.palette.primary.main}`,
      borderLeft: `5px solid ${theme.palette.primary.main}`,
    },
  },
  listText: {
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
  },
  messageText: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  avatar: {
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
}));

const Inbox = ({ messages, selectedIndex, handleListItemClick }) => {
  const { paper, searchInbox, list, listItem, listText, avatar } = useStyles();
  const { user } = useContext(MessagingContext);
  const [search, setSearch] = useState('');

  const onClickHelper = (e, i, message) => {
    let recipient =
      message.messages[0].to[0].recipient !== user.userName
        ? message.messages[0].to[0].recipient
        : message.messages[0].from;
    handleListItemClick(e, i, recipient);
  };
  return (
    <Paper className={paper}>
      <List className={list}>
        {messages
          .filter((message) => {
            if (search === '') {
              return message;
            } else if (
              message.userName.toLowerCase().includes(search.toLowerCase())
            ) {
              return message;
            }
          })
          .map((message, i) => (
            <ListItem
              key={i}
              alignItems="flex-start"
              className={listItem}
              component={Button}
              selected={selectedIndex === i}
              onClick={(e) => onClickHelper(e, i, message)}
            >
              <ListItemAvatar className={avatar}>
                <Avatar alt={''} src={''} />
              </ListItemAvatar>
              {message.messages[0].subject === 'Survey' ? (
                <ListItemText
                  primary={message.messages[0].subject}
                  secondary={message.userName}
                  className={listText}
                />
              ) : (
                <ListItemText primary={message.userName} className={listText} />
              )}
            </ListItem>
          ))}
      </List>
      <SearchInbox className={searchInbox} setSearch={setSearch} />
    </Paper>
  );
};

export default Inbox;
