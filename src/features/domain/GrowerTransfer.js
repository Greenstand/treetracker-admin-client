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
    [includeExisting, setIncludeExisting] = useState(false),
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
    {
      organizationId: target?.id,
      projectId: project?.id,
      includeExisting: String(includeExisting),
    },
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
      reallocate_existing: allocate && includeExisting,
      project_id: allocate ? project?.id || null : null,
      expected_allocation: allocate ? preview.data?.version : undefined,
    };
    const key = JSON.stringify(body);
    if (request.current.key !== key)
      request.current = { key, id: crypto.randomUUID() };
    try {
      const result = await domainRequest(
        '/growers/' + grower.id + '/organization',
        {
          method: 'POST',
          data: { ...body, requestId: request.current.id },
        }
      );
      await client.invalidateQueries({ queryKey: ['admin-domain'] });
      onMoved({ ...result, membershipOnly: !allocate });
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
          allocations. Select whether to allocate only ownerless data or
          explicitly reassign existing observations below; contracts and
          payments stay unchanged. Every change is logged.
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
              setIncludeExisting(false);
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
                {preview.data.sessions} eligible sessions,{' '}
                {preview.data.rawCaptures} raw captures and{' '}
                {preview.data.processedCaptures} processed captures are
                eligible. Raw and processed counts may describe the same
                observations.{' '}
                {includeExisting
                  ? 'Existing allocations are included by explicit choice.'
                  : 'Already allocated data is excluded.'}{' '}
                Tree/token-linked assets are always excluded. Confirming below
                transfers the previewed data to {target.name}
                {project ? ` / ${project.name}` : ''}.
              </Alert>
            )}
            <FormControlLabel
              control={
                <Checkbox
                  checked={includeExisting}
                  disabled={saving}
                  onChange={(e) => {
                    setIncludeExisting(e.target.checked);
                    setAllocate(false);
                  }}
                />
              }
              label="Also reassign existing organization/project allocations (Greenstand admin)"
            />
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
              label="Confirm transfer of the previewed captures and sessions"
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
                  helperText="Clear to allocate at organization level. Existing allocations change only if explicitly included above. Changing this choice requires confirmation again."
                />
              )}
            />
          </Box>
        )}
        {includeExisting && !allocate && (
          <Alert severity="warning">
            Confirm the previewed transfer before saving. Selecting “also
            reassign” alone does not transfer sessions or captures.
          </Alert>
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
            (includeExisting && !allocate) ||
            (project && !allocate) ||
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
