import React, { useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useQueryClient } from '@tanstack/react-query';
import { useDomain, useDomainData } from './DomainContext';
import { domainRequest, errorMessage } from './api';
import { DataTable, QueryState, dateTime, safeUrl } from './shared';
import GrowerAccount from './GrowerAccount';

export default function ProjectGrowers({ project, onClose }) {
  const domain = useDomain(),
    cache = useQueryClient();
  const [page, setPage] = useState(0),
    [size, setSize] = useState(25),
    [search, setSearch] = useState('');
  const [historyPage, setHistoryPage] = useState(0),
    [change, setChange] = useState(null),
    [reason, setReason] = useState(''),
    [grower, setGrower] = useState(null);
  const [saving, setSaving] = useState(false),
    [error, setError] = useState(''),
    [notice, setNotice] = useState('');
  const attempt = useRef({ key: '', id: '' });
  const scope = { organizationId: project.organization_id };
  const query = useDomainData(
    '/projects/' + project.id + '/growers',
    { ...scope, search, page, size },
    true,
    true
  );
  const history = useDomainData(
    '/projects/' + project.id + '/grower-history',
    { ...scope, page: historyPage, size: 25 },
    true,
    true
  );
  const canManage = domain.permissions?.includes('manage_projects');
  const save = async () => {
    setSaving(true);
    setError('');
    const payload = {
      ...scope,
      action: change.assigned ? 'remove' : 'assign',
      joined_at: change.joined_at,
      reason,
    };
    const key = JSON.stringify({ grower: change.id, ...payload });
    if (attempt.current.key !== key)
      attempt.current = { key, id: crypto.randomUUID() };
    try {
      await domainRequest('/projects/' + project.id + '/growers/' + change.id, {
        method: 'POST',
        data: { ...payload, requestId: attempt.current.id },
      });
      setNotice(
        (change.assigned ? 'Removed ' : 'Assigned ') +
          (change.name || 'grower') +
          '. Change recorded in the audit trail.'
      );
      setChange(null);
      setReason('');
      attempt.current = { key: '', id: '' };
      setHistoryPage(0);
      await cache.invalidateQueries({ queryKey: ['admin-domain'] });
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setSaving(false);
    }
  };
  const columns = [
    {
      field: 'image',
      label: '',
      sortable: false,
      render: (row) => (
        <Avatar src={safeUrl(row.image_url)} alt={row.name || 'Grower'} />
      ),
    },
    {
      field: 'name',
      label: 'Grower',
      sortable: false,
      render: (row) => (
        <Button onClick={() => setGrower(row.id)}>
          {row.name || 'View grower'}
        </Button>
      ),
    },
    { field: 'phone', label: 'Phone', sortable: false },
    {
      field: 'membership',
      label: 'Project membership',
      sortable: false,
      render: (row) =>
        row.assigned
          ? 'Assigned · ' + dateTime(row.joined_at)
          : row.left_at
          ? 'Removed · ' + dateTime(row.left_at)
          : 'Not assigned',
    },
    {
      field: 'action',
      label: '',
      sortable: false,
      render: (row) => (
        <Button
          disabled={
            !canManage ||
            saving ||
            (!row.assigned && (!row.eligible || project.status !== 'active'))
          }
          onClick={() => {
            setChange(row);
            setReason('');
            setError('');
          }}
        >
          {row.assigned ? 'Remove from project' : 'Assign to project'}
        </Button>
      ),
    },
  ];
  return (
    <Dialog open fullWidth maxWidth="lg" onClose={saving ? undefined : onClose}>
      <DialogTitle>Project growers · {project.name}</DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          A grower can be assigned to several projects in their organization.
          Removing a membership keeps historical sessions and captures
          unchanged.
        </Typography>
        <Typography variant="caption" display="block">
          Only organization members are eligible for new assignments.
          Session-only links do not grant membership.
        </Typography>
        {notice && <Alert severity="success">{notice}</Alert>}
        <Box my={2}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            label="Search grower name, phone or email"
            value={search}
            onKeyDown={(event) => {
              if (event.key === 'Enter') event.preventDefault();
            }}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(0);
            }}
          />
        </Box>
        <DataTable {...{ query, columns, page, setPage, size, setSize }} />
        <Box mt={4}>
          <Typography variant="h6">Assignment trail</Typography>
          <Typography variant="caption">
            New changes record who, when, action and reason. Existing
            memberships retain their dates; earlier actors are not inferred.
          </Typography>
          <QueryState query={history} />
          {history.isSuccess && !history.data?.rows?.length && (
            <Typography>No assignment changes recorded yet.</Typography>
          )}
          {(history.data?.rows || []).map((row) => (
            <Box key={row.id} py={2} borderBottom="1px solid #ddd">
              <Typography>
                {row.action === 'assign' ? 'Assigned' : 'Removed'} ·{' '}
                {row.grower_name || row.grower_account_id}
              </Typography>
              <Typography variant="body2">
                {dateTime(row.created_at)} UTC · {row.actor_name} ·{' '}
                {row.source === 'organization_transfer'
                  ? 'Organization transfer'
                  : 'Project management'}
              </Typography>
              <Typography variant="body2">{row.reason}</Typography>
            </Box>
          ))}
          <Button
            disabled={!historyPage}
            onClick={() => setHistoryPage(historyPage - 1)}
          >
            Newer changes
          </Button>
          <Button
            disabled={!history.data?.hasNext}
            onClick={() => setHistoryPage(historyPage + 1)}
          >
            Older changes
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button disabled={saving} onClick={onClose}>
          Close
        </Button>
      </DialogActions>
      {grower && (
        <GrowerAccount
          growerId={grower}
          organizationId={project.organization_id}
          onClose={() => setGrower(null)}
        />
      )}
      <Dialog
        open={Boolean(change)}
        onClose={saving ? undefined : () => setChange(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {change?.assigned
            ? 'Remove grower from project'
            : 'Assign grower to project'}
        </DialogTitle>
        <DialogContent>
          {error && <Alert severity="error">{error}</Alert>}
          <Typography>
            {change?.name || 'Grower'} · {project.name}
          </Typography>
          <TextField
            fullWidth
            required
            multiline
            minRows={2}
            margin="normal"
            variant="outlined"
            label="Reason (recorded in the trail)"
            value={reason}
            inputProps={{ maxLength: 1000 }}
            disabled={saving}
            onChange={(event) => setReason(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button disabled={saving} onClick={() => setChange(null)}>
            Cancel
          </Button>
          <Button
            color="primary"
            variant="contained"
            disabled={saving || !reason.trim()}
            onClick={save}
          >
            {saving
              ? 'Saving…'
              : 'Confirm ' + (change?.assigned ? 'removal' : 'assignment')}
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}
