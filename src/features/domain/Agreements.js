import React, { useState } from 'react';
import {
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useDomainData } from './DomainContext';
import { DataTable, Status, dateTime } from './shared';
export default function Agreements() {
  const [search, setSearch] = useState(''),
    [page, setPage] = useState(0),
    [size, setSize] = useState(25),
    [selected, setSelected] = useState(null);
  const query = useDomainData('/agreements', { search, page, size });
  const columns = [
    { field: 'name', label: 'Agreement' },
    { field: 'organization_name', label: 'Organization' },
    {
      field: 'status',
      label: 'Status',
      render: (r) => <Status value={r.status} />,
    },
    {
      field: 'capture_payment',
      label: 'Payment per capture',
      render: (r) =>
        r.capture_payment == null
          ? 'Not set'
          : r.capture_payment + ' ' + (r.capture_payment_currency || ''),
    },
    {
      field: 'max_captures',
      label: 'Default capture quota',
      render: (r) =>
        r.max_captures == null
          ? 'Not set'
          : Number(r.max_captures).toLocaleString(),
    },
    { field: 'contract_count', label: 'Individual contracts' },
  ];
  return (
    <>
      <Box my={2}>
        <Alert severity="info">
          One agreement holds shared terms for many individual contracts.
          Planning → Open → Closed, or Planning → Aborted. Only open agreements
          can be selected for new contracts. Agreement authoring and opening
          remain in the contracts service.
        </Alert>
      </Box>
      <Box mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          label="Search agreements and organizations"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />
      </Box>
      <DataTable
        {...{ query, columns, page, setPage, size, setSize }}
        onRow={setSelected}
      />
      {selected && (
        <Dialog open fullWidth maxWidth="sm" onClose={() => setSelected(null)}>
          <DialogTitle>{selected.name}</DialogTitle>
          <DialogContent dividers>
            <Status value={selected.status} />
            <Box my={2}>
              <Typography>
                Organization: {selected.organization_name || 'Not assigned'}
              </Typography>
              <Typography>Type: {selected.type}</Typography>
              <Typography>
                Payment: {selected.capture_payment ?? 'Not set'}{' '}
                {selected.capture_payment_currency} per capture
              </Typography>
              <Typography>
                Default capture quota: {selected.max_captures ?? 'Not set'}
              </Typography>
              <Typography>
                Earnings calculation rule:{' '}
                {selected.consolidation_rule_name || 'Not available'}
              </Typography>
              <Typography>
                Individual contracts: {selected.contract_count}
              </Typography>
              <Typography>
                Opened: {dateTime(selected.opened_at)} UTC
              </Typography>
              <Typography>
                Closed: {dateTime(selected.closed_at)} UTC
              </Typography>
            </Box>
            <Typography>{selected.description}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelected(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
