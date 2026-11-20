import React, { useState } from 'react';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Typography,
} from '@material-ui/core';
import { useDomainData } from './DomainContext';
import { DomainPage, DataTable, Status, dateTime } from './shared';
export default function SaasUsers() {
  const [page, setPage] = useState(0),
    [size, setSize] = useState(25),
    [search, setSearch] = useState(''),
    [selected, setSelected] = useState(null);
  const query = useDomainData('/saas/users', { page, size });
  const q = search.trim().toLowerCase();
  const filtered = {
    ...query,
    data: query.data
      ? {
          ...query.data,
          rows: query.data.rows.filter((row) =>
            [
              row.name,
              row.username,
              row.email,
              row.organization_name,
              row.subscription?.plan,
              row.subscription?.status,
            ].some((value) =>
              String(value || '')
                .toLowerCase()
                .includes(q)
            )
          ),
        }
      : undefined,
  };
  const columns = [
    {
      field: 'name',
      label: 'Name',
      render: (row) => (
        <Button onClick={() => setSelected(row)}>
          {row.name || row.username}
        </Button>
      ),
    },
    { field: 'email', label: 'Email' },
    { field: 'organization_name', label: 'Organization' },
    {
      field: 'plan',
      label: 'Plan',
      render: (row) => row.subscription?.plan || '—',
    },
    {
      field: 'subscription',
      label: 'Subscription',
      render: (row) => <Status value={row.subscription?.status} />,
    },
    {
      field: 'enabled',
      label: 'Account',
      render: (row) => <Status value={row.enabled ? 'Enabled' : 'Disabled'} />,
    },
  ];
  return (
    <DomainPage title="SaaS users" selectOrganization={false}>
      <Box mb={4}>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          label="Filter users on this page"
          helperText="Lists Keycloak users assigned org-admin-saas. Subscription details belong to their organization."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </Box>
      <DataTable
        query={filtered}
        {...{ columns, page, setPage, size, setSize }}
      />
      {selected && (
        <Dialog open fullWidth maxWidth="sm" onClose={() => setSelected(null)}>
          <DialogTitle>{selected.name || selected.username}</DialogTitle>
          <DialogContent dividers>
            <Typography>Login {selected.username}</Typography>
            <Typography>{selected.email}</Typography>
            <Typography>{selected.organization_name}</Typography>
            <Typography>
              Registered {dateTime(selected.registered_at)} UTC
            </Typography>
            <Box my={3}>
              <Status value={selected.subscription?.status} />
            </Box>
            <Typography>
              Plan {selected.subscription?.plan || 'Unavailable'}
            </Typography>
            <Typography>
              Current period ends{' '}
              {dateTime(selected.subscription?.current_period_end)} UTC
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelected(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </DomainPage>
  );
}
