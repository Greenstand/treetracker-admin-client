import { Alert } from '@material-ui/lab';
import { Link } from 'react-router-dom';
import Agreements from './Agreements';
import {
  ContractCreate,
  ContractStatus,
  WorkerVerification,
} from './ContractActions';
import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
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
import { useDomain, useDomainData } from './DomainContext';
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
  const domain = useDomain();
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
            {contract.worker_name || 'Grower name unavailable'} ·{' '}
            {contract.organization_name || 'Organization unavailable'}
          </Typography>
          <Typography>Signed {dateTime(contract.signed_at)} UTC</Typography>
          <Typography>
            Capture quota:{' '}
            {contract.capture_quota == null
              ? 'Not set'
              : Number(contract.capture_quota).toLocaleString()}
          </Typography>
          <Typography color="textSecondary">
            Quota progress counts approved captures only. Progress is not
            connected yet.
          </Typography>
          <Typography>
            {contract.capture_payment ?? '—'}{' '}
            {contract.capture_payment_currency} per capture
          </Typography>
        </Box>
        <Typography>
          Project: {contract.project_name || 'Not linked (beta contract)'}
        </Typography>
        {domain.platform &&
          domain.viewMode !== 'organization' &&
          contract.grower_account_id && (
            <WorkerVerification growerId={contract.grower_account_id} />
          )}
        {domain.canManageBilling && (
          <ContractStatus contract={contract} onClose={onClose} />
        )}
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
    [selected, setSelected] = useState(null),
    [creating, setCreating] = useState(false);
  const domain = useDomain();
  const [tab, setTab] = useState('contracts');
  const access = useDomainData('/contract-access');
  const query = useDomainData(
    '/contracts',
    { search, page, size },
    access.data?.allowed === true
  );
  if (!access.data?.allowed)
    return (
      <DomainPage title="Contracts">
        <QueryState query={access} />
        {access.data && (
          <Alert severity="info">
            Contracts and Agreements are included in Base and Crown
            subscriptions.{' '}
            <Button component={Link} to="/subscription-plans" color="primary">
              View upgrade options
            </Button>
          </Alert>
        )}
      </DomainPage>
    );
  const columns = [
    { field: 'project_name', label: 'Project' },
    { field: 'agreement_name', label: 'Agreement' },
    { field: 'worker_name', label: 'Grower' },
    { field: 'organization_name', label: 'Organization' },
    {
      field: 'capture_quota',
      label: 'Capture quota',
      render: (row) =>
        row.capture_quota == null
          ? 'Not set'
          : Number(row.capture_quota).toLocaleString(),
    },
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
      <Tabs
        value={tab}
        onChange={(_, value) => setTab(value)}
        indicatorColor="primary"
        textColor="primary"
        aria-label="Contracts and shared agreements"
      >
        <Tab value="contracts" label="Contracts" />
        <Tab value="agreements" label="Agreements" />
      </Tabs>
      {tab === 'agreements' ? (
        <Agreements />
      ) : (
        <>
          {domain.canManageBilling && (
            <Box mb={2}>
              <Button
                variant="contained"
                color="primary"
                disabled={!domain.organizationId}
                onClick={() => setCreating(true)}
              >
                New contract
              </Button>
              {!domain.organizationId && (
                <Typography>
                  Select an organization to create a contract.
                </Typography>
              )}
            </Box>
          )}
          {creating && <ContractCreate onClose={() => setCreating(false)} />}
          <Box mb={4}>
            <TextField
              label="Search agreement, grower, organization or notes"
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
            <ContractDetail
              contract={selected}
              onClose={() => setSelected(null)}
            />
          )}
        </>
      )}
    </DomainPage>
  );
}
