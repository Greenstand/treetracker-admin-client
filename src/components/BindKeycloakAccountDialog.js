import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import {
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
import { Alert } from '@material-ui/lab';

import { useDebounce } from 'hooks/useDebounce';
import { searchKeycloakUsers } from 'api/keycloakUsers';
import Spinner from 'components/common/Spinner';

function accountLabel(account) {
  const name = [account.firstName, account.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();
  return name || account.username || account.id;
}

function BindKeycloakAccountDialog(props) {
  const { open, onClose, onSubmit, isSubmitting, submitError } = props;
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const commitSearch = useDebounce((value) => setSearch(value), 500);

  const { data: accounts = [], isFetching, error } = useQuery({
    queryKey: ['keycloak-users', search],
    queryFn: () => searchKeycloakUsers(search),
    enabled: open && search.trim().length > 0,
  });

  function handleClose() {
    setSearchInput('');
    setSearch('');
    setSelected(null);
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Bind keycloak account</DialogTitle>
      <DialogContent data-test="bind-keycloak-dialog">
        <TextField
          autoFocus
          fullWidth
          variant="outlined"
          label="Search by email or user name"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setSelected(null);
            commitSearch(e.target.value);
          }}
          inputProps={{ 'data-test': 'keycloak-account-search' }}
        />

        {error && (
          <Alert severity="error">
            {error?.message || 'Failed to search keycloak accounts.'}
          </Alert>
        )}
        {submitError && (
          <Alert severity="error">
            {submitError?.message || 'Failed to bind the account.'}
          </Alert>
        )}

        {isFetching && <Spinner />}

        {!isFetching && search.trim() && accounts.length === 0 && (
          <Typography variant="body2">No accounts found.</Typography>
        )}

        <List data-test="keycloak-account-results">
          {accounts.map((account) => (
            <ListItem
              button
              key={account.id}
              selected={selected?.id === account.id}
              onClick={() => setSelected(account)}
              data-test="keycloak-account-option"
            >
              <ListItemText
                primary={accountLabel(account)}
                secondary={account.email || account.id}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          color="primary"
          variant="contained"
          disabled={!selected || isSubmitting}
          onClick={() => onSubmit(selected)}
          data-test="bind-keycloak-submit"
        >
          Bind
        </Button>
      </DialogActions>
    </Dialog>
  );
}

BindKeycloakAccountDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  submitError: PropTypes.object,
};

export default BindKeycloakAccountDialog;
