import React, { useEffect, useState } from 'react';
import { useDebounce } from 'hooks/useDebounce';
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import {
  Box,
  Card,
  CardContent,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import {
  Edit,
  Close as CloseIcon,
  Search as SearchIcon,
} from '@material-ui/icons';

import { getOrganizations } from 'api/organizations';
import {
  OrgQueryProvider,
  SORT_OPTIONS,
  useOrgQueryState,
  useOrgQueryDispatch,
} from 'context/OrganizationsContext';
import Menu from 'components/common/Menu';
import Navbar from 'components/Navbar';
import OrganizationFormDialog from 'components/OrganizationFormDialog';
import Spinner from 'components/common/Spinner';
import { documentTitle } from 'common/variables';

const ROWS_PER_PAGE_OPTIONS = [25, 50, 100];

const useStyles = makeStyles((theme) => ({
  page: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    [theme.breakpoints.down('sm')]: { flexDirection: 'column' },
  },
  sidebar: { height: '100%' },
  content: {
    flexGrow: 1,
    padding: theme.spacing(8),
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(3) },
  },
  mobileNav: { width: '100%' },
  titleBox: { marginBottom: theme.spacing(4) },
  titleIcon: {
    fontSize: 67,
    marginRight: 11,
    color: 'gray',
    [theme.breakpoints.down('sm')]: { fontSize: 44 },
  },
  addButton: { color: 'white' },
  toolbar: {
    display: 'flex',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('sm')]: { flexDirection: 'column' },
  },
  searchBox: { flexGrow: 1 },
  sortSelect: { minWidth: 160 },
  emptyState: {
    padding: theme.spacing(6),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  cardList: { width: '100%' },
  card: { marginBottom: theme.spacing(2) },
  cardValue: { overflowWrap: 'anywhere' },
  cardLabel: { color: theme.palette.text.secondary },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  pagination: { marginTop: theme.spacing(2) },
  paginationToolbar: {
    paddingLeft: 0,
    paddingRight: 0,
    [theme.breakpoints.down('sm')]: { minHeight: 'auto' },
  },
  paginationSpacer: {
    [theme.breakpoints.down('sm')]: { display: 'none' },
  },
  paginationCaption: {
    [theme.breakpoints.down('sm')]: { flexShrink: 0 },
  },
}));

const COLUMNS = [
  { label: 'Name', field: 'name' },
  { label: 'Email', field: 'email' },
  { label: 'Phone', field: 'phone' },
  { label: 'Website', field: 'website', isLink: true },
];

function renderValue(org, column) {
  const value = org[column.field];
  if (!value) return '—';
  if (column.isLink) {
    return (
      <Link href={value} target="_blank" rel="noopener noreferrer">
        {value}
      </Link>
    );
  }
  return value;
}

function getOrgId(org) {
  return org?.id;
}

function getRowKey(org, index) {
  return getOrgId(org) ?? index;
}

export default function OrganizationsView() {
  return (
    <OrgQueryProvider>
      <OrgContent />
    </OrgQueryProvider>
  );
}

function OrgContent() {
  const classes = useStyles();
  const theme = useTheme();
  const queryClient = useQueryClient();
  const isCompactLayout = useMediaQuery(theme.breakpoints.down('sm'), {
    noSsr: true,
  });

  const {
    page,
    rowsPerPage,
    searchInput,
    search,
    sortValue,
  } = useOrgQueryState();
  const dispatch = useOrgQueryDispatch();

  const [formOpen, setFormOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState(undefined);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const skip = rowsPerPage > 0 ? page * rowsPerPage : 0;

  const commitSearch = useDebounce(
    (value) => dispatch({ type: 'COMMIT_SEARCH', payload: value }),
    500
  );

  useEffect(() => {
    document.title = `Organization Management - ${documentTitle}`;
  }, []);

  const order =
    SORT_OPTIONS.find((o) => o.value === sortValue)?.order ??
    SORT_OPTIONS[0].order;

  const {
    data: { organizations, total: count } = { organizations: [], total: 0 },
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['organizations', { skip, rowsPerPage, search, sortValue }],
    queryFn: () => getOrganizations({ skip, rowsPerPage, search, order }),
    placeholderData: keepPreviousData,
  });

  function handleOpenEdit(org) {
    setEditingOrg(org);
    setFormOpen(true);
  }

  function handleCloseForm() {
    setFormOpen(false);
    setEditingOrg(undefined);
  }

  function handleSaved() {
    queryClient.invalidateQueries({ queryKey: ['organizations'] });
    setSnackbarMessage('Organization updated');
    setSnackbarOpen(true);
    handleCloseForm();
  }

  function handleSnackbarClose(event, reason) {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  }

  const rowsPerPageOptions = isCompactLayout ? [] : ROWS_PER_PAGE_OPTIONS;

  const labelDisplayedRows = ({ from, to, count: totalCount }) => {
    const visibleCount = totalCount === -1 ? `>${to}` : totalCount;
    return isCompactLayout
      ? `${from}-${to}/${visibleCount}`
      : `${from}-${to} of ${visibleCount}`;
  };

  function renderOrgActions(org) {
    return (
      <IconButton title="edit" onClick={() => handleOpenEdit(org)}>
        <Edit />
      </IconButton>
    );
  }

  function renderBody() {
    if (isError) {
      return (
        <Alert severity="error">
          {error?.message || 'Failed to load organizations.'}
        </Alert>
      );
    }

    if (isLoading) return <Spinner />;

    if (organizations.length === 0) {
      return (
        <Paper className={classes.emptyState} elevation={2}>
          <Typography variant="h6">No organizations found.</Typography>
        </Paper>
      );
    }

    if (isCompactLayout) {
      return (
        <Box className={classes.cardList}>
          {organizations.map((org, index) => (
            <Card
              key={getRowKey(org, index)}
              className={classes.card}
              variant="outlined"
            >
              <CardContent>
                <Box className={classes.cardHeader}>
                  <Typography variant="h6">{org.name || '—'}</Typography>
                  {renderOrgActions(org)}
                </Box>
                {COLUMNS.filter((c) => c.field !== 'name').map((column) => (
                  <Grid container spacing={1} key={column.field}>
                    <Grid item>
                      <Typography variant="body2" className={classes.cardLabel}>
                        {column.label}:
                      </Typography>
                    </Grid>
                    <Grid item xs zeroMinWidth>
                      <Typography variant="body2" className={classes.cardValue}>
                        {renderValue(org, column)}
                      </Typography>
                    </Grid>
                  </Grid>
                ))}
              </CardContent>
            </Card>
          ))}
        </Box>
      );
    }

    return (
      <TableContainer component={Paper}>
        <Table aria-label="organizations table">
          <TableHead>
            <TableRow>
              {COLUMNS.map((column) => (
                <TableCell key={column.field}>{column.label}</TableCell>
              ))}
              <TableCell>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {organizations.map((org, index) => (
              <TableRow key={getRowKey(org, index)} role="listitem">
                {COLUMNS.map((column) => (
                  <TableCell key={column.field}>
                    {renderValue(org, column)}
                  </TableCell>
                ))}
                <TableCell style={{ minWidth: '110px' }}>
                  {renderOrgActions(org)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <Grid className={classes.page}>
      {isCompactLayout ? (
        <Grid item className={classes.mobileNav}>
          <Navbar />
        </Grid>
      ) : (
        <Paper elevation={3} className={classes.sidebar}>
          <Menu variant="plain" />
        </Paper>
      )}

      <Grid item container className={classes.content}>
        <Grid item xs={12}>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            className={classes.titleBox}
          >
            <Grid item>
              <Grid container alignItems="center">
                <Grid item>
                  <Typography variant={isCompactLayout ? 'h4' : 'h2'}>
                    Organization Management
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Box className={classes.toolbar}>
            <TextField
              className={classes.searchBox}
              variant="outlined"
              placeholder="Search by name or phone"
              value={searchInput}
              onChange={(e) => {
                dispatch({ type: 'SET_SEARCH_INPUT', payload: e.target.value });
                commitSearch(e.target.value);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchInput && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => {
                        dispatch({ type: 'SET_SEARCH_INPUT', payload: '' });
                        commitSearch('');
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <FormControl variant="outlined" className={classes.sortSelect}>
              <InputLabel id="org-sort-label">Sort</InputLabel>
              <Select
                labelId="org-sort-label"
                label="Sort"
                value={sortValue}
                onChange={(e) =>
                  dispatch({ type: 'SET_SORT', payload: e.target.value })
                }
              >
                {SORT_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {renderBody()}

          {!isError && !isLoading && organizations.length > 0 && (
            <TablePagination
              classes={{
                root: classes.pagination,
                toolbar: classes.paginationToolbar,
                spacer: classes.paginationSpacer,
                caption: classes.paginationCaption,
              }}
              component="div"
              count={Number(count)}
              rowsPerPageOptions={rowsPerPageOptions}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={(_, newPage) =>
                dispatch({ type: 'SET_PAGE', payload: newPage })
              }
              onRowsPerPageChange={(e) =>
                dispatch({
                  type: 'SET_ROWS_PER_PAGE',
                  payload: parseInt(e.target.value, 10),
                })
              }
              labelDisplayedRows={labelDisplayedRows}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
            />
          )}
        </Grid>
      </Grid>

      {formOpen && (
        <OrganizationFormDialog
          organization={editingOrg}
          onClose={handleCloseForm}
          onSaved={handleSaved}
        />
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleSnackbarClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Grid>
  );
}
