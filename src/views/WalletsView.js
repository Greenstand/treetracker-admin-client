import React, { useEffect, useState } from 'react';
import { useDebounce } from 'hooks/useDebounce';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
  Box,
  Card,
  CardContent,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
  AccountBalanceWallet,
  Close as CloseIcon,
  Search as SearchIcon,
} from '@material-ui/icons';

import { getWallets } from 'api/wallets';
import AppLayout from 'components/common/AppLayout';
import Spinner from 'components/common/Spinner';
import { documentTitle } from 'common/variables';

const ROWS_PER_PAGE_OPTIONS = [25, 50, 100];

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest', sortBy: 'created_at', order: 'desc' },
  { label: 'Oldest', value: 'oldest', sortBy: 'created_at', order: 'asc' },
  { label: 'Name A→Z', value: 'name_asc', sortBy: 'name', order: 'asc' },
  { label: 'Name Z→A', value: 'name_desc', sortBy: 'name', order: 'desc' },
];

const COLUMNS = [
  { label: 'Name', field: 'name' },
  { label: 'Display name', field: 'display_name' },
  { label: 'About', field: 'about' },
  { label: 'Created', field: 'created_at', isDate: true },
];

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(8),
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(3) },
  },
  titleBox: { marginBottom: theme.spacing(4) },
  titleIcon: {
    fontSize: 67,
    marginRight: 11,
    color: 'gray',
    [theme.breakpoints.down('sm')]: { fontSize: 44 },
  },
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
  pagination: { marginTop: theme.spacing(2) },
  paginationToolbar: {
    paddingLeft: 0,
    paddingRight: 0,
    [theme.breakpoints.down('sm')]: { minHeight: 'auto' },
  },
}));

function renderValue(wallet, column) {
  const value = wallet[column.field];
  if (!value) return '—';
  if (column.isDate) return new Date(value).toLocaleDateString();
  return value;
}

export default function WalletsView() {
  const classes = useStyles();
  const theme = useTheme();
  const isCompactLayout = useMediaQuery(theme.breakpoints.down('sm'));

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);
  // searchInput is what is typed; search is the debounced value the query uses.
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [sortValue, setSortValue] = useState(SORT_OPTIONS[0].value);

  useEffect(() => {
    document.title = `Wallets - ${documentTitle}`;
  }, []);

  const commitSearch = useDebounce((value) => {
    setSearch(value);
    setPage(0);
  }, 300);

  function handleSearchChange(value) {
    setSearchInput(value);
    commitSearch(value);
  }

  const sort = SORT_OPTIONS.find((o) => o.value === sortValue);

  const {
    data: { wallets, total } = { wallets: [], total: 0 },
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['wallets', { page, rowsPerPage, search, sortValue }],
    queryFn: () =>
      getWallets({
        skip: page * rowsPerPage,
        rowsPerPage,
        search,
        sortBy: sort.sortBy,
        order: sort.order,
      }),
    placeholderData: keepPreviousData,
  });

  function renderBody() {
    if (isError) {
      return (
        <Alert severity="error">
          {error?.message || 'Failed to load wallets.'}
        </Alert>
      );
    }

    if (isLoading) return <Spinner />;

    if (wallets.length === 0) {
      return (
        <Paper className={classes.emptyState} elevation={2}>
          <Typography variant="h6">No wallets found.</Typography>
        </Paper>
      );
    }

    if (isCompactLayout) {
      return (
        <Box className={classes.cardList}>
          {wallets.map((wallet) => (
            <Card key={wallet.id} className={classes.card}>
              <CardContent>
                {COLUMNS.map((column) => (
                  <Box key={column.field}>
                    <Typography variant="caption" className={classes.cardLabel}>
                      {column.label}
                    </Typography>
                    <Typography variant="body2" className={classes.cardValue}>
                      {renderValue(wallet, column)}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          ))}
        </Box>
      );
    }

    return (
      <TableContainer component={Paper}>
        <Table aria-label="wallets table">
          <TableHead>
            <TableRow>
              {COLUMNS.map((column) => (
                <TableCell key={column.field}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {wallets.map((wallet) => (
              <TableRow key={wallet.id} role="listitem">
                {COLUMNS.map((column) => (
                  <TableCell key={column.field}>
                    {renderValue(wallet, column)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <AppLayout>
      <Grid item container className={classes.content}>
        <Grid item xs={12}>
          <Box display="flex" alignItems="center" className={classes.titleBox}>
            <AccountBalanceWallet className={classes.titleIcon} />
            <Typography variant="h2" data-test="wallets-title">
              Wallets
            </Typography>
          </Box>

          <Box className={classes.toolbar}>
            <TextField
              id="wallets-search"
              className={classes.searchBox}
              variant="outlined"
              label="Search by name"
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              inputProps={{ 'data-test': 'wallets-search' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchInput ? (
                  <InputAdornment position="end">
                    <IconButton
                      title="clear search"
                      onClick={() => handleSearchChange('')}
                    >
                      <CloseIcon />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />
            <FormControl variant="outlined" className={classes.sortSelect}>
              <InputLabel id="wallets-sort-label">Sort</InputLabel>
              <Select
                labelId="wallets-sort-label"
                label="Sort"
                value={sortValue}
                onChange={(e) => {
                  setSortValue(e.target.value);
                  setPage(0);
                }}
              >
                {SORT_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box data-test="wallets-list">{renderBody()}</Box>

          {!isError && !isLoading && wallets.length > 0 && (
            <TablePagination
              classes={{
                root: classes.pagination,
                toolbar: classes.paginationToolbar,
              }}
              component="div"
              count={Number(total)}
              rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
            />
          )}
        </Grid>
      </Grid>
    </AppLayout>
  );
}
