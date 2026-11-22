import React, { useState } from 'react';
import { Box, Button, MenuItem, TextField } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

export default function LocalNamePicker({
  species,
  value,
  names,
  disabled,
  onChange,
  onAdd,
}) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');
  const choices = [...new Set([...names, value].filter(Boolean))];
  const add = () => {
    const name = draft.trim();
    if (!name) return;
    onAdd(name);
    setDraft('');
    setAdding(false);
  };
  return (
    <Box style={{ minWidth: 230, maxWidth: 320 }}>
      <TextField
        select
        fullWidth
        variant="outlined"
        size="small"
        label="Local name"
        value={value}
        disabled={disabled}
        SelectProps={{ displayEmpty: true }}
        InputLabelProps={{ shrink: true }}
        inputProps={{
          'aria-label': 'Local name for ' + species.scientific_name,
        }}
        onChange={(event) => onChange(event.target.value)}
      >
        <MenuItem value="">
          <em>Use catalog name</em>
        </MenuItem>
        {choices.map((name) => (
          <MenuItem key={name} value={name}>
            {name}
          </MenuItem>
        ))}
      </TextField>
      {adding ? (
        <Box mt={1}>
          <TextField
            autoFocus
            fullWidth
            size="small"
            variant="outlined"
            label="New local name"
            value={draft}
            disabled={disabled}
            inputProps={{ maxLength: 255, 'aria-label': 'New local name' }}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                add();
              }
            }}
          />
          <Button
            size="small"
            color="primary"
            disabled={disabled || !draft.trim()}
            onClick={add}
          >
            Add
          </Button>
          <Button
            size="small"
            onClick={() => {
              setAdding(false);
              setDraft('');
            }}
          >
            Cancel
          </Button>
        </Box>
      ) : (
        <Button
          size="small"
          color="primary"
          startIcon={<AddIcon />}
          disabled={disabled}
          onClick={() => setAdding(true)}
        >
          Add local name
        </Button>
      )}
    </Box>
  );
}
