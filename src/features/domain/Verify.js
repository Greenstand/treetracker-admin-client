import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Tooltip,
  LinearProgress,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@material-ui/core';
import { Alert, Autocomplete } from '@material-ui/lab';
import PersonIcon from '@material-ui/icons/Person';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import LocationIcon from '@material-ui/icons/LocationOn';
import MapIcon from '@material-ui/icons/Map';
import { useQueryClient } from '@tanstack/react-query';
import GrowerAccount from './GrowerAccount';
import { speciesLabel } from './speciesNames';
import CaptureTagPicker from './CaptureTagPicker';
import SessionMap from './SessionMap';
import {
  VerificationSessionPicker,
  VerificationSessionSummary,
} from './VerificationSession';
import { useLocation, useHistory } from 'react-router-dom';
import { useDomain, useDomainData } from './DomainContext';
import { domainRequest, errorMessage } from './api';
import {
  DomainPage,
  QueryState,
  Status,
  dateTime,
  safeUrl,
  shortId,
} from './shared';
export default function Verify() {
  const cache = useQueryClient(),
    history = useHistory();
  const [largeImages, setLargeImages] = useState(false),
    [grower, setGrower] = useState(null),
    [mapSession, setMapSession] = useState(null);
  const anchor = useRef(null);
  const domain = useDomain(),
    location = useLocation();
  const sessionId = new URLSearchParams(location.search).get('sessionId') || '';
  const [page, setPage] = useState(0),
    [size, setSize] = useState(25),
    [status, setStatus] = useState('unprocessed');
  const [search, setSearch] = useState(''),
    [startDate, setStartDate] = useState(''),
    [endDate, setEndDate] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    startDate: '',
    endDate: '',
  });
  const [selected, setSelected] = useState({}),
    [image, setImage] = useState(null);
  const [decision, setDecision] = useState('approved'),
    [morphology, setMorphology] = useState('seedling'),
    [age, setAge] = useState(0);
  const [species, setSpecies] = useState(null),
    [speciesSearch, setSpeciesSearch] = useState(''),
    [tags, setTags] = useState([]),
    [pendingTag, setPendingTag] = useState(''),
    [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false),
    [error, setError] = useState(''),
    [notice, setNotice] = useState('');
  const attempt = useRef({ key: '', id: '' });
  const query = useDomainData('/verification', {
    ...filters,
    sessionId: sessionId || undefined,
    status,
    page,
    size,
  });
  useEffect(() => {
    setPage(0);
    setSelected({});
    setNotice('');
  }, [domain.organizationId, sessionId, status, filters]);
  useEffect(() => setSelected({}), [query.data]);
  const rows = query.data?.rows || [],
    chosen = Object.values(selected);
  const tagRows = chosen.length ? chosen : rows;
  const tagOrgs = [
    ...new Set(tagRows.map((row) => row.organization_id).filter(Boolean)),
  ];
  const tagOrganizationId =
    domain.organizationId || (tagOrgs.length === 1 ? tagOrgs[0] : null);
  const tagProjects = [...new Set(tagRows.map((row) => row.project_id))];
  const tagProjectId = tagProjects.length === 1 ? tagProjects[0] : null;
  useEffect(() => {
    setTags([]);
    setPendingTag('');
  }, [tagOrganizationId]);
  const speciesProjects = [
    ...new Set(tagRows.map((row) => row.project_id || 'none')),
  ]
    .sort()
    .join(',');
  const catalog = useDomainData(
    '/species-choices',
    {
      organizationId: tagOrganizationId,
      projectIds: speciesProjects || undefined,
      search: speciesSearch,
    },
    decision === 'approved' && Boolean(tagOrganizationId),
    true
  );
  useEffect(() => {
    setSpecies(null);
    setSpeciesSearch('');
  }, [tagOrganizationId, speciesProjects]);
  const allowed = domain.permissions?.includes('verify_captures');
  const toggle = (row, checked, shiftKey = false) =>
    setSelected((current) => {
      const next = { ...current };
      const from = rows.findIndex((item) => item.id === anchor.current),
        to = rows.findIndex((item) => item.id === row.id);
      const range =
        shiftKey && from >= 0
          ? rows.slice(Math.min(from, to), Math.max(from, to) + 1)
          : [row];
      range
        .filter((item) => item.can_review)
        .forEach((item) => {
          if (checked) next[item.id] = item;
          else delete next[item.id];
        });
      anchor.current = row.id;
      return next;
    });
  const submit = async () => {
    setSaving(true);
    setError('');
    setNotice('');
    const payload = {
      organizationId: domain.organizationId,
      decision,
      captures: chosen.map((row) => ({
        id: row.id,
        updated_at: row.updated_at,
      })),
      morphology,
      age,
      species_id: species?.id,
      tags: [...tags, pendingTag].map((x) => x.trim()).filter(Boolean),
      rejection_reason: decision === 'rejected' ? reason : undefined,
    };
    const key = JSON.stringify(payload);
    if (attempt.current.key !== key)
      attempt.current = { key, id: crypto.randomUUID() };
    try {
      const result = await domainRequest('/verification', {
        method: 'POST',
        data: { ...payload, requestId: attempt.current.id },
      });
      setSelected({});
      attempt.current = { key: '', id: '' };
      setNotice(
        result.reviewed +
          ' capture(s) ' +
          decision +
          '.' +
          (decision === 'approved'
            ? ' Saved in the new model; tree matching is pending.'
            : '')
      );
      setMorphology('seedling');
      setAge(0);
      setSpecies(null);
      setSpeciesSearch('');
      setTags([]);
      setPendingTag('');
      setReason('');
      void query.refetch();
      void cache.invalidateQueries({
        queryKey: ['admin-domain'],
        predicate: (item) =>
          item.queryKey.includes('/sessions') ||
          item.queryKey.includes('/capture-tags'),
      });
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setSaving(false);
    }
  };
  return (
    <DomainPage title="Verify captures">
      <Box
        mb={3}
        display="flex"
        flexWrap="wrap"
        alignItems="center"
        style={{ gap: 12 }}
      >
        <VerificationSessionPicker sessionId={sessionId} disabled={saving} />
        <TextField
          select
          size="small"
          variant="outlined"
          label="Verification status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {[
            ['unprocessed', 'Awaiting verification'],
            ['approved', 'Approved'],
            ['rejected', 'Rejected'],
            ['all', 'All'],
          ].map(([value, label]) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          size="small"
          variant="outlined"
          label="Search grower, org or capture UUID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <TextField
          type="date"
          size="small"
          variant="outlined"
          label="Captured from (UTC)"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          type="date"
          size="small"
          variant="outlined"
          label="Captured to (UTC)"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Button
          variant="outlined"
          disabled={saving}
          onClick={() => setFilters({ search, startDate, endDate })}
        >
          Apply
        </Button>
        <Button
          disabled={saving}
          onClick={() => {
            setSearch('');
            setStartDate('');
            setEndDate('');
            setStatus('unprocessed');
            setFilters({ search: '', startDate: '', endDate: '' });
          }}
        >
          Reset filters
        </Button>
      </Box>
      {error && (
        <Box mb={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
      {notice && (
        <Box mb={2}>
          <Alert severity="success">{notice}</Alert>
        </Box>
      )}
      {!allowed && (
        <Alert severity="info">
          Your account does not have capture verification permission.
        </Alert>
      )}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <QueryState query={query} />
          <Box
            mb={2}
            display="flex"
            alignItems="center"
            flexWrap="wrap"
            style={{ gap: 12 }}
          >
            <Typography>
              {chosen.length} / {rows.length} on this page selected
            </Typography>
            <ButtonGroup size="small" aria-label="Image size">
              <Button
                variant={!largeImages ? 'contained' : 'outlined'}
                onClick={() => setLargeImages(false)}
              >
                Small images
              </Button>
              <Button
                variant={largeImages ? 'contained' : 'outlined'}
                onClick={() => setLargeImages(true)}
              >
                Large images
              </Button>
            </ButtonGroup>
            <Button
              disabled={saving || !allowed}
              onClick={() =>
                setSelected(
                  Object.fromEntries(
                    rows
                      .filter((row) => row.can_review)
                      .map((row) => [row.id, row])
                  )
                )
              }
            >
              Select page
            </Button>
            <Button disabled={saving} onClick={() => setSelected({})}>
              Select none
            </Button>
          </Box>
          {query.isSuccess && !rows.length && (
            <Alert severity="info">
              No captures match this organization, session and review filter.
            </Alert>
          )}
          <Typography variant="caption" color="textSecondary">
            Shift-click a checkbox to select a range. Selection applies to this
            page.
          </Typography>
          {saving && <LinearProgress aria-label="Saving verification" />}
          <Grid container spacing={2}>
            {rows.map((row) => (
              <Grid
                item
                xs={12}
                sm={largeImages ? 12 : 6}
                lg={largeImages ? 6 : 4}
                key={row.id}
              >
                <Card
                  variant="outlined"
                  style={
                    selected[row.id]
                      ? { border: '2px solid #79b320', background: '#f5faed' }
                      : {}
                  }
                >
                  <Box p={2}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Checkbox
                        color="primary"
                        checked={Boolean(selected[row.id])}
                        disabled={saving || !allowed || !row.can_review}
                        inputProps={{
                          'aria-label': 'Select capture ' + row.id,
                        }}
                        onChange={(e) =>
                          toggle(row, e.target.checked, e.nativeEvent.shiftKey)
                        }
                      />
                      <Typography variant="caption">
                        {shortId(row.id)}
                      </Typography>
                    </Box>
                    <Button
                      fullWidth
                      onClick={() => setImage(row)}
                      disabled={!safeUrl(row.image_url)}
                      style={{ padding: 0 }}
                      aria-label={'Enlarge capture ' + row.id}
                    >
                      {safeUrl(row.image_url) ? (
                        <img
                          src={safeUrl(row.image_url)}
                          loading="lazy"
                          alt={'Capture ' + shortId(row.id)}
                          style={{
                            width: '100%',
                            height: largeImages ? 360 : 220,
                            objectFit: 'contain',
                            background: '#f5f5f5',
                          }}
                        />
                      ) : (
                        <Typography>No image available</Typography>
                      )}
                    </Button>
                    <Box display="flex" justifyContent="center">
                      <Tooltip title="Grower details">
                        <span>
                          <IconButton
                            size="small"
                            aria-label={'Grower details for ' + row.id}
                            disabled={!row.grower_account_id}
                            onClick={() =>
                              setGrower({
                                id: row.grower_account_id,
                                organizationId: row.organization_id,
                              })
                            }
                          >
                            <PersonIcon color="primary" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Capture details">
                        <IconButton
                          size="small"
                          aria-label={'Capture details for ' + row.id}
                          onClick={() => setImage(row)}
                        >
                          <InfoIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Capture location">
                        <span>
                          <IconButton
                            size="small"
                            component="a"
                            aria-label={'Location for ' + row.id}
                            disabled={row.lat == null || row.lon == null}
                            href={
                              row.lat != null && row.lon != null
                                ? 'https://www.openstreetmap.org/?mlat=' +
                                  encodeURIComponent(row.lat) +
                                  '&mlon=' +
                                  encodeURIComponent(row.lon) +
                                  '#map=18/' +
                                  row.lat +
                                  '/' +
                                  row.lon
                                : undefined
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <LocationIcon color="primary" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Session map">
                        <IconButton
                          size="small"
                          aria-label={'Session map for ' + row.id}
                          onClick={() => setMapSession({ id: row.session_id })}
                        >
                          <MapIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    {!sessionId && (
                      <Button
                        size="small"
                        onClick={() =>
                          history.push('/verify?sessionId=' + row.session_id)
                        }
                      >
                        Verify this session
                      </Button>
                    )}
                    <Typography variant="body2">
                      {row.grower_name || 'Grower unavailable'}
                    </Typography>
                    <Typography variant="caption" display="block">
                      {row.organization_name} · {dateTime(row.captured_at)} UTC
                    </Typography>
                    <Status
                      value={
                        row.status === 'unprocessed'
                          ? 'Awaiting verification'
                          : row.status
                      }
                    />
                    {row.status === 'unprocessed' && !row.can_approve && (
                      <Typography
                        variant="caption"
                        display="block"
                        color="error"
                      >
                        Approval unavailable: missing account/device links or
                        already processed.
                      </Typography>
                    )}
                    {row.status === 'approved' && (
                      <Typography variant="caption" display="block">
                        {row.tree_id
                          ? 'Matched to tree ' + shortId(row.tree_id)
                          : row.processed_capture_id
                          ? 'Awaiting tree matching'
                          : 'Processed capture unavailable'}
                      </Typography>
                    )}
                    {row.rejection_reason && (
                      <Typography variant="caption" display="block">
                        {row.rejection_reason}
                      </Typography>
                    )}
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box
            mt={3}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <TextField
              select
              size="small"
              label="Per page"
              value={size}
              onChange={(e) => {
                setSize(Number(e.target.value));
                setPage(0);
              }}
            >
              {[25, 50, 100].map((x) => (
                <MenuItem value={x} key={x}>
                  {x}
                </MenuItem>
              ))}
            </TextField>
            <Box>
              <Button
                disabled={!page || saving}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Typography component="span">Page {page + 1}</Typography>
              <Button
                disabled={!query.data?.hasNext || saving}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box
            style={{
              position: 'sticky',
              top: 16,
              maxHeight: 'calc(100vh - 32px)',
              overflowY: 'auto',
            }}
          >
            <VerificationSessionSummary sessionId={sessionId} />
            <Paper variant="outlined">
              <Box p={3}>
                <Typography variant="h6">
                  Selected captures · {chosen.length}
                </Typography>
                <ButtonGroup fullWidth size="small">
                  <Button
                    variant={decision === 'approved' ? 'contained' : 'outlined'}
                    onClick={() => setDecision('approved')}
                    disabled={saving}
                  >
                    Approve
                  </Button>
                  <Button
                    variant={decision === 'rejected' ? 'contained' : 'outlined'}
                    onClick={() => setDecision('rejected')}
                    disabled={saving}
                  >
                    Reject
                  </Button>
                </ButtonGroup>
                {decision === 'approved' ? (
                  <>
                    <Box mt={3}>
                      <Typography>Morphology</Typography>
                      <RadioGroup
                        value={morphology}
                        onChange={(e) => setMorphology(e.target.value)}
                      >
                        {[
                          ['seedling', 'Seedling'],
                          ['direct_seeding', 'Direct seeding'],
                          ['pruned_tied', 'Pruned / tied (FMNR)'],
                        ].map(([value, label]) => (
                          <FormControlLabel
                            key={value}
                            value={value}
                            control={<Radio size="small" />}
                            label={label}
                            disabled={saving}
                          />
                        ))}
                      </RadioGroup>
                    </Box>
                    <Typography>Age</Typography>
                    <RadioGroup
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                    >
                      <FormControlLabel
                        value={0}
                        control={<Radio size="small" />}
                        label="New tree"
                        disabled={saving}
                      />
                      <FormControlLabel
                        value={2}
                        control={<Radio size="small" />}
                        label="Over two years"
                        disabled={saving}
                      />
                    </RadioGroup>
                    <Autocomplete
                      options={catalog.data?.rows || []}
                      noOptionsText="No allocated species match this selection"
                      value={species}
                      loading={catalog.isFetching}
                      getOptionSelected={(a, b) => a.id === b.id}
                      getOptionLabel={speciesLabel}
                      onInputChange={(event, value) => setSpeciesSearch(value)}
                      onChange={(event, value) => setSpecies(value)}
                      disabled={saving || !tagOrganizationId || catalog.isError}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Species (if known)"
                          error={catalog.isError}
                          helperText={
                            catalog.isError
                              ? errorMessage(catalog.error)
                              : !tagOrganizationId
                              ? 'Choose one organization to select a species.'
                              : 'Only species allocated to these captures are available.'
                          }
                          size="small"
                        />
                      )}
                    />
                    <Box mt={2}>
                      <CaptureTagPicker
                        organizationId={tagOrganizationId}
                        projectId={tagProjectId}
                        value={tags}
                        onChange={setTags}
                        onPendingChange={setPendingTag}
                        disabled={saving}
                      />
                    </Box>
                    {chosen.some((row) => !row.can_approve) && (
                      <Alert severity="info">
                        Some selected captures lack the metadata required for
                        approval. They can still be rejected.
                      </Alert>
                    )}
                  </>
                ) : (
                  <Box mt={3}>
                    <TextField
                      select
                      fullWidth
                      label="Common rejection reasons"
                      value=""
                      onChange={(e) => setReason(e.target.value)}
                      disabled={saving}
                    >
                      {[
                        'Not a tree',
                        'Not an approved tree',
                        'Blurry photo',
                        'Dead',
                        'Duplicate photo',
                        'Needs contact or review',
                      ].map((label) => (
                        <MenuItem key={label} value={label}>
                          {label}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      fullWidth
                      multiline
                      minRows={3}
                      variant="outlined"
                      label="Rejection reason"
                      required
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      disabled={saving}
                    />
                  </Box>
                )}
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={
                    saving ||
                    !allowed ||
                    !chosen.length ||
                    query.isFetching ||
                    (decision === 'rejected' && !reason.trim()) ||
                    (decision === 'approved' &&
                      chosen.some((row) => !row.can_approve))
                  }
                  onClick={submit}
                >
                  {saving
                    ? 'Saving…'
                    : 'Submit ' +
                      (decision === 'approved' ? 'approval' : 'rejection')}
                </Button>
                <Box mt={2}>
                  <Typography variant="caption" color="textSecondary">
                    Decisions are version-checked and logged. Approval does not
                    automatically associate a capture with a tree.
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>
      {grower && (
        <GrowerAccount
          growerId={grower.id}
          organizationId={grower.organizationId}
          onClose={() => setGrower(null)}
        />
      )}
      {mapSession && (
        <SessionMap session={mapSession} onClose={() => setMapSession(null)} />
      )}
      <Dialog
        open={Boolean(image)}
        onClose={() => setImage(null)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle style={{ overflowWrap: 'anywhere' }}>
          Capture {image?.id}
        </DialogTitle>
        <DialogContent>
          {image && (
            <img
              src={safeUrl(image.image_url)}
              alt="Selected capture"
              style={{ width: '100%', maxHeight: '75vh', objectFit: 'contain' }}
            />
          )}
          {image && (
            <Box mt={2}>
              <Typography>
                Grower: {image.grower_name || 'Unavailable'}
              </Typography>
              <Typography>Organization: {image.organization_name}</Typography>
              <Typography style={{ overflowWrap: 'anywhere' }}>
                Session: {image.session_id}
              </Typography>
              <Typography>
                Captured: {dateTime(image.captured_at)} UTC
              </Typography>
              <Typography>
                Coordinates: {image.lat ?? '—'}, {image.lon ?? '—'} · GPS
                accuracy:{' '}
                {image.gps_accuracy == null
                  ? 'Unavailable'
                  : image.gps_accuracy + ' m'}
              </Typography>
              <Typography>Note: {image.note || '—'}</Typography>
              <Typography style={{ overflowWrap: 'anywhere' }}>
                Device: {image.device_configuration_id || 'Unavailable'}
              </Typography>
              <Typography
                component="pre"
                variant="caption"
                style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
              >
                {image.extra_attributes
                  ? JSON.stringify(image.extra_attributes, null, 2)
                  : ''}
              </Typography>
            </Box>
          )}
          <Button onClick={() => setImage(null)}>Close</Button>
        </DialogContent>
      </Dialog>
    </DomainPage>
  );
}
