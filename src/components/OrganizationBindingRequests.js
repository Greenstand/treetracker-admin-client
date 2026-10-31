import React, { useContext, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';

import Spinner from './common/Spinner';
import { AppContext } from '../context/AppContext';
import {
  approveBinding,
  getPendingBindings,
  rejectBinding,
} from '../api/organizationBinding';
import { getApiErrorMessage } from '../api/apiUtils';

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: '100%',
  },
  actions: {
    display: 'flex',
    gap: theme.spacing(2),
  },
  emptyState: {
    padding: theme.spacing(6),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  alert: {
    marginBottom: theme.spacing(2),
  },
}));

function OrganizationBindingRequests() {
  const classes = useStyles();
  // Full list, not the Organizations tab's page: a request can name any org.
  const { orgList } = useContext(AppContext);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);
  const [error, setError] = useState('');

  const {
    data: { total, requests } = { total: 0, requests: [] },
    isLoading,
    isError,
    error: loadError,
  } = useQuery({
    queryKey: ['organizationBindingRequests', { page, rowsPerPage }],
    queryFn: () =>
      getPendingBindings({ skip: page * rowsPerPage, limit: rowsPerPage }),
  });

  const decide = useMutation({
    mutationFn: ({ userId, approved }) =>
      approved ? approveBinding(userId) : rejectBinding(userId),
    onSuccess: () => {
      setError('');
      return queryClient.invalidateQueries({
        queryKey: ['organizationBindingRequests'],
      });
    },
    onError: (e) => setError(getApiErrorMessage(e)),
  });

  if (isError) {
    return (
      <Alert severity="error">
        {loadError?.message || 'Failed to load binding requests.'}
      </Alert>
    );
  }

  if (isLoading) {
    return <Spinner />;
  }

  if (total === 0) {
    return (
      <Paper className={classes.emptyState} elevation={2}>
        <Typography variant="h6">No pending requests.</Typography>
      </Paper>
    );
  }

  const organizationName = (id) =>
    orgList.find((organization) => organization.id === id)?.name ?? id;

  return (
    <Box className={classes.wrapper} data-testid="binding-requests">
      {error ? (
        <Alert severity="error" className={classes.alert}>
          {error}
        </Alert>
      ) : null}
      <TableContainer component={Paper}>
        <Table aria-label="organization binding requests">
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Organization</TableCell>
              <TableCell>Decision</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.userId} role="listitem">
                <TableCell>{request.username}</TableCell>
                <TableCell>
                  {organizationName(request.organizationId)}
                </TableCell>
                <TableCell>
                  <Box className={classes.actions}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      disabled={decide.isPending}
                      data-testid={`binding-approve-${request.username}`}
                      onClick={() =>
                        decide.mutate({
                          userId: request.userId,
                          approved: true,
                        })
                      }
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      disabled={decide.isPending}
                      data-testid={`binding-reject-${request.username}`}
                      onClick={() =>
                        decide.mutate({
                          userId: request.userId,
                          approved: false,
                        })
                      }
                    >
                      Reject
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={total}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        onPageChange={(e, nextPage) => setPage(nextPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(Number(e.target.value));
          setPage(0);
        }}
      />
    </Box>
  );
}

export default OrganizationBindingRequests;
