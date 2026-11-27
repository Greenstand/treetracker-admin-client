import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
  FormControlLabel,
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
    [allocate, setAllocate] = useState(false),
    [project, setProject] = useState(null),
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
  const projects = useDomainData(
    '/projects',
    { organizationId: target?.id, size: 100 },
    Boolean(target),
    true
  );
  const preview = useDomainData(
    '/growers/' + grower.id + '/allocation-preview',
    { organizationId: target?.id, projectId: project?.id },
    Boolean(target),
    true
  );
  useEffect(() => setAllocate(false), [preview.data?.version]);
  const move = async () => {
    setSaving(true);
    setError('');
    const body = {
      organization_id: target.id,
      updated_at: grower.updated_at,
      reason: reason.trim(),
      allocate_unassigned: allocate,
      project_id: allocate ? project?.id || null : null,
      expected_allocation: allocate ? preview.data?.version : undefined,
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
      <DialogTitle>Grower organization and capture allocation</DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          Current organization: {grower.organization_name || 'Unassigned'}
        </Typography>
        <Alert severity="info">
          This changes current membership and ends active project assignments in
          the previous organization. Existing organization/project ownership is
          never silently changed. Only a Greenstand admin can correct existing
          allocations. Ownerless data can be explicitly allocated below;
          contracts and payments stay unchanged. Every change is logged.
        </Alert>
        {error && (
          <Box mt={2}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}
        <Box mt={3}>
          <Autocomplete
            options={(organizations.data?.rows || []).filter(
              (x) => x.active !== false
            )}
            value={target}
            getOptionSelected={(a, b) => a.id === b.id}
            getOptionLabel={(x) => x.name || ''}
            onInputChange={(event, value) => setSearch(value)}
            onChange={(event, value) => {
              setTarget(value);
              setProject(null);
              setAllocate(false);
            }}
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
        {target && (
          <Box mt={3}>
            <QueryState query={preview} />
            {preview.data && (
              <Alert severity="warning">
                {preview.data.sessions} unassigned sessions,{' '}
                {preview.data.rawCaptures} raw captures and{' '}
                {preview.data.processedCaptures} processed captures are
                eligible. Raw and processed counts may describe the same
                observations. Already allocated data and tree/token-linked
                assets are excluded. Confirming below transfers this ownerless
                data to {target.name}
                {project ? ` / ${project.name}` : ''}.
              </Alert>
            )}
            <FormControlLabel
              control={
                <Checkbox
                  checked={allocate}
                  disabled={
                    saving ||
                    !preview.data ||
                    preview.isFetching ||
                    preview.isError
                  }
                  onChange={(e) => setAllocate(e.target.checked)}
                />
              }
              label="Allocate eligible unassigned captures and sessions"
            />
            <Autocomplete
              options={(projects.data?.rows || []).filter(
                (x) => x.status === 'active'
              )}
              value={project}
              getOptionSelected={(a, b) => a.id === b.id}
              getOptionLabel={(x) => x.name || ''}
              onChange={(e, value) => {
                setProject(value);
                setAllocate(false);
              }}
              disabled={saving}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Destination project (optional)"
                  helperText="Only unassigned data is allocated. Clear to keep it at organization level. Changing this choice requires confirmation again."
                />
              )}
            />
          </Box>
        )}
        <Box mt={3}>
          <TextField
            fullWidth
            multiline
            minRows={3}
            variant="outlined"
            id="grower-transfer-reason"
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
              {row.capture_allocation && (
                <Typography variant="body2">
                  Allocated {row.capture_allocation.session_count || 0} sessions
                  and {row.capture_allocation.capture_count || 0} processed
                  captures
                  {row.capture_allocation.project_id
                    ? ` to project ${shortId(
                        row.capture_allocation.project_id
                      )}`
                    : ''}
                  .
                </Typography>
              )}
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
          disabled={
            saving ||
            !target ||
            !reason.trim() ||
            (target.id === grower.organization_id && !allocate) ||
            (allocate &&
              (!preview.data || preview.isFetching || preview.isError))
          }
          onClick={move}
        >
          {saving
            ? 'Saving…'
            : allocate
            ? 'Save and allocate captures'
            : 'Save membership only'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
