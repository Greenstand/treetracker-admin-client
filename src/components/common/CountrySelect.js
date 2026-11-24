import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';

import COUNTRIES from '../../common/countries';

export default function CountrySelect({
  id,
  name,
  label,
  value,
  onChange,
  className,
}) {
  // entity.location is free text, so a stored value may not be in the list.
  const options =
    value && !COUNTRIES.includes(value) ? [value, ...COUNTRIES] : COUNTRIES;

  return (
    <Autocomplete
      id={id}
      options={options}
      value={value || null}
      onChange={(event, selected) =>
        onChange({ target: { name, value: selected || '' } })
      }
      autoHighlight
      className={className}
      renderInput={(params) => (
        <TextField {...params} label={label} variant="outlined" fullWidth />
      )}
    />
  );
}
