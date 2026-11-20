import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useDomain, useDomainData } from './DomainContext';
import { domainRequest, errorMessage } from './api';
import { DomainPage, DataTable, Status } from './shared';
const permissions = [
  ['verify_captures', 'Verify captures'],
  ['manage_projects', 'Add and edit projects'],
  ['manage_species', 'Manage species selections'],
  ['view_contracts', 'View contracts'],
  ['manage_members', 'Manage organization user permissions'],
];
function PermissionEditor({ user, onClose, onSaved }) {
  const { organizationId } = useDomain();
  const [selected, setSelected] = useState(user.permissions || []),
    [error, setError] = useState(''),
    [saving, setSaving] = useState(false);
  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await domainRequest('/organization-users/' + user.id, {
        method: 'PUT',
        data: {
          organizationId,
          permissions: selected,
          updated_at: user.updated_at,
        },
      });
      onSaved();
    } catch (failure) {
      setError(errorMessage(failure));
      setSaving(false);
    }
  };
  return (
    <Dialog open fullWidth maxWidth="sm" onClose={saving ? undefined : onClose}>
      <form onSubmit={save}>
        <DialogTitle>Permissions for {user.name}</DialogTitle>
        <DialogContent dividers>
          {error && (
            <Box mb={3}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          {permissions.map(([value, label]) => (
            <Box key={value}>
              <FormControlLabel
                label={label}
                control={
                  <Checkbox
                    color="primary"
                    checked={selected.includes(value)}
                    onChange={(event) =>
                      setSelected(
                        event.target.checked
                          ? [...selected, value]
                          : selected.filter(
                              (permission) => permission !== value
                            )
                      )
                    }
                  />
                }
              />
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button disabled={saving} onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save permissions'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
export default function OrganizationUsers() {
  const domain = useDomain();
  const [page, setPage] = useState(0),
    [size, setSize] = useState(25),
    [search, setSearch] = useState(''),
    [editor, setEditor] = useState(null),
    [notice, setNotice] = useState('');
  const query = useDomainData(
    '/organization-users',
    { page, size },
    Boolean(domain.organizationId)
  );
  const canManage = domain.permissions?.includes('manage_members');
  const q = search.trim().toLowerCase();
  const filtered = {
    ...query,
    data: query.data
      ? {
          ...query.data,
          rows: query.data.rows.filter((row) =>
            [row.name, row.username, row.email].some((value) =>
              String(value || '')
                .toLowerCase()
                .includes(q)
            )
          ),
        }
      : undefined,
  };
  const columns = [
    { field: 'name', label: 'Name' },
    { field: 'email', label: 'Email' },
    {
      field: 'enabled',
      label: 'Account',
      render: (row) => <Status value={row.enabled ? 'Enabled' : 'Disabled'} />,
    },
    {
      field: 'permissions',
      label: 'Assigned permissions',
      render: (row) =>
        (row.permissions || [])
          .map((value) => permissions.find((p) => p[0] === value)?.[1] || value)
          .join(', ') || 'No assigned permissions',
    },
    ...(canManage
      ? [
          {
            field: 'edit',
            label: 'Permissions',
            render: (row) => (
              <Button onClick={() => setEditor(row)}>Manage</Button>
            ),
          },
        ]
      : []),
  ];
  return (
    <DomainPage title="Organization users">
      {!domain.organizationId ? (
        <Alert severity="info">Choose an organization to view its users.</Alert>
      ) : (
        <>
          <Typography paragraph color="textSecondary">
            Users appear after their organization binding is approved.
            Organization administrators retain their Keycloak role permissions.
          </Typography>
          {notice && (
            <Box mb={3}>
              <Alert severity="success" onClose={() => setNotice('')}>
                {notice}
              </Alert>
            </Box>
          )}
          <Box mb={4}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Filter users on this page"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </Box>
          <DataTable
            query={filtered}
            {...{ columns, page, setPage, size, setSize }}
          />
          {editor && (
            <PermissionEditor
              user={editor}
              onClose={() => setEditor(null)}
              onSaved={() => {
                setEditor(null);
                setNotice('Permissions saved.');
                query.refetch();
              }}
            />
          )}
        </>
      )}
    </DomainPage>
  );
}
