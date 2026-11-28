import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Tooltip,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import MapIcon from '@material-ui/icons/Map';
import SessionMap from './SessionMap';
import SessionProject from './SessionProject';
import GrowerAccount from './GrowerAccount';
import { useDomainData } from './DomainContext';
import {
  DomainPage,
  DataTable,
  QueryState,
  Status,
  dateTime,
  safeUrl,
  shortId,
} from './shared';
function SessionDetail({ session, onClose }) {
  const query = useDomainData('/sessions/' + session.id + '/captures');
  return (
    <Dialog open fullWidth maxWidth="lg" onClose={onClose}>
      <DialogTitle>
        {session.grower_name || 'Tracking session'} · {shortId(session.id)}
      </DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          {session.organization_name} · {session.project_name || 'No project'}
        </Typography>
        <Typography gutterBottom>
          {dateTime(session.first_capture || session.start_time)} —{' '}
          {dateTime(session.last_capture)} UTC
        </Typography>
        <Status value={session.review_status} />
        <QueryState query={query} />
        {query.data?.limited && (
          <Alert severity="info">
            Showing the first 1,000 captures in this session.
          </Alert>
        )}
        <Box my={4}>
          <Grid container spacing={3}>
            {(query.data?.rows || []).map((capture) => (
              <Grid key={capture.id} item xs={12} sm={6} md={3}>
                <Paper variant="outlined">
                  <Box p={3}>
                    {safeUrl(capture.image_url) && (
                      <img
                        src={safeUrl(capture.image_url)}
                        alt={'Capture ' + shortId(capture.id)}
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: 160,
                          objectFit: 'cover',
                        }}
                      />
                    )}
                    <Typography>{dateTime(capture.captured_at)} UTC</Typography>
                    <Status value={capture.status} />
                    {capture.lat != null && capture.lon != null && (
                      <Box mt={2}>
                        <Button
                          component="a"
                          target="_blank"
                          rel="noopener noreferrer"
                          href={
                            'https://www.openstreetmap.org/?mlat=' +
                            encodeURIComponent(capture.lat) +
                            '&mlon=' +
                            encodeURIComponent(capture.lon) +
                            '#map=17/' +
                            capture.lat +
                            '/' +
                            capture.lon
                          }
                        >
                          View location
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
export default function TrackingSessions() {
  const [page, setPage] = useState(0),
    [size, setSize] = useState(25),
    [sort, setSort] = useState('start_time'),
    [direction, setDirection] = useState('desc');
  const [growerId, setGrowerId] = useState(null);
  const [mapSession, setMapSession] = useState(null);
  const [projectSession, setProjectSession] = useState(null);
  const [search, setSearch] = useState(''),
    [selected, setSelected] = useState(null);
  const query = useDomainData('/sessions', {
    page,
    size,
    sort,
    direction,
    search,
  });
  const columns = [
    {
      field: 'map',
      label: 'Map',
      sortable: false,
      render: (row) => (
        <Tooltip title="Preview session area">
          <IconButton
            aria-label={'Preview map for session ' + row.id}
            size="small"
            onClick={() => setMapSession(row)}
          >
            <MapIcon color="primary" />
          </IconButton>
        </Tooltip>
      ),
    },
    {
      field: 'grower_name',
      label: 'Grower',
      render: (row) =>
        row.grower_account_id ? (
          <Button onClick={() => setGrowerId(row.grower_account_id)}>
            {row.grower_name || 'View grower account'}
          </Button>
        ) : (
          <Typography color="textSecondary">Grower unavailable</Typography>
        ),
    },
    { field: 'organization_name', label: 'Organization' },
    {
      field: 'project_name',
      label: 'Project',
      sortable: false,
      render: (row) => (
        <Button onClick={() => setProjectSession(row)}>
          {row.project_name || 'Assign project'}
        </Button>
      ),
    },
    {
      field: 'start_time',
      label: 'Start (UTC)',
      render: (row) => dateTime(row.start_time || row.first_capture),
    },
    {
      field: 'duration_minutes',
      label: 'Duration',
      render: (row) =>
        row.duration_minutes == null
          ? '—'
          : Math.round(row.duration_minutes) + ' min',
    },
    { field: 'capture_count', label: 'Captures' },
    {
      field: 'review_status',
      label: 'Review',
      sortable: false,
      render: (row) => <Status value={row.review_status} />,
    },
    {
      field: 'area_sq_m',
      label: 'Area',
      render: (row) =>
        row.area_sq_m == null
          ? 'Unavailable'
          : Number(row.area_sq_m).toLocaleString(undefined, {
              maximumFractionDigits: 0,
            }) +
            ' m² / ' +
            Number(row.area_acres).toFixed(2) +
            ' acres',
    },
    {
      field: 'verify',
      label: 'Verification',
      sortable: false,
      render: (row) => (
        <Box>
          <Button component={Link} to={'/verify?sessionId=' + row.id}>
            Verify session
          </Button>
          <Button size="small" onClick={() => setSelected(row)}>
            View captures
          </Button>
        </Box>
      ),
    },
  ];
  return (
    <DomainPage title="Tracking sessions">
      <Box mb={4}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          label="Search grower, organization, project or session UUID"
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
          Area covers recorded session segment polygons. Missing geometry is
          shown as unavailable.
        </Typography>
      </Box>
      {growerId && (
        <GrowerAccount growerId={growerId} onClose={() => setGrowerId(null)} />
      )}
      {projectSession && (
        <SessionProject
          session={projectSession}
          onClose={() => setProjectSession(null)}
        />
      )}
      {mapSession && (
        <SessionMap session={mapSession} onClose={() => setMapSession(null)} />
      )}
      {selected && (
        <SessionDetail session={selected} onClose={() => setSelected(null)} />
      )}
    </DomainPage>
  );
}
