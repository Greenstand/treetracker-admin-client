import React, { useEffect } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Grid,
  LinearProgress,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import AppLayout from '../../components/common/AppLayout';
import { useDomain, useDomainData } from './DomainContext';
import { errorMessage } from './api';
export function dateTime(value) {
  if (!value || !Number.isFinite(Date.parse(value))) return '—';
  return new Date(value).toISOString().slice(0, 16).replace('T', ' ');
}
export const shortId = (value) =>
  value ? String(value).slice(0, 8) + '…' : '—';
export function safeUrl(value) {
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol)
      ? value
      : undefined;
  } catch {
    return undefined;
  }
}
export function Status({ value }) {
  return (
    <Chip size="small" variant="outlined" label={value || 'Unavailable'} />
  );
}
export function DomainPage({
  title,
  children,
  actions,
  selectOrganization = true,
}) {
  const domain = useDomain();
  const organizations = useDomainData(
    '/organizations',
    { size: 100 },
    domain.platform,
    true
  );
  useEffect(() => {
    document.title = title + ' - Greenstand';
  }, [title]);
  return (
    <AppLayout>
      <Box component="main" p={6} style={{ flex: 1, minWidth: 0 }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          mb={5}
        >
          <Typography component="h1" variant="h5">
            {title}
          </Typography>
          <Box display="flex" alignItems="center" style={{ gap: 12 }}>
            {selectOrganization && domain.platform && (
              <TextField
                select
                variant="outlined"
                size="small"
                label="Organization"
                value={domain.organizationId || ''}
                style={{ minWidth: 210 }}
                onChange={(event) =>
                  domain.setOrganizationId(event.target.value || null)
                }
              >
                {domain.viewMode !== 'organization' && (
                  <MenuItem value="">All organizations</MenuItem>
                )}
                {(organizations.data?.rows || []).map((org) => (
                  <MenuItem key={org.id} value={org.id}>
                    {org.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
            {actions}
          </Box>
        </Box>
        {domain.identity.isLoading && (
          <LinearProgress aria-label="Loading organization access" />
        )}
        {domain.identity.error && (
          <Alert
            severity="error"
            action={
              <Button onClick={() => domain.identity.refetch()}>Retry</Button>
            }
          >
            {errorMessage(domain.identity.error)}
          </Alert>
        )}
        {domain.ready && children}
      </Box>
    </AppLayout>
  );
}
export function QueryState({ query }) {
  return (
    <>
      {query.isFetching && <LinearProgress aria-label="Loading records" />}
      {query.error && (
        <Box my={3}>
          <Alert
            severity="error"
            action={<Button onClick={() => query.refetch()}>Retry</Button>}
          >
            {errorMessage(query.error)}
          </Alert>
        </Box>
      )}
    </>
  );
}
export function DataTable({
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
  onRow,
}) {
  const { organizationId } = useDomain();
  useEffect(() => {
    setPage(0);
  }, [organizationId, setPage]);
  const rows = query.data?.rows || [];
  const changeSort = (field) => {
    setDirection(sort === field && direction === 'asc' ? 'desc' : 'asc');
    setSort(field);
    setPage(0);
  };
  return (
    <Paper variant="outlined">
      <QueryState query={query} />
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.field}>
                  {setSort && column.sortable !== false ? (
                    <TableSortLabel
                      active={sort === column.field}
                      direction={sort === column.field ? direction : 'asc'}
                      onClick={() => changeSort(column.field)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} hover={Boolean(onRow)}>
                {columns.map((column, index) => (
                  <TableCell key={column.field}>
                    {column.render ? (
                      column.render(row)
                    ) : index === 0 && onRow ? (
                      <Button
                        style={{
                          textAlign: 'left',
                          justifyContent: 'flex-start',
                        }}
                        onClick={() => onRow(row)}
                      >
                        {row[column.field] || '—'}
                      </Button>
                    ) : (
                      row[column.field] ?? '—'
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {!query.isFetching && !query.error && !rows.length && (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <Box py={6} textAlign="center">
                    <Typography color="textSecondary">
                      No records found.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={-1}
        page={page}
        rowsPerPage={size}
        rowsPerPageOptions={[25, 50, 100]}
        nextIconButtonProps={{
          disabled: !query.data?.hasNext || query.isFetching,
        }}
        backIconButtonProps={{ disabled: page === 0 || query.isFetching }}
        labelDisplayedRows={({ from }) =>
          rows.length ? from + '–' + (from + rows.length - 1) : '0 records'
        }
        onPageChange={(_, next) => setPage(next)}
        onRowsPerPageChange={(event) => {
          setSize(Number(event.target.value));
          setPage(0);
        }}
      />
    </Paper>
  );
}
export function Metric({ title, value, children }) {
  return (
    <Grid item xs={12} sm={6} lg={3}>
      <Paper variant="outlined">
        <Box p={5}>
          <Typography color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4">
            {value == null ? '—' : Number(value).toLocaleString()}
          </Typography>
          {children}
        </Box>
      </Paper>
    </Grid>
  );
}
export function OrganizationName({ row }) {
  return (
    <Box display="flex" alignItems="center" style={{ gap: 10 }}>
      <Avatar
        src={safeUrl(row.logo_url)}
        alt=""
        style={{ width: 32, height: 32 }}
      />
      <Typography variant="body2">{row.name}</Typography>
    </Box>
  );
}
