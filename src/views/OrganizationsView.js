import React, { useEffect, useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import AccountTreeIcon from '@material-ui/icons/AccountTree';

import { getOrganizations } from 'api/organizations';
import Menu from 'components/common/Menu';
import Navbar from 'components/Navbar';
import Spinner from 'components/common/Spinner';
import { documentTitle } from 'common/variables';

const DEFAULT_ROWS_PER_PAGE = 25;
const ROWS_PER_PAGE_OPTIONS = [25, 50, 100];

const useStyles = makeStyles((theme) => ({
  page: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  sidebar: {
    height: '100%',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(8),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3),
    },
  },
  mobileNav: {
    width: '100%',
  },
  titleBox: {
    marginBottom: theme.spacing(4),
  },
  titleIcon: {
    fontSize: 67,
    marginRight: 11,
    color: 'gray',
    [theme.breakpoints.down('sm')]: {
      fontSize: 44,
    },
  },
  emptyState: {
    padding: theme.spacing(6),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  cardList: {
    width: '100%',
  },
  card: {
    marginBottom: theme.spacing(2),
  },
  cardValue: {
    overflowWrap: 'anywhere',
  },
  cardLabel: {
    color: theme.palette.text.secondary,
  },
  pagination: {
    marginTop: theme.spacing(2),
  },
  paginationToolbar: {
    paddingLeft: 0,
    paddingRight: 0,
    [theme.breakpoints.down('sm')]: {
      minHeight: 'auto',
    },
  },
  paginationSpacer: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  paginationCaption: {
    [theme.breakpoints.down('sm')]: {
      flexShrink: 0,
    },
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

  if (!value) {
    return '—';
  }

  if (column.isLink) {
    return (
      <Link href={value} target="_blank" rel="noopener noreferrer">
        {value}
      </Link>
    );
  }

  return value;
}

function getRowKey(org, index) {
  return org.id ?? org.stakeholder_uuid ?? index;
}

export default function OrganizationsView() {
  const classes = useStyles();
  const theme = useTheme();
  const isCompactLayout = useMediaQuery(theme.breakpoints.down('sm'), {
    noSsr: true,
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);

  const skip = rowsPerPage > 0 ? page * rowsPerPage : 0;

  const {
    data: { organizations, total: count } = { organizations: [], total: 0 },
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['organizations', { skip, rowsPerPage }],
    queryFn: () => getOrganizations({ skip, rowsPerPage }),
    // Keep the current page visible while the next page loads.
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    document.title = `Organization Management - ${documentTitle}`;
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const rowsPerPageOptions = isCompactLayout ? [] : ROWS_PER_PAGE_OPTIONS;

  const labelDisplayedRows = ({ from, to, count: totalCount }) => {
    const visibleCount = totalCount === -1 ? `>${to}` : totalCount;

    return isCompactLayout
      ? `${from}-${to}/${visibleCount}`
      : `${from}-${to} of ${visibleCount}`;
  };

  function renderBody() {
    if (isError) {
      return (
        <Alert severity="error">
          {error?.message || 'Failed to load organizations.'}
        </Alert>
      );
    }

    if (isLoading) {
      return <Spinner />;
    }

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
                <Typography variant="h6" gutterBottom>
                  {org.name || '—'}
                </Typography>
                {COLUMNS.filter((column) => column.field !== 'name').map(
                  (column) => (
                    <Grid container spacing={1} key={column.field}>
                      <Grid item>
                        <Typography
                          variant="body2"
                          className={classes.cardLabel}
                        >
                          {column.label}:
                        </Typography>
                      </Grid>
                      <Grid item xs zeroMinWidth>
                        <Typography
                          variant="body2"
                          className={classes.cardValue}
                        >
                          {renderValue(org, column)}
                        </Typography>
                      </Grid>
                    </Grid>
                  )
                )}
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
          <Grid container alignItems="center" className={classes.titleBox}>
            <Grid item>
              <AccountTreeIcon className={classes.titleIcon} />
            </Grid>
            <Grid item>
              <Typography variant={isCompactLayout ? 'h4' : 'h2'}>
                Organization Management
              </Typography>
            </Grid>
          </Grid>

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
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelDisplayedRows={labelDisplayedRows}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
            />
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}
