import React, { useContext, useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';

import { createOrganization } from 'api/organizations';
import { getApiErrorMessage } from 'api/apiUtils';
import { ensureFreshToken, getUserFromToken } from 'auth/keycloak';
import AppLayout from 'components/common/AppLayout';
import { documentTitle } from 'common/variables';
import { AppContext } from 'context/AppContext';
import {
  INITIAL_ORGANIZATION_FORM,
  organizationSchema,
  mapOrganizationValidationErrors,
  getOrganizationValidationErrors,
} from 'models/organizationSchema';

const REDIRECT_DELAY_MS = 1500;
const ERROR_MESSAGES = {
  ORGANIZATION_ROLE_ALREADY_ASSIGNED: 'You already belong to an organization.',
  ORGANIZATION_CLAIM_UPDATE_FAILED: 'Failed To create an organization',
  ORGANIZATION_ROLE_ASSIGNMENT_FAILED: 'Failed To create an organization',
};

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(6),
  },
  card: {
    maxWidth: 960,
    padding: theme.spacing(4),
  },
  header: {
    marginBottom: theme.spacing(4),
  },
  intro: {
    maxWidth: 720,
    color: theme.palette.text.secondary,
  },
  fieldGrid: {
    marginTop: theme.spacing(1),
  },
  actions: {
    marginTop: theme.spacing(4),
  },
  alert: {
    marginBottom: theme.spacing(3),
  },
}));

export default function OrganizationApplicationView() {
  const classes = useStyles();
  const history = useHistory();
  const appContext = useContext(AppContext);
  const [form, setForm] = useState(INITIAL_ORGANIZATION_FORM);
  const [errors, setErrors] = useState({});
  const redirectTimerRef = useRef();
  const createOrganizationMutation = useMutation({
    mutationFn: (payload) => createOrganization(payload),
    onSuccess: async () => {
      if (appContext.isKeycloakEnabled && appContext.login) {
        try {
          const refreshedToken = await ensureFreshToken(-1);
          const refreshedUser = getUserFromToken();

          if (refreshedToken && refreshedUser) {
            appContext.login(refreshedUser, `Bearer ${refreshedToken}`);
          }
        } catch (error) {
          console.error(
            'Failed to refresh Keycloak token after org creation',
            error
          );
        }
      }

      redirectTimerRef.current = window.setTimeout(() => {
        history.push('/');
      }, REDIRECT_DELAY_MS);
    },
  });
  const hasErrors = Object.values(errors).some(Boolean);
  const errorMessage = getApiErrorMessage(
    createOrganizationMutation.error,
    'Failed to create organization',
    ERROR_MESSAGES
  );

  useEffect(() => {
    document.title = `Organization Application - ${documentTitle}`;
  }, []);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        window.clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    const nextForm = {
      ...form,
      [name]: value,
    };
    const nextErrors = getOrganizationValidationErrors(nextForm);

    setForm(nextForm);
    createOrganizationMutation.reset();

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: nextErrors[name],
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const result = organizationSchema.safeParse(form);

    if (!result.success) {
      setErrors(mapOrganizationValidationErrors(result.error));
      return;
    }

    setErrors({});
    setForm(result.data);
    createOrganizationMutation.mutate(result.data);
  }

  return (
    <AppLayout>
      <Grid item className={classes.content}>
        <Paper elevation={2} className={classes.card}>
          <Box className={classes.header}>
            <Typography variant="h3" gutterBottom>
              Apply for an organization
            </Typography>
          </Box>

          {createOrganizationMutation.isSuccess ? (
            <Alert severity="success" className={classes.alert}>
              Organization created successfully.
            </Alert>
          ) : null}

          {createOrganizationMutation.isError ? (
            <Alert severity="error" className={classes.alert}>
              {errorMessage}
            </Alert>
          ) : null}

          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3} className={classes.fieldGrid}>
              <Grid item xs={12} md={6}>
                <TextField
                  id="organization-name"
                  fullWidth
                  required
                  variant="outlined"
                  label="Organization Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleChange}
                  error={Boolean(errors.name)}
                  helperText={errors.name}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="organization-email"
                  fullWidth
                  required
                  variant="outlined"
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleChange}
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="organization-phone"
                  fullWidth
                  variant="outlined"
                  label="Phone Number"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  onBlur={handleChange}
                  error={Boolean(errors.phone)}
                  helperText={errors.phone}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="organization-map-name"
                  fullWidth
                  variant="outlined"
                  label="Map Name"
                  name="mapName"
                  value={form.mapName}
                  onChange={handleChange}
                  onBlur={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="organization-website"
                  fullWidth
                  variant="outlined"
                  label="Website"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  onBlur={handleChange}
                  error={Boolean(errors.website)}
                  helperText={errors.website || 'Include http:// or https://'}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="organization-logo-url"
                  fullWidth
                  variant="outlined"
                  label="Logo URL"
                  name="logoUrl"
                  value={form.logoUrl}
                  onChange={handleChange}
                  onBlur={handleChange}
                  error={Boolean(errors.logoUrl)}
                  helperText={errors.logoUrl || 'Optional public image URL'}
                />
              </Grid>
            </Grid>

            <Box className={classes.actions}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={hasErrors || createOrganizationMutation.isPending}
              >
                {createOrganizationMutation.isPending
                  ? 'Creating...'
                  : 'Create organization'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Grid>
    </AppLayout>
  );
}
