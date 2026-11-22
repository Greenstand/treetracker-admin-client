import React from 'react';
import { Box, IconButton, Tooltip } from '@material-ui/core';
import PublicIcon from '@material-ui/icons/Public';

export function speciesSources(species) {
  const sources = new Map();
  for (const value of [species.reference_url, species.description]) {
    for (const match of String(value || '').matchAll(
      /https?:\/\/[^\s<>"']+/g
    )) {
      try {
        const url = new URL(match[0]);
        if (url.username || url.password) continue;
        const herbarium = url.hostname === 'herbarium.treetracker.org';
        sources.set(url.href, {
          url: url.href,
          herbarium,
          label: herbarium ? 'Greenstand Herbarium' : url.hostname,
        });
      } catch {
        // A malformed reference is not a navigable source.
      }
    }
  }
  return [...sources.values()].sort(
    (a, b) => Number(b.herbarium) - Number(a.herbarium)
  );
}

export default function SpeciesSources({ species }) {
  const sources = speciesSources(species);
  if (!sources.length) return '—';
  return (
    <Box display="flex" alignItems="center">
      {sources.map((source) => (
        <Tooltip title={source.label} key={source.url}>
          <IconButton
            component="a"
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            aria-label={
              'Open ' + source.label + ' for ' + species.scientific_name
            }
            onClick={(event) => event.stopPropagation()}
          >
            {source.herbarium ? (
              <img
                src={process.env.PUBLIC_URL + '/logo_192x192.png'}
                alt="Greenstand"
                width="22"
                height="22"
              />
            ) : (
              <PublicIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      ))}
    </Box>
  );
}
