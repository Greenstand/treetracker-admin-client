import React, { useState } from 'react';
import { Avatar, Box, Button, TextField, Typography } from '@material-ui/core';
import { useDomainData } from './DomainContext';
import { DataTable, Status, safeUrl } from './shared';
import GrowerAccount from './GrowerAccount';
export default function OrganizationGrowers({ organizationId }) {
  const [search, setSearch] = useState(''),
    [page, setPage] = useState(0),
    [size, setSize] = useState(25),
    [growerId, setGrowerId] = useState(null);
  const query = useDomainData(
    '/growers',
    { organizationId, search, page, size },
    Boolean(organizationId),
    true
  );
  const columns = [
    {
      field: 'name',
      label: 'Grower',
      render: (row) => (
        <Box display="flex" alignItems="center" style={{ gap: 8 }}>
          <Avatar src={safeUrl(row.image_url)} />
          <Button onClick={() => setGrowerId(row.id)}>
            {[row.first_name, row.last_name].filter(Boolean).join(' ') ||
              'View account'}
          </Button>
        </Box>
      ),
    },
    { field: 'association', label: 'Association' },
    { field: 'phone', label: 'Phone' },
    {
      field: 'status',
      label: 'Status',
      render: (row) => <Status value={row.status} />,
    },
    { field: 'capture_count', label: 'Captures' },
  ];
  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        Associated growers
      </Typography>
      <Typography variant="caption" color="textSecondary">
        Includes primary organization membership, active project assignments and
        linked tracking sessions.
      </Typography>
      <Box my={2}>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          label="Search associated growers"
          onKeyDown={(event) => {
            if (event.key === 'Enter') event.preventDefault();
          }}
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(0);
          }}
        />
      </Box>
      <DataTable {...{ query, columns, page, setPage, size, setSize }} />
      {growerId && (
        <GrowerAccount
          growerId={growerId}
          organizationId={organizationId}
          onClose={() => setGrowerId(null)}
        />
      )}
    </Box>
  );
}
