import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@material-ui/core';
import { Alert, Autocomplete } from '@material-ui/lab';
import { useQueryClient } from '@tanstack/react-query';
import { useDomainData } from './DomainContext';
import { domainRequest, errorMessage } from './api';
import { dateTime, QueryState, shortId } from './shared';
export default function GrowerTransfer({ grower, onClose, onMoved }) {
  const [search, setSearch] = useState(''),
    [target, setTarget] = useState(null),
    [reason, setReason] = useState(''),
    [saving, setSaving] = useState(false),
    [error, setError] = useState('');
  const request = useRef({ key: '', id: '' }),
    client = useQueryClient();
  const organizations = useDomainData(
    '/organizations',
    { search, size: 100 },
    true,
    true
  );
  const history = useDomainData(
    '/growers/' + grower.id + '/organization-history',
    {},
    true,
    true
  );
  const move = async () => {
    setSaving(true);
    setError('');
    const body = {
      organization_id: target.id,
      updated_at: grower.updated_at,
      reason: reason.trim(),
    };
    const key = JSON.stringify(body);
    if (request.current.key !== key)
      request.current = { key, id: crypto.randomUUID() };
    try {
      await domainRequest('/growers/' + grower.id + '/organization', {
        method: 'POST',
        data: { ...body, requestId: request.current.id },
      });
      await client.invalidateQueries({ queryKey: ['admin-domain'] });
      onMoved();
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setSaving(false);
    }
  };
  return (
    <Dialog open fullWidth maxWidth="sm" onClose={saving ? undefined : onClose}>
      <DialogTitle>Move grower to another organization</DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          Current organization: {grower.organization_name || 'Unassigned'}
        </Typography>
        <Alert severity="info">
          This changes current membership and ends active project assignments in
          the previous organization. Historical captures, sessions, contracts
          and payments retain their recorded ownership. Every move is logged.
        </Alert>
        {error && (
          <Box mt={2}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}
        <Box mt={3}>
          <Autocomplete
            options={(organizations.data?.rows || []).filter(
              (x) => x.id !== grower.organization_id
            )}
            value={target}
            getOptionSelected={(a, b) => a.id === b.id}
            getOptionLabel={(x) => x.name || ''}
            onInputChange={(event, value) => setSearch(value)}
            onChange={(event, value) => setTarget(value)}
            disabled={saving}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Destination organization"
                helperText="Type to search active organizations"
              />
            )}
          />
        </Box>
        <Box mt={3}>
          <TextField
            fullWidth
            multiline
            minRows={3}
            variant="outlined"
            label="Reason for move"
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            inputProps={{ maxLength: 1000 }}
            disabled={saving}
          />
        </Box>
        <Box mt={4}>
          <Typography variant="h6">Transfer history</Typography>
          <QueryState query={history} />
          {history.data?.rows.length === 0 && (
            <Typography color="textSecondary">
              No transfers recorded.
            </Typography>
          )}
          {history.data?.rows.map((row) => (
            <Box key={row.id} my={2}>
              <Typography>
                {row.previous_organization_name || 'Unassigned'} →{' '}
                {row.new_organization_name || shortId(row.new_organization_id)}
              </Typography>
              <Typography variant="caption">
                {dateTime(row.created_at)} UTC ·{' '}
                {row.administrator_name || shortId(row.administrator_id)}
              </Typography>
              <Typography variant="body2">{row.reason}</Typography>
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button disabled={saving} onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={saving || !target || !reason.trim()}
          onClick={move}
        >
          {saving ? 'Moving…' : 'Move grower'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
