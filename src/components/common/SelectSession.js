import React, { useContext } from 'react';
import { TextField, MenuItem } from '@material-ui/core';
import { AppContext } from 'context/AppContext';
import { ALL_SESSIONS, SESSION_NOT_SET } from 'models/Filter';

function SelectSession({ sessionId, defaultSessions, handleSelection }) {
  const { sessionList } = useContext(AppContext);
  console.log('Sessions--- ', sessionList);

  const defaultList = defaultSessions
    ? defaultSessions
    : [
        {
          id: ALL_SESSIONS,
          name: 'All',
          value: 'All',
        },
        // all captures require a session so not sure this is needed
        {
          id: SESSION_NOT_SET,
          name: 'Not Set',
          value: 'Not Set',
        },
      ];

  const handleChange = (e) => {
    const session = [...defaultList, ...sessionList].find(
      (o) => o.id === e.target.value
    );
    handleSelection(session);
  };

  return (
    <TextField
      select
      data-testid="session-dropdown"
      htmlFor="session"
      id="session"
      label="Session"
      name="Session"
      value={sessionId}
      onChange={handleChange}
    >
      {[...defaultList, ...sessionList].map((session) => (
        <MenuItem
          data-testid="session-item"
          key={session.id}
          value={session.id}
        >
          {session.name}
        </MenuItem>
      ))}
    </TextField>
  );
}

export default SelectSession;
