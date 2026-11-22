import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useLocation } from 'react-router-dom';
import { useDomain, useDomainData } from './DomainContext';
import { domainRequest, errorMessage } from './api';
import { DomainPage, DataTable, QueryState, Status } from './shared';
function SpeciesEditor({ species, onClose, onSaved }) {
  const [draft, setDraft] = useState({
    scientific_name: '',
    description: '',
    morphology: '',
    reference_url: '',
    is_default: true,
    is_hidden: false,
    ...species,
  });
  const [error, setError] = useState(''),
    [saving, setSaving] = useState(false);
  const field = (key) => ({
    value: draft[key] ?? '',
    onChange: (event) => setDraft({ ...draft, [key]: event.target.value }),
  });
  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await domainRequest('/species' + (species?.id ? '/' + species.id : ''), {
        method: species?.id ? 'PATCH' : 'POST',
        data: draft,
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
        <DialogTitle>
          {species?.id ? 'Edit species' : 'Add species'}
        </DialogTitle>
        <DialogContent dividers>
          {error && (
            <Box mb={3}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          <Grid container spacing={4}>
            {[
              ['scientific_name', 'Scientific name'],
              ['morphology', 'Morphology'],
              ['reference_url', 'Reference URL'],
            ].map(([key, label]) => (
              <Grid item xs={12} key={key}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label={label}
                  required={key === 'scientific_name'}
                  type={key === 'reference_url' ? 'url' : 'text'}
                  {...field(key)}
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                multiline
                minRows={3}
                label="Description"
                {...field('description')}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                label="Include in default list"
                control={
                  <Checkbox
                    color="primary"
                    checked={draft.is_default}
                    onChange={(event) =>
                      setDraft({ ...draft, is_default: event.target.checked })
                    }
                  />
                }
              />
              <FormControlLabel
                label="Hidden from new selections"
                control={
                  <Checkbox
                    color="primary"
                    checked={draft.is_hidden}
                    onChange={(event) =>
                      setDraft({ ...draft, is_hidden: event.target.checked })
                    }
                  />
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button disabled={saving} onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={saving}
            type="submit"
            color="primary"
            variant="contained"
          >
            {saving ? 'Saving…' : 'Save species'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
export function AdminSpecies() {
  const [search, setSearch] = useState(''),
    [page, setPage] = useState(0),
    [size, setSize] = useState(25);
  const [includeHidden, setIncludeHidden] = useState(false),
    [editor, setEditor] = useState(null),
    [notice, setNotice] = useState('');
  const query = useDomainData('/species', {
    search,
    page,
    size,
    includeHidden: String(includeHidden),
  });
  const columns = [
    { field: 'scientific_name', label: 'Scientific name' },
    { field: 'common_name', label: 'Common names' },
    { field: 'morphology', label: 'Morphology' },
    {
      field: 'is_default',
      label: 'Default list',
      render: (row) => (row.is_default ? 'Yes' : 'No'),
    },
    {
      field: 'is_hidden',
      label: 'Visibility',
      render: (row) => (
        <Status value={row.is_hidden ? 'Hidden' : 'Available'} />
      ),
    },
  ];
  return (
    <DomainPage
      title="Herbarium"
      selectOrganization={false}
      actions={
        <Button
          color="primary"
          variant="contained"
          onClick={() => setEditor({})}
        >
          Add species
        </Button>
      }
    >
      {notice && (
        <Box mb={3}>
          <Alert severity="success" onClose={() => setNotice('')}>
            {notice}
          </Alert>
        </Box>
      )}
      <Box mb={4} display="flex" style={{ gap: 16 }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          label="Search scientific or common name"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(0);
          }}
        />
        <FormControlLabel
          style={{ whiteSpace: 'nowrap' }}
          label="Show hidden"
          control={
            <Checkbox
              checked={includeHidden}
              onChange={(event) => {
                setIncludeHidden(event.target.checked);
                setPage(0);
              }}
              color="primary"
            />
          }
        />
      </Box>
      <DataTable
        {...{ query, columns, page, setPage, size, setSize }}
        onRow={setEditor}
      />
      {editor && (
        <SpeciesEditor
          species={editor}
          onClose={() => setEditor(null)}
          onSaved={() => {
            setEditor(null);
            setNotice('Species saved.');
            query.refetch();
          }}
        />
      )}
    </DomainPage>
  );
}
export function OrganizationSpecies() {
  const { organizationId, permissions: memberPermissions } = useDomain(),
    location = useLocation();
  const [projectId, setProjectId] = useState(
    new URLSearchParams(location.search).get('projectId') || ''
  );
  const [search, setSearch] = useState(''),
    [page, setPage] = useState(0),
    [size, setSize] = useState(25);
  const [selected, setSelected] = useState({}),
    [dirty, setDirty] = useState(false),
    [error, setError] = useState(''),
    [saving, setSaving] = useState(false),
    [notice, setNotice] = useState('');
  const projects = useDomainData(
    '/projects',
    { size: 100 },
    Boolean(organizationId)
  );
  const selection = useDomainData(
    '/species-selection',
    { projectId: projectId || undefined },
    Boolean(organizationId)
  );
  const catalog = useDomainData(
    '/species',
    { search, page, size },
    Boolean(organizationId)
  );
  useEffect(() => {
    setProjectId(new URLSearchParams(location.search).get('projectId') || '');
  }, [location.search]);
  useEffect(() => {
    setDirty(false);
    setNotice('');
    setError('');
    setPage(0);
  }, [organizationId, projectId]);
  useEffect(() => {
    if (selection.data) {
      setSelected(
        Object.fromEntries(
          selection.data.rows.map((row) => [
            row.species_id,
            row.local_name || '',
          ])
        )
      );
      setDirty(false);
    }
  }, [selection.data]);
  const change = (id, value) => {
    setSelected((current) => ({ ...current, [id]: value }));
    setDirty(true);
    setNotice('');
  };
  const toggle = (id, checked) => {
    if (checked) change(id, '');
    else {
      setSelected((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
      setDirty(true);
    }
  };
  const save = async (inherit) => {
    setSaving(true);
    setError('');
    try {
      await domainRequest('/species-selection', {
        method: 'PUT',
        data: {
          organizationId,
          projectId: projectId || undefined,
          species: inherit
            ? []
            : Object.entries(selected).map(([species_id, local_name]) => ({
                species_id,
                local_name,
              })),
        },
      });
      await selection.refetch();
      setNotice(
        inherit ? 'Inherited list restored.' : 'Species selection saved.'
      );
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setSaving(false);
    }
  };
  const columns = [
    {
      field: 'selected',
      label: 'Selected',
      render: (row) => (
        <Checkbox
          color="primary"
          inputProps={{ 'aria-label': 'Select ' + row.scientific_name }}
          checked={Object.prototype.hasOwnProperty.call(selected, row.id)}
          onChange={(event) => toggle(row.id, event.target.checked)}
        />
      ),
    },
    { field: 'scientific_name', label: 'Scientific name' },
    { field: 'common_name', label: 'Common names' },
    {
      field: 'local_name',
      label: 'Local name',
      render: (row) => (
        <TextField
          variant="outlined"
          size="small"
          disabled={!Object.prototype.hasOwnProperty.call(selected, row.id)}
          label={'Local name for ' + row.scientific_name}
          value={selected[row.id] || ''}
          inputProps={{ maxLength: 255 }}
          onChange={(event) => change(row.id, event.target.value)}
        />
      ),
    },
  ];
  return (
    <DomainPage title="Organization species management">
      {!organizationId ? (
        <Alert severity="info">
          Choose an organization to manage its species selection.
        </Alert>
      ) : (
        <>
          <Box
            mb={4}
            display="flex"
            alignItems="center"
            flexWrap="wrap"
            style={{ gap: 16 }}
          >
            <TextField
              select
              variant="outlined"
              size="small"
              label="Selection scope"
              value={projectId}
              style={{ minWidth: 260 }}
              onChange={(event) => setProjectId(event.target.value)}
            >
              <MenuItem value="">Organization</MenuItem>
              {(projects.data?.rows || []).map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </TextField>
            <Typography color="textSecondary">
              Using {selection.data?.source || '…'} ·{' '}
              {Object.keys(selected).length} species
            </Typography>
            <Button
              color="primary"
              variant="contained"
              disabled={
                saving ||
                !dirty ||
                selection.isError ||
                !memberPermissions?.includes('manage_species')
              }
              onClick={() => save(false)}
            >
              Save selection
            </Button>
            <Button
              disabled={
                saving ||
                selection.isError ||
                !memberPermissions?.includes('manage_species')
              }
              onClick={() => save(true)}
            >
              {projectId ? 'Use organization/default list' : 'Use default list'}
            </Button>
          </Box>
          <QueryState query={selection} />
          {error && (
            <Box mb={3}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          {notice && (
            <Box mb={3}>
              <Alert severity="success">{notice}</Alert>
            </Box>
          )}
          <Box mb={4}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Search species"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(0);
              }}
            />
          </Box>
          <DataTable
            query={catalog}
            {...{ columns, page, setPage, size, setSize }}
          />
        </>
      )}
    </DomainPage>
  );
}
