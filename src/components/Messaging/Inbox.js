import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Paper,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import SearchInbox from './SearchInbox';

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
  primaryText: {
    fontSize: '16',
    fontWeight: 'bold',
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
  const {
    paper,
    searchInbox,
    list,
    listItem,
    listText,
    primaryText,
    avatar,
  } = useStyles();

  const [search, setSearch] = useState('');

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
              onClick={(e) => handleListItemClick(e, i, message.userName)}
            >
              {
                <>
                  <ListItemAvatar className={avatar}>
                    <Avatar alt={''} src={''} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography className={primaryText}>
                        {' '}
                        {message.userName}
                      </Typography>
                    }
                    className={listText}
                  />
                </>
              }
            </ListItem>
          ))}
      </List>
      <SearchInbox className={searchInbox} setSearch={setSearch} />
    </Paper>
  );
};

export default Inbox;
