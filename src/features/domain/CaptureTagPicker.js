import React, { useEffect, useState } from 'react';
import {
  Box,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { useDomainData } from './DomainContext';
import { QueryState } from './shared';
export default function CaptureTagPicker({
  organizationId,
  projectId,
  value,
  onChange,
  onPendingChange,
  disabled,
}) {
  const [input, setInput] = useState(''),
    [search, setSearch] = useState(''),
    [projectOnly, setProjectOnly] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setSearch(input), 250);
    return () => clearTimeout(timer);
  }, [input]);
  useEffect(() => {
    setInput('');
    setSearch('');
    setProjectOnly(false);
    onPendingChange('');
  }, [organizationId, projectId, onPendingChange]);
  const query = useDomainData(
    '/capture-tags',
    {
      organizationId,
      projectId: projectOnly ? projectId : undefined,
      search,
      size: 100,
    },
    Boolean(organizationId),
    true
  );
  return (
    <Box>
      <Autocomplete
        multiple
        forcePopupIcon
        openOnFocus
        freeSolo
        clearOnBlur={false}
        disabled={disabled || !organizationId}
        options={(query.data?.rows || []).map((tag) => tag.name)}
        filterOptions={(options) => options}
        value={value}
        inputValue={input}
        loading={query.isFetching}
        onInputChange={(event, text) => {
          setInput(text);
          onPendingChange(text);
        }}
        onChange={(event, tags) => {
          onChange(
            [
              ...new Map(
                tags.map((tag) => [tag.trim().toLowerCase(), tag.trim()])
              ).values(),
            ].filter(Boolean)
          );
          setInput('');
          onPendingChange('');
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            size="small"
            label="Additional tags"
            helperText={
              organizationId
                ? 'Choose an organization tag or type a new tag and press Enter.'
                : 'Choose an organization or select captures from one organization to use tags.'
            }
            inputProps={{ ...params.inputProps, maxLength: 100 }}
          />
        )}
      />
      {projectId && (
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={projectOnly}
              disabled={disabled || !organizationId}
              onChange={(event) => setProjectOnly(event.target.checked)}
            />
          }
          label="Suggest tags used in this project"
        />
      )}
      <Typography variant="caption" color="textSecondary">
        Tags belong to the organization. The project option narrows suggestions
        only.
      </Typography>
      {organizationId && <QueryState query={query} />}
    </Box>
  );
}
