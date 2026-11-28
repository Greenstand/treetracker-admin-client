import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import OrganizationGrowers from './OrganizationGrowers';
import { useDomainData } from './DomainContext';
import { domainRequest, errorMessage } from './api';
import {
  DomainPage,
  DataTable,
  OrganizationName,
  Status,
  dateTime,
} from './shared';
function OrganizationEditor({ organization, onClose, onSaved }) {
  const [draft, setDraft] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    logo_url: '',
    ...organization,
  });
  const [error, setError] = useState(''),
    [saving, setSaving] = useState(false);
  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await domainRequest(
        '/organizations' + (organization?.id ? '/' + organization.id : ''),
        {
          method: organization?.id ? 'PATCH' : 'POST',
          data: draft,
        }
      );
      onSaved();
    } catch (failure) {
      setError(errorMessage(failure));
      setSaving(false);
    }
  };
  return (
    <Dialog open fullWidth maxWidth="md" onClose={saving ? undefined : onClose}>
      <form onSubmit={save}>
        <DialogTitle>
          {organization?.id ? 'Edit organization' : 'Add organization'}
        </DialogTitle>
        <DialogContent dividers>
          {error && (
            <Box mb={3}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          <Grid container spacing={4}>
            {[
              ['name', 'Organization name'],
              ['email', 'Email'],
              ['phone', 'Phone'],
              ['website', 'Website'],
              ['logo_url', 'Logo URL'],
            ].map(([key, label]) => (
              <Grid item xs={12} key={key}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label={label}
                  required={key === 'name'}
                  type={
                    key === 'email'
                      ? 'email'
                      : ['website', 'logo_url'].includes(key)
                      ? 'url'
                      : 'text'
                  }
                  value={draft[key] || ''}
                  onChange={(event) =>
                    setDraft({ ...draft, [key]: event.target.value })
                  }
                />
              </Grid>
            ))}
          </Grid>
          {organization?.id && (
            <OrganizationGrowers organizationId={organization.id} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save organization'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
export default function Organizations({ navigation }) {
  const [search, setSearch] = useState(''),
    [page, setPage] = useState(0),
    [size, setSize] = useState(25);
  const [sort, setSort] = useState('name'),
    [direction, setDirection] = useState('asc'),
    [editor, setEditor] = useState(null),
    [notice, setNotice] = useState('');
  const query = useDomainData(
    '/organizations',
    {
      search,
      page,
      size,
      sort,
      direction,
    },
    true,
    true
  );
  const columns = [
    {
      field: 'name',
      label: 'Organization',
      render: (row) => (
        <Button onClick={() => setEditor(row)}>
          <OrganizationName row={row} />
        </Button>
      ),
    },
    { field: 'email', label: 'Email' },
    { field: 'phone', label: 'Phone', sortable: false },
    { field: 'project_count', label: 'Projects', sortable: false },
    {
      field: 'active',
      label: 'Status',
      sortable: false,
      render: (row) => <Status value={row.active ? 'Active' : 'Inactive'} />,
    },
    {
      field: 'created_at',
      label: 'Created (UTC)',
      render: (row) => dateTime(row.created_at),
    },
  ];
  return (
    <DomainPage
      title="Organizations"
      selectOrganization={false}
      actions={
        <Button
          color="primary"
          variant="contained"
          onClick={() => setEditor({})}
        >
          Add organization
        </Button>
      }
    >
      {navigation}
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
          size="small"
          variant="outlined"
          label="Search organization, email or phone"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(0);
          }}
        />
      </Box>
      <DataTable
        {...{
          query,
          columns,
          page,
          setPage,
          size,
          setSize,
          sort,
          setSort,
          direction,
          setDirection,
        }}
      />
      {editor && (
        <OrganizationEditor
          organization={editor}
          onClose={() => setEditor(null)}
          onSaved={() => {
            setEditor(null);
            setNotice('Organization saved.');
            query.refetch();
          }}
        />
      )}
    </DomainPage>
  );
}
