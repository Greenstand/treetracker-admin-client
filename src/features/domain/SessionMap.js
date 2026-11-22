import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useDomainData } from './DomainContext';
import { QueryState, shortId } from './shared';

function BoundaryMap({ geometry }) {
  const container = useRef(null);
  const [error, setError] = useState('');
  const [tilesUnavailable, setTilesUnavailable] = useState(false);
  useEffect(() => {
    let map,
      cancelled = false;
    import('leaflet')
      .then((L) => {
        if (cancelled) return;
        map = L.map(container.current, { scrollWheelZoom: false });
        L.tileLayer(
          process.env.REACT_APP_MAP_TILE_URL ||
            'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            attribution:
              process.env.REACT_APP_MAP_ATTRIBUTION ||
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
          }
        )
          .on('tileerror', () => {
            if (!cancelled) setTilesUnavailable(true);
          })
          .addTo(map);
        const boundary = L.geoJSON(geometry, {
          style: {
            color: '#568b22',
            weight: 3,
            fillColor: '#86b832',
            fillOpacity: 0.15,
          },
          pointToLayer: (feature, latlng) =>
            L.circleMarker(latlng, { radius: 6, color: '#568b22' }),
        }).addTo(map);
        map.fitBounds(boundary.getBounds(), { padding: [35, 35], maxZoom: 18 });
        map.invalidateSize();
      })
      .catch(() => {
        if (!cancelled) setError('Could not load the map preview.');
      });
    return () => {
      cancelled = true;
      if (map) map.remove();
    };
  }, [geometry]);
  return (
    <>
      {error && <Alert severity="error">{error}</Alert>}
      {tilesUnavailable && (
        <Alert severity="info">
          Background tiles are unavailable. The session outline is still shown.
        </Alert>
      )}
      <div
        ref={container}
        role="region"
        aria-label="Session boundary map"
        style={{
          height: 420,
          width: '100%',
          background: '#f1f3ef',
          borderRadius: 4,
        }}
      />
    </>
  );
}

export default function SessionMap({ session, onClose }) {
  const query = useDomainData('/sessions/' + session.id + '/map');
  return (
    <Dialog open fullWidth maxWidth="md" onClose={onClose}>
      <DialogTitle>Session map · {shortId(session.id)}</DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          {session.organization_name} ·{' '}
          {session.grower_name || 'Grower unavailable'}
        </Typography>
        <QueryState query={query} />
        {query.data?.geometry ? (
          <BoundaryMap geometry={query.data.geometry} />
        ) : (
          query.isSuccess && (
            <Alert severity="info">
              No usable location data is available for this session.
            </Alert>
          )
        )}
        <Box mt={2}>
          <Typography variant="caption" color="textSecondary">
            Approximate outer envelope from{' '}
            {query.data?.source === 'segments'
              ? 'recorded session segments'
              : 'capture locations'}
            . This is a preview, not a surveyed boundary or a planted-area
            measurement. Individual captures are not loaded into this map.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
