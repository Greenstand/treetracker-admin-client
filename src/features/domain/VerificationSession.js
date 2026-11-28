import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import { Alert, Autocomplete } from '@material-ui/lab';
import { useHistory, useLocation } from 'react-router-dom';
import { useDomainData } from './DomainContext';
import { QueryState, dateTime, Status } from './shared';
import SessionMap from './SessionMap';
import SessionProject from './SessionProject';
import GrowerAccount from './GrowerAccount';

export function VerificationSessionPicker({ sessionId, disabled }) {
  const history = useHistory(),
    location = useLocation();
  const [open, setOpen] = useState(false),
    [search, setSearch] = useState('');
  const [sessionSearch, setSessionSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setSessionSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);
  const query = useDomainData(
    '/sessions',
    { search: sessionSearch, size: 25, sort: 'start_time', direction: 'desc' },
    open
  );
  const change = (id) => {
    const params = new URLSearchParams(location.search);
    if (id) params.set('sessionId', id);
    else params.delete('sessionId');
    history.push({ pathname: location.pathname, search: params.toString() });
    setOpen(false);
  };
  return (
    <>
      <Button
        variant="outlined"
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        {sessionId ? 'Change session' : 'Verify a session'}
      </Button>
      {sessionId && (
        <Button disabled={disabled} onClick={() => change('')}>
          All sessions
        </Button>
      )}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Choose a session to verify</DialogTitle>
        <DialogContent style={{ minHeight: 300 }}>
          <Typography gutterBottom>
            Search by grower, organization, project or complete session UUID.
          </Typography>
          <QueryState query={query} />
          <Autocomplete
            inputValue={search}
            options={query.data?.rows || []}
            loading={query.isFetching}
            filterOptions={(options) => options}
            getOptionLabel={(row) =>
              [
                row.grower_name || 'Grower unavailable',
                row.organization_name,
                dateTime(row.start_time || row.first_capture),
                row.id,
              ].join(' · ')
            }
            onInputChange={(event, value, reason) => {
              if (reason === 'input' || reason === 'clear') setSearch(value);
            }}
            onChange={(event, value) => {
              if (value) change(value.id);
            }}
            renderOption={(row) => (
              <Box>
                <Typography>
                  {row.grower_name || 'Grower unavailable'} ·{' '}
                  {row.organization_name}
                </Typography>
                <Typography variant="caption" display="block">
                  {row.id}
                </Typography>
                <Typography variant="caption">
                  {dateTime(row.start_time || row.first_capture)} UTC ·{' '}
                  {row.capture_count} captures · {row.pending} pending
                </Typography>
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                autoFocus
                label="Search sessions"
                variant="outlined"
                margin="normal"
              />
            )}
          />
          <Button onClick={() => setOpen(false)}>Cancel</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function VerificationSessionSummary({ sessionId }) {
  const query = useDomainData(
    '/sessions',
    { sessionId, size: 25 },
    Boolean(sessionId)
  );
  const [map, setMap] = useState(false),
    [project, setProject] = useState(false),
    [profile, setProfile] = useState(false);
  useEffect(() => setProfile(false), [sessionId]);
  if (!sessionId) return null;
  const row = query.data?.rows?.[0];
  const total = Number(row?.capture_count || 0),
    reviewed = Number(row?.approved || 0) + Number(row?.rejected || 0);
  return (
    <Paper variant="outlined" style={{ marginBottom: 16 }}>
      <Box p={3}>
        <Typography variant="h6">Session verification</Typography>
        <Typography variant="caption" color="textSecondary">
          Session ID
        </Typography>
        <Typography
          variant="body2"
          style={{
            overflowWrap: 'anywhere',
            userSelect: 'all',
            fontFamily: 'monospace',
          }}
        >
          {sessionId}
        </Typography>
        <QueryState query={query} />
        {query.isSuccess && !row && (
          <Typography>Session is unavailable in this organization.</Typography>
        )}
        {row && (
          <>
            {!row.organization_id && (
              <Alert severity="warning">
                This session is unassigned. Allocate it to an organization from
                the grower profile before approving its captures.
              </Alert>
            )}
            <Box mt={2}>
              <Box
                display="flex"
                alignItems="center"
                flexWrap="wrap"
                style={{ gap: 8 }}
              >
                <Typography>
                  {row.grower_name || 'Grower unavailable'}
                </Typography>
                {row.grower_account_id && (
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => setProfile(true)}
                  >
                    Grower profile
                  </Button>
                )}
              </Box>
              {profile && row.grower_account_id && (
                <GrowerAccount
                  growerId={row.grower_account_id}
                  organizationId={row.organization_id || undefined}
                  onClose={() => setProfile(false)}
                />
              )}
              <Typography variant="body2">
                {row.organization_name} · {row.project_name || 'No project'}
              </Typography>
            </Box>
            <Box my={2}>
              <Status value={row.review_status} />
              <Typography variant="body2">
                {total.toLocaleString()} total · {row.pending} pending
              </Typography>
              <Typography variant="body2">
                {row.approved} approved · {row.rejected} rejected
                {Number(row.unknown) > 0
                  ? ' · ' + row.unknown + ' status unavailable'
                  : ''}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={total ? (reviewed / total) * 100 : 0}
                aria-label="Session review progress"
              />
              <Typography variant="caption">
                {reviewed} / {total} reviewed · entire session
              </Typography>
            </Box>
            <Typography variant="body2">
              Start: {dateTime(row.first_capture || row.start_time)} UTC
            </Typography>
            <Typography variant="body2">
              End: {dateTime(row.last_capture)} UTC
            </Typography>
            <Typography variant="body2">
              Capture span:{' '}
              {row.duration_minutes == null
                ? 'Unavailable'
                : Math.round(Number(row.duration_minutes)) + ' min'}
            </Typography>
            <Typography variant="body2">
              Area:{' '}
              {row.area_sq_m == null
                ? 'Unavailable'
                : Number(row.area_sq_m).toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  }) +
                  ' m² / ' +
                  Number(row.area_acres).toFixed(2) +
                  ' acres'}
            </Typography>
            <Button size="small" onClick={() => setProject(true)}>
              Manage session project
            </Button>
            {project && (
              <SessionProject session={row} onClose={() => setProject(false)} />
            )}
            <Button size="small" onClick={() => setMap(true)}>
              Preview session map
            </Button>
            {map && <SessionMap session={row} onClose={() => setMap(false)} />}
          </>
        )}
      </Box>
    </Paper>
  );
}
