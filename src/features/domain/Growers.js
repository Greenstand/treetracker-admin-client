import React, { useState } from 'react';
import { Avatar, Box, Button, TextField, Typography } from '@material-ui/core';
import { useDomainData } from './DomainContext';
import { DataTable, DomainPage, Status, dateTime, safeUrl } from './shared';
import GrowerAccount from './GrowerAccount';
export default function Growers() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0),
    [size, setSize] = useState(25);
  const [sort, setSort] = useState('registered_at'),
    [direction, setDirection] = useState('desc');
  const [growerId, setGrowerId] = useState(null);
  const query = useDomainData('/growers', {
    search,
    page,
    size,
    sort,
    direction,
  });
  const columns = [
    {
      field: 'name',
      label: 'Grower',
      render: (row) => (
        <Box display="flex" alignItems="center" style={{ gap: 12 }}>
          <Avatar
            src={safeUrl(row.image_url)}
            alt={[row.first_name, row.last_name].filter(Boolean).join(' ')}
          />
          <Button onClick={() => setGrowerId(row.id)}>
            {[row.first_name, row.last_name].filter(Boolean).join(' ') ||
              'View grower account'}
          </Button>
        </Box>
      ),
    },
    { field: 'organization_name', label: 'Organization' },
    {
      field: 'contact',
      label: 'Contact',
      sortable: false,
      render: (row) => (
        <>
          <Typography variant="body2">{row.phone || '—'}</Typography>
          <Typography variant="caption" color="textSecondary">
            {row.email || ''}
          </Typography>
        </>
      ),
    },
    {
      field: 'registered_at',
      label: 'Registered (UTC)',
      render: (row) => dateTime(row.registered_at).slice(0, 10),
    },
    {
      field: 'status',
      label: 'Status',
      render: (row) => <Status value={row.status} />,
    },
    { field: 'capture_count', label: 'Captures', sortable: false },
    {
      field: 'review',
      label: 'Capture review',
      sortable: false,
      render: (row) => (
        <Typography variant="caption">
          {row.approved} approved · {row.rejected} rejected · {row.pending}{' '}
          awaiting review
          {Number(row.review_unavailable) > 0
            ? ' · ' + row.review_unavailable + ' unavailable'
            : ''}
        </Typography>
      ),
    },
  ];
  return (
    <DomainPage title="Growers">
      <Box mb={4}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          label="Search name, phone, email, wallet or organization"
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
      {growerId && (
        <GrowerAccount growerId={growerId} onClose={() => setGrowerId(null)} />
      )}
    </DomainPage>
  );
}
