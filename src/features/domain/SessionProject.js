import React, { useEffect, useRef, useState } from 'react';
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
import { useDomain, useDomainData } from './DomainContext';
import { domainRequest, errorMessage } from './api';
import { dateTime, QueryState } from './shared';
export default function SessionProject({ session, onClose }) {
  const domain = useDomain(),
    cache = useQueryClient();
  const [page, setPage] = useState(0),
    [search, setSearch] = useState(''),
    [draft, setDraft] = useState(undefined),
    [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false),
    [error, setError] = useState(''),
    [notice, setNotice] = useState('');
  const attempt = useRef({ key: '', id: '' });
  const query = useDomainData(
    '/sessions/' + session.id + '/project',
    { organizationId: session.organization_id, page, size: 25 },
    true,
    true
  );
  const row = query.data;
  const projects = useDomainData(
    '/projects',
    { organizationId: row?.organization_id, search, size: 100 },
    Boolean(row),
    true
  );
  const canManage = domain.permissions?.includes('manage_projects');
  const currentProjectId = row?.project_id,
    currentProjectName = row?.project_name,
    allocationVersion = row?.allocation_event_id;
  useEffect(() => {
    if (currentProjectId !== undefined)
      setDraft(
        currentProjectId
          ? {
              id: currentProjectId,
              name: currentProjectName || currentProjectId,
            }
          : null
      );
  }, [currentProjectId, currentProjectName, allocationVersion]);
  const save = async () => {
    setSaving(true);
    setError('');
    setNotice('');
    const payload = {
      organizationId: row.organization_id,
      project_id: draft?.id || null,
      expected_project_id: row.project_id,
      expected_event_id: row.allocation_event_id,
      reason,
    };
    const key = JSON.stringify(payload);
    if (attempt.current.key !== key)
      attempt.current = { key, id: crypto.randomUUID() };
    try {
      await domainRequest('/sessions/' + session.id + '/project', {
        method: 'POST',
        data: { ...payload, requestId: attempt.current.id },
      });
      setNotice('Session allocation saved and recorded in the trail.');
      setReason('');
      setPage(0);
      attempt.current = { key: '', id: '' };
      await cache.invalidateQueries({ queryKey: ['admin-domain'] });
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setSaving(false);
    }
  };
  return (
    <Dialog open fullWidth maxWidth="md" onClose={saving ? undefined : onClose}>
      <DialogTitle>Session project allocation</DialogTitle>
      <DialogContent dividers>
        <Typography
          variant="body2"
          style={{ overflowWrap: 'anywhere', fontFamily: 'monospace' }}
        >
          {session.id}
        </Typography>
        <QueryState query={query} />
        {error && <Alert severity="error">{error}</Alert>}
        {notice && <Alert severity="success">{notice}</Alert>}
        {row && (
          <>
            <Box my={2}>
              <Typography>Organization: {row.organization_name}</Typography>
              <Typography>
                Current project:{' '}
                {row.project_name || row.project_id || 'Unassigned'}
              </Typography>
            </Box>
            <Alert severity="info">
              Correct the app’s session allocation here. This changes project
              reporting for this session and its captures. Grower project
              memberships and capture verification remain unchanged.
            </Alert>
            <Box my={3}>
              <QueryState query={projects} />
              <Autocomplete
                options={(projects.data?.rows || []).filter(
                  (project) => project.status === 'active'
                )}
                value={draft || null}
                getOptionSelected={(a, b) => a.id === b.id}
                getOptionLabel={(project) => project.name || ''}
                filterOptions={(options) => options}
                disabled={!canManage || saving || query.isFetching}
                onInputChange={(event, value, type) => {
                  if (type === 'input' || type === 'clear') setSearch(value);
                }}
                onChange={(event, value) => setDraft(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Allocate to project"
                    helperText="Search active projects in this organization. Clear the selection to leave the session unassigned."
                    variant="outlined"
                  />
                )}
              />
              <Button
                size="small"
                disabled={!canManage || saving}
                onClick={() => setDraft(null)}
              >
                Clear project allocation
              </Button>
            </Box>
            <TextField
              fullWidth
              multiline
              minRows={2}
              required
              id="session-project-reason"
              label="Reason for correction"
              variant="outlined"
              value={reason}
              inputProps={{ maxLength: 1000 }}
              disabled={!canManage || saving}
              onChange={(event) => setReason(event.target.value)}
            />
            <Box mt={4}>
              <Typography variant="h6">Allocation trail</Typography>
              <Typography variant="caption">
                Each correction records the previous and new project, actor,
                time and reason. The initial app allocation is retained as the
                previous value on the first correction; its actor is not
                inferred.
              </Typography>
              {!row.history?.length && (
                <Typography>
                  No administrative corrections recorded yet.
                </Typography>
              )}
              {(row.history || []).map((event) => (
                <Box key={event.id} py={2} borderBottom="1px solid #ddd">
                  <Typography>
                    {event.previous_project_name ||
                      event.previous_project_id ||
                      'Unassigned'}{' '}
                    →{' '}
                    {event.new_project_name ||
                      event.new_project_id ||
                      'Unassigned'}
                  </Typography>
                  <Typography variant="body2">
                    {dateTime(event.created_at)} UTC · {event.actor_name}
                  </Typography>
                  <Typography variant="body2">{event.reason}</Typography>
                </Box>
              ))}
              <Button
                disabled={!page || saving}
                onClick={() => setPage(page - 1)}
              >
                Newer changes
              </Button>
              <Button
                disabled={!row.hasNext || saving}
                onClick={() => setPage(page + 1)}
              >
                Older changes
              </Button>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button disabled={saving} onClick={onClose}>
          Close
        </Button>
        <Button
          color="primary"
          variant="contained"
          disabled={
            !canManage ||
            saving ||
            query.isFetching ||
            query.isError ||
            !row ||
            draft === undefined ||
            (draft?.id || null) === row.project_id ||
            !reason.trim()
          }
          onClick={save}
        >
          {saving ? 'Saving…' : 'Save allocation'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
