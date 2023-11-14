import React, { useContext, useEffect, useState } from 'react';
import { TextField, MenuItem } from '@material-ui/core';
import { AppContext } from 'context/AppContext';
import { ALL_SESSIONS /* SESSION_NOT_SET */ } from 'models/Filter';
import { getDateTimeStringLocale } from 'common/locale';

function SelectSession({ sessionId, defaultSessions, handleSelection }) {
  const { sessionList } = useContext(AppContext);
  const defaultList = defaultSessions?.length
    ? defaultSessions
    : [
        {
          id: ALL_SESSIONS,
          name: 'All',
          value: 'All',
        },
      ];
  const [sessions, setSessions] = useState(defaultList);

  useEffect(() => {
    // format the session data for the dropdown
    const sesh = sessionList.map((s) => ({
      id: s.id,
      name: `${getDateTimeStringLocale(s.created_at)} : ${s.wallet} : ${
        s.organization
      }`,
      value: s.id,
    }));
    setSessions((s) => [...s, ...sesh]);
  }, [sessionList]);

  const handleChange = (e) => {
    const session = [...sessions].find((o) => o.id === e.target.value);
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
      {[...sessions].map((session) => (
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
