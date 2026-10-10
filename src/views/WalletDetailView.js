import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, Button, Grid, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import { AccountBalanceWallet } from '@material-ui/icons';

import { bindKeycloakAccount, getWallet } from 'api/wallets';
import { getKeycloakUser } from 'api/keycloakUsers';
import AppLayout from 'components/common/AppLayout';
import BindKeycloakAccountDialog from 'components/BindKeycloakAccountDialog';
import Spinner from 'components/common/Spinner';
import { documentTitle } from 'common/variables';

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
  panel: { padding: theme.spacing(4), marginBottom: theme.spacing(3) },
  field: { marginBottom: theme.spacing(3) },
  label: { color: theme.palette.text.secondary },
}));

function Field({ label, value, testId, classes }) {
  return (
    <Box className={classes.field}>
      <Typography variant="caption" className={classes.label}>
        {label}
      </Typography>
      <Typography variant="body1" data-test={testId}>
        {value}
      </Typography>
    </Box>
  );
}

function WalletDetailView() {
  const classes = useStyles();
  const { walletId } = useParams();
  const queryClient = useQueryClient();
  const [isDialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    document.title = `Wallet - ${documentTitle}`;
  }, []);

  const { data: wallet, isLoading, error } = useQuery({
    queryKey: ['wallet', walletId],
    queryFn: () => getWallet(walletId),
  });

  const keycloakAccountId = wallet?.keycloak_account_id;

  const { data: account } = useQuery({
    queryKey: ['keycloak-user', keycloakAccountId],
    queryFn: () => getKeycloakUser(keycloakAccountId),
    enabled: Boolean(keycloakAccountId),
  });

  const bind = useMutation({
    mutationFn: (selected) => bindKeycloakAccount(walletId, selected.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet', walletId] });
      setDialogOpen(false);
    },
  });

  function renderAccount() {
    if (!keycloakAccountId) return null;

    const name = [account?.firstName, account?.lastName]
      .filter(Boolean)
      .join(' ')
      .trim();

    return (
      <Field
        classes={classes}
        label="Keycloak account"
        testId="wallet-keycloak-user"
        value={account ? name || account.username || account.email : '...'}
      />
    );
  }

  function renderBody() {
    if (error) {
      return (
        <Alert severity="error">
          {error?.message || 'Failed to load this wallet.'}
        </Alert>
      );
    }

    if (isLoading) return <Spinner />;

    return (
      <Paper className={classes.panel} elevation={2} data-test="wallet-detail">
        <Field
          classes={classes}
          label="Name"
          testId="wallet-name"
          value={wallet?.name}
        />
        <Field
          classes={classes}
          label="Keycloak id"
          testId="wallet-keycloak-id"
          value={keycloakAccountId || ''}
        />
        {renderAccount()}

        <Button
          color="primary"
          variant="contained"
          onClick={() => setDialogOpen(true)}
          data-test="bind-keycloak-account"
        >
          Bind keycloak account
        </Button>
      </Paper>
    );
  }

  return (
    <AppLayout>
      <Grid item container className={classes.content}>
        <Grid item xs={12}>
          <Box display="flex" alignItems="center" className={classes.titleBox}>
            <AccountBalanceWallet className={classes.titleIcon} />
            <Typography variant="h2" data-test="wallet-detail-title">
              {wallet?.name || 'Wallet'}
            </Typography>
          </Box>

          {renderBody()}
        </Grid>
      </Grid>

      <BindKeycloakAccountDialog
        open={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={(selected) => bind.mutate(selected)}
        isSubmitting={bind.isPending}
        submitError={bind.error}
      />
    </AppLayout>
  );
}

export default WalletDetailView;
