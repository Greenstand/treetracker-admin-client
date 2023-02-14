import React, { useContext } from 'react';
import { TextField, MenuItem } from '@material-ui/core';
import { AppContext } from 'context/AppContext';
import { SESSION_NOT_SET } from 'models/Filter';

function SelectSession({ orgId, defaultSessions, handleSelection }) {
  const { sessionList } = useContext(AppContext);
  console.log("Sessions--- ", sessionList);

  const defaultOrgList = defaultSessions
    ? defaultSessions
    : [
        {
          id: SESSION_NOT_SET,
          name: 'Not Set',
          value: 'Not Set',
        },
      ];

  const handleChange = (e) => {
    const session = [...defaultOrgList, ...sessionList].find(
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
      label="Sessionn"
      name="Session"
      value={orgId}
      onChange={handleChange}
    >
      {[...defaultOrgList, ...sessionList].map((session) => (
        <MenuItem data-testid="org-item" key={session.id} value={session.id}>
          {session.name}
        </MenuItem>
      ))}
    </TextField>
  );
}

export default SelectSession;
