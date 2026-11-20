import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@material-ui/core';
import { useDomainData } from './DomainContext';
import {
  DomainPage,
  DataTable,
  QueryState,
  Status,
  dateTime,
  shortId,
  safeUrl,
} from './shared';
function ContractDetail({ contract, onClose }) {
  const documents = useDomainData('/contracts/' + contract.id + '/documents');
  return (
    <Dialog open fullWidth maxWidth="md" onClose={onClose}>
      <DialogTitle>
        {contract.agreement_name || shortId(contract.id)}
      </DialogTitle>
      <DialogContent dividers>
        <Status value={contract.status} />
        <Box my={3}>
          <Typography>
            {contract.worker_name || 'Worker name unavailable'} ·{' '}
            {contract.organization_name || 'Organization unavailable'}
          </Typography>
          <Typography>Signed {dateTime(contract.signed_at)} UTC</Typography>
          <Typography>
            {contract.capture_payment ?? '—'}{' '}
            {contract.capture_payment_currency} per capture
          </Typography>
        </Box>
        <Typography paragraph>{contract.description}</Typography>
        <Typography paragraph>{contract.notes}</Typography>
        <Typography component="h2" variant="h6">
          Documents
        </Typography>
        <QueryState query={documents} />
        <List>
          {(documents.data?.rows || []).map((document) => (
            <ListItem key={document.id} divider>
              <ListItemText
                primary={document.name}
                secondary={'Version ' + document.version}
              />
              {safeUrl(document.hardcopy_url) && (
                <Button
                  component="a"
                  href={safeUrl(document.hardcopy_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open document
                </Button>
              )}
            </ListItem>
          ))}
        </List>
        {!documents.isFetching &&
          !documents.error &&
          !documents.data?.rows?.length && (
            <Typography color="textSecondary">
              No documents attached.
            </Typography>
          )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
export default function Contracts() {
  const [search, setSearch] = useState(''),
    [page, setPage] = useState(0),
    [size, setSize] = useState(25),
    [selected, setSelected] = useState(null);
  const query = useDomainData('/contracts', { search, page, size });
  const columns = [
    { field: 'agreement_name', label: 'Agreement' },
    { field: 'worker_name', label: 'Worker' },
    { field: 'organization_name', label: 'Organization' },
    {
      field: 'status',
      label: 'Status',
      render: (row) => <Status value={row.status} />,
    },
    {
      field: 'capture_payment',
      label: 'Payment per capture',
      render: (row) =>
        (row.capture_payment ?? '—') +
        ' ' +
        (row.capture_payment_currency || ''),
    },
    {
      field: 'signed_at',
      label: 'Signed (UTC)',
      render: (row) => dateTime(row.signed_at),
    },
  ];
  return (
    <DomainPage title="Contracts">
      <Box mb={4}>
        <TextField
          label="Search agreement, worker, organization or notes"
          variant="outlined"
          fullWidth
          size="small"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(0);
          }}
        />
      </Box>
      <DataTable
        {...{ query, columns, page, setPage, size, setSize }}
        onRow={setSelected}
      />
      {selected && (
        <ContractDetail contract={selected} onClose={() => setSelected(null)} />
      )}
    </DomainPage>
  );
}
