import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useHistory } from 'react-router-dom';
import { domainRequest, errorMessage } from './api';
import { useDomain, useDomainData } from './DomainContext';
import { DomainPage, DataTable, Status, safeUrl } from './shared';

const emptyProject = {
  name: '',
  code: '',
  status: 'active',
  description: '',
  country: '',
  region: '',
  starts_on: '',
  ends_on: '',
  target_trees: '',
  target_captures: '',
  logo_url: '',
  hero_image_url: '',
};
function ProjectEditor({ project, onClose, onSaved }) {
  const { organizationId, platform } = useDomain();
  const organizations = useDomainData(
    '/organizations',
    { size: 100 },
    true,
    platform
  );
  const [draft, setDraft] = useState({
    ...emptyProject,
    ...project,
    organization_id: project?.organization_id || organizationId || '',
    starts_on: project?.starts_on?.slice(0, 10) || '',
    ends_on: project?.ends_on?.slice(0, 10) || '',
  });
  const [error, setError] = useState(''),
    [saving, setSaving] = useState(false);
  const field = (name) => ({
    value: draft[name] ?? '',
    onChange: (event) => setDraft({ ...draft, [name]: event.target.value }),
  });
  const owner = organizations.data?.rows?.find(
    (row) => row.id === draft.organization_id
  );
  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await domainRequest('/projects' + (project?.id ? '/' + project.id : ''), {
        method: project?.id ? 'PATCH' : 'POST',
        data: draft,
      });
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
          {project?.id ? 'Edit project' : 'Add project'}
        </DialogTitle>
        <DialogContent dividers>
          {error && (
            <Box mb={3}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                required
                label="Organization"
                variant="outlined"
                disabled={!platform || Boolean(project?.id)}
                {...field('organization_id')}
              >
                {(organizations.data?.rows || []).map((row) => (
                  <MenuItem key={row.id} value={row.id}>
                    {row.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {[
              ['name', 'Project name'],
              ['code', 'Code'],
              ['country', 'Country'],
              ['region', 'Region'],
            ].map(([key, label]) => (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  fullWidth
                  label={label}
                  variant="outlined"
                  required={['name', 'code'].includes(key)}
                  {...field(key)}
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="About this project"
                variant="outlined"
                {...field('description')}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="Status"
                variant="outlined"
                {...field('status')}
              >
                {['active', 'suspended', 'archived'].map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {['starts_on', 'ends_on'].map((key, index) => (
              <Grid item xs={12} sm={4} key={key}>
                <TextField
                  fullWidth
                  type="date"
                  label={index ? 'End date' : 'Start date'}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  {...field(key)}
                />
              </Grid>
            ))}
            {[
              ['target_trees', 'Tree target'],
              ['target_captures', 'Capture target'],
            ].map(([key, label]) => (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  fullWidth
                  type="number"
                  label={label}
                  inputProps={{ min: 0, step: 1, max: 2147483647 }}
                  variant="outlined"
                  {...field(key)}
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="url"
                label="Project logo URL"
                variant="outlined"
                helperText="Leave blank to use the organization logo."
                {...field('logo_url')}
              />
            </Grid>
            {safeUrl(
              draft.logo_url ||
                owner?.logo_url ||
                project?.organization_logo_url
            ) && (
              <Grid item xs={12}>
                <img
                  src={safeUrl(
                    draft.logo_url ||
                      owner?.logo_url ||
                      project?.organization_logo_url
                  )}
                  alt="Project logo"
                  style={{ height: 60, maxWidth: '100%', objectFit: 'contain' }}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="url"
                label="Hero image URL"
                variant="outlined"
                {...field('hero_image_url')}
              />
            </Grid>
            {safeUrl(draft.hero_image_url) && (
              <Grid item xs={12}>
                <img
                  src={safeUrl(draft.hero_image_url)}
                  alt="Project hero"
                  style={{ width: '100%', maxHeight: 220, objectFit: 'cover' }}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button disabled={saving} onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={saving || !draft.organization_id}
          >
            {saving ? 'Saving…' : 'Save project'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
export default function Projects() {
  const history = useHistory(),
    domain = useDomain();
  const [page, setPage] = useState(0),
    [size, setSize] = useState(25),
    [sort, setSort] = useState('name'),
    [direction, setDirection] = useState('asc');
  const [search, setSearch] = useState(''),
    [editor, setEditor] = useState(null),
    [notice, setNotice] = useState('');
  const query = useDomainData('/projects', {
    page,
    size,
    sort,
    direction,
    search,
  });
  const columns = [
    {
      field: 'name',
      label: 'Project',
      render: (row) => (
        <Button
          disabled={!domain.permissions?.includes('manage_projects')}
          onClick={() => setEditor(row)}
        >
          {row.name}
        </Button>
      ),
    },
    { field: 'code', label: 'Code' },
    { field: 'organization_name', label: 'Organization' },
    { field: 'country', label: 'Country' },
    {
      field: 'status',
      label: 'Status',
      render: (row) => <Status value={row.status} />,
    },
    { field: 'target_trees', label: 'Tree target' },
    { field: 'target_captures', label: 'Capture target' },
    {
      field: 'species',
      label: 'Species',
      sortable: false,
      render: (row) => (
        <Button
          onClick={() => {
            if (domain.platform) domain.setOrganizationId(row.organization_id);
            history.push('/organization-species?projectId=' + row.id);
          }}
        >
          Manage species
        </Button>
      ),
    },
  ];
  return (
    <DomainPage
      title="Projects"
      actions={
        <Button
          color="primary"
          variant="contained"
          disabled={!domain.permissions?.includes('manage_projects')}
          onClick={() => setEditor({})}
        >
          Add project
        </Button>
      }
    >
      {notice && (
        <Box mb={3}>
          <Alert onClose={() => setNotice('')} severity="success">
            {notice}
          </Alert>
        </Box>
      )}
      <Box mb={4}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          label="Search organization, code, project or country"
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
      <Box mt={3}>
        <Typography variant="caption" color="textSecondary">
          Project image URLs can be changed in the editor.
        </Typography>
      </Box>
      {editor && (
        <ProjectEditor
          key={editor.id || 'new'}
          project={editor}
          onClose={() => setEditor(null)}
          onSaved={() => {
            setEditor(null);
            setNotice('Project saved.');
            query.refetch();
          }}
        />
      )}
    </DomainPage>
  );
}
