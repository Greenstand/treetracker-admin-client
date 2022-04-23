import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Announcement, Ballot } from '@material-ui/icons';
import SearchInbox from './SearchInbox';
import { timeAgoFormatDate } from 'common/locale';

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
    borderBottom: '1px solid lightGrey',
    '&.Mui-selected': {
      background: theme.palette.primary.lightVery,
      borderLeft: `5px solid ${theme.palette.primary.main}`,
      borderBottom: `1px solid ${theme.palette.primary.main}`,
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
    marginTop: '0',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
}));

const Inbox = ({ threads, selected, handleListItemClick }) => {
  const { paper, searchInbox, list, listItem, listText, avatar } = useStyles();
  const [search, setSearch] = useState('');

  return (
    <Paper className={paper}>
      <List className={list}>
        {threads
          .filter((thread) => {
            if (search === '') {
              return thread;
            } else if (
              thread.userName.toLowerCase().includes(search.toLowerCase())
            ) {
              return thread;
            }
          })
          .map((thread, i) => (
            <ListItem
              key={`${thread.userName}-${i}`}
              alignItems="flex-start"
              className={listItem}
              selected={thread.userName === selected}
              onClick={() => handleListItemClick(thread.userName)}
            >
              <ListItemAvatar>
                {thread.messages[0].type === 'message' ? (
                  <Avatar src={thread.avatar} className={avatar}></Avatar>
                ) : thread.messages[0].type === 'announce' ? (
                  <Announcement color="inherit" />
                ) : (
                  <Ballot color="inherit" />
                )}
              </ListItemAvatar>
              {thread.messages[0].type === 'survey' ||
              thread.messages[0].type === 'announce' ? (
                <ListItemText
                  primary={thread.messages[0].subject}
                  secondary={
                    thread.messages[0].subject
                      ? thread.messages[0].composed_at.slice(0, 10)
                      : thread.userName
                  }
                  className={listText}
                />
              ) : (
                <ListItemText primary={thread.userName} className={listText} />
              )}
              <Typography>
                {timeAgoFormatDate(
                  new Date(
                    thread.messages[thread.messages.length - 1].composed_at
                  )
                )}
              </Typography>
            </ListItem>
          ))}
      </List>
      <SearchInbox className={searchInbox} setSearch={setSearch} />
    </Paper>
  );
};

export default Inbox;
