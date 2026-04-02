import React, { useEffect, useRef, useState } from 'react';
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
import { z } from 'zod';

import { createOrganization } from 'api/organizations';
import Menu from 'components/common/Menu';
import { documentTitle } from 'common/variables';

const REDIRECT_DELAY_MS = 1500;

const useStyles = makeStyles((theme) => ({
  page: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  sidebar: {
    height: '100%',
  },
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

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  website: '',
  logoUrl: '',
  mapName: '',
};

const PHONE_REGEX = /^[+()\-.\s\d]{10,20}$/;

const trimmedString = z.string().trim();
const emptyString = z.literal('');
const requiredEmail = trimmedString
  .min(1, { error: 'Email is required' })
  .pipe(z.email({ error: 'Enter a valid email address' }));

const optionalPhone = trimmedString.pipe(
  emptyString.or(
    z.string().regex(PHONE_REGEX, { error: 'Enter a valid phone number' })
  )
);

const optionalHttpUrl = (message) =>
  trimmedString.pipe(
    emptyString.or(
      z.url({
        protocol: /^https?$/,
        error: message,
      })
    )
  );

const organizationApplicationSchema = z.object({
  name: trimmedString.min(1, { error: 'Organization name is required' }),
  email: requiredEmail,
  phone: optionalPhone,
  website: optionalHttpUrl('Enter a valid website URL'),
  logoUrl: optionalHttpUrl('Enter a valid logo URL'),
  mapName: trimmedString,
});

function mapValidationErrors(error) {
  const properties = z.treeifyError(error).properties || {};

  return Object.keys(INITIAL_FORM).reduce((allErrors, fieldName) => {
    const fieldError = properties[fieldName]?.errors?.[0];

    if (!fieldError) {
      return allErrors;
    }

    return {
      ...allErrors,
      [fieldName]: fieldError,
    };
  }, {});
}

function getValidationErrors(values) {
  const result = organizationApplicationSchema.safeParse(values);

  if (result.success) {
    return {};
  }

  return mapValidationErrors(result.error);
}

export default function OrganizationApplicationView() {
  const classes = useStyles();
  const history = useHistory();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const redirectTimerRef = useRef();
  const createOrganizationMutation = useMutation({
    mutationFn: (payload) => createOrganization(payload),
    onSuccess: () => {
      redirectTimerRef.current = window.setTimeout(() => {
        history.push('/');
      }, REDIRECT_DELAY_MS);
    },
  });
  const hasErrors = Object.values(errors).some(Boolean);
  const errorMessage =
    // createOrganizationMutation.error?.response?.data?.error?.message ||
    // createOrganizationMutation.error?.response?.data?.error ||
    // createOrganizationMutation.error?.message ||
    'Failed to create organization';

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
    const nextErrors = getValidationErrors(nextForm);

    setForm(nextForm);
    createOrganizationMutation.reset();

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: nextErrors[name],
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const result = organizationApplicationSchema.safeParse(form);

    if (!result.success) {
      setErrors(mapValidationErrors(result.error));
      return;
    }

    setErrors({});
    setForm(result.data);
    createOrganizationMutation.mutate(result.data);
  }

  return (
    <Grid className={classes.page}>
      <Paper elevation={3} className={classes.sidebar}>
        <Menu variant="plain" />
      </Paper>

      <Grid item className={classes.content}>
        <Paper elevation={2} className={classes.card}>
          <Box className={classes.header}>
            <Typography variant="h3" gutterBottom>
              Apply for an organization
            </Typography>
            {/* <Typography variant="body1" className={classes.intro}>
              Start by filling in the basic organization details. This first
              pass captures the form experience and validation while backend
              submission is still being wired.
            </Typography> */}
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
    </Grid>
  );
}
