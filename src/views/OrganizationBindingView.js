import React, { useContext, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  Card,
  Grid,
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { AppContext } from 'context/AppContext';
import { getMyBinding, requestBinding } from 'api/organizationBinding';
import { getApiErrorMessage } from 'api/apiUtils';
import AppLayout from 'components/common/AppLayout';
import CountrySelect from 'components/common/CountrySelect';
import Spinner from 'components/common/Spinner';
import { documentTitle } from 'common/variables';
import {
  INITIAL_BINDING_FIELDS,
  getBindingFieldValidationErrors,
} from 'models/organizationSchema';

const useStyles = makeStyles((theme) => ({
  page: {
    minHeight: '100vh',
    backgroundColor: theme.palette.primary.lightVery,
  },
  content: {
    flexGrow: 1,
    minWidth: 0,
    padding: theme.spacing(10),
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(4) },
  },
  pageHeader: {
    marginBottom: theme.spacing(6),
  },
  pageTitle: {
    fontWeight: 800,
    letterSpacing: '-0.5px',
  },
  pageSubtitle: {
    marginTop: theme.spacing(1),
    color: theme.palette.text.secondary,
    maxWidth: 640,
  },
  card: {
    width: '100%',
    maxWidth: 1080,
    borderRadius: theme.spacing(3),
    border: `1px solid ${theme.palette.stats.lavenderPinocchio}`,
    overflow: 'hidden',
  },
  cardBody: {
    padding: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(6) },
  },
  sectionLabel: {
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: 700,
    fontSize: '0.7rem',
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
  },
  sectionTitle: {
    fontWeight: 700,
    marginBottom: theme.spacing(1),
  },
  helperText: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(4),
    lineHeight: 1.5,
  },
  select: {
    maxWidth: 420,
    marginBottom: theme.spacing(4),
  },
  fields: {
    maxWidth: 860,
    marginBottom: theme.spacing(4),
  },
  submitButton: {
    alignSelf: 'flex-start',
    borderRadius: theme.spacing(2),
    textTransform: 'none',
    fontWeight: 700,
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(6),
    boxShadow: 'none',
    '&:hover': { boxShadow: 'none' },
  },
  error: {
    marginTop: theme.spacing(4),
  },
  spinnerWrap: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 360,
  },
}));

function OrganizationBindingView() {
  const classes = useStyles();
  const theme = useTheme();
  const isCompactLayout = useMediaQuery(theme.breakpoints.down('sm'), {
    noSsr: true,
  });

  const queryClient = useQueryClient();
  const [organizationId, setOrganizationId] = useState('');
  const [fields, setFields] = useState(INITIAL_BINDING_FIELDS);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = `Organization binding - ${documentTitle}`;
  }, []);

  const { data: binding, isLoading } = useQuery({
    queryKey: ['organizationBinding'],
    queryFn: getMyBinding,
  });

  // AppContext already loads this on login; the paginated endpoint is admin only.
  const { orgList: organizationList } = useContext(AppContext);
  const requestedOrganization = organizationList.find(
    (organization) => organization.id === binding?.organizationId
  );
  const selectedOrganization = organizationList.find(
    (organization) => organization.id === organizationId
  );

  function handleOrganizationChange(event) {
    const selectedId = event.target.value;
    const organization = organizationList.find(
      (candidate) => candidate.id === selectedId
    );

    setOrganizationId(selectedId);
    setFieldErrors({});
    setFields({
      phone: organization?.phone ?? '',
      email: organization?.email ?? '',
      location: organization?.location ?? '',
    });
  }

  function handleFieldChange(event) {
    const { name, value } = event.target;
    setFields((current) => ({ ...current, [name]: value }));
  }

  // An emptied field counts as untouched: it never clears the organization.
  function changedFields() {
    return Object.entries(fields).reduce((changed, [name, value]) => {
      const trimmed = value.trim();
      const current = (selectedOrganization?.[name] ?? '').trim();

      return trimmed && trimmed !== current
        ? { ...changed, [name]: trimmed }
        : changed;
    }, {});
  }

  async function handleSubmit() {
    const proposed = changedFields();
    const errors = getBindingFieldValidationErrors(proposed);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      const result = await requestBinding(organizationId, proposed);
      queryClient.setQueryData(['organizationBinding'], result);
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AppLayout className={classes.page}>
      <Grid item container direction="column" className={classes.content}>
        <Grid item className={classes.pageHeader}>
          <Typography
            variant={isCompactLayout ? 'h4' : 'h3'}
            className={classes.pageTitle}
          >
            Organization binding
          </Typography>
          <Typography variant="body1" className={classes.pageSubtitle}>
            Join an organization that is already on Greenstand.
          </Typography>
        </Grid>

        <Grid item>
          <Card elevation={4} className={classes.card}>
            {isLoading ? (
              <Box className={classes.spinnerWrap}>
                <Spinner />
              </Box>
            ) : (
              <Box className={classes.cardBody} data-testid="binding-card">
                <Typography className={classes.sectionLabel}>
                  Existing organization
                </Typography>

                {binding?.status === 'pending' ? (
                  <Typography
                    variant="h6"
                    className={classes.sectionTitle}
                    data-testid="binding-pending"
                  >
                    You are waiting for approval of organization binding
                    {requestedOrganization
                      ? `: ${requestedOrganization.name}`
                      : ''}
                  </Typography>
                ) : (
                  <>
                    {binding?.status === 'rejected' ? (
                      <Typography
                        variant="h6"
                        className={classes.sectionTitle}
                        data-testid="binding-rejected"
                      >
                        Your request to join
                        {requestedOrganization
                          ? ` ${requestedOrganization.name}`
                          : ' the organization'}{' '}
                        was rejected
                      </Typography>
                    ) : null}
                    <Typography variant="body2" className={classes.helperText}>
                      Choose your organization and submit. You can also propose
                      updates to its contact details, which take effect when a
                      Greenstand admin approves the request.
                    </Typography>
                    <TextField
                      select
                      fullWidth
                      variant="outlined"
                      label="Organization"
                      value={organizationId}
                      onChange={handleOrganizationChange}
                      className={classes.select}
                      SelectProps={{ 'data-testid': 'binding-organization' }}
                    >
                      {organizationList.map((organization) => (
                        <MenuItem key={organization.id} value={organization.id}>
                          {organization.name}
                        </MenuItem>
                      ))}
                    </TextField>
                    {organizationId ? (
                      <Grid
                        container
                        spacing={4}
                        className={classes.fields}
                        data-testid="binding-fields"
                      >
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            id="binding-phone"
                            name="phone"
                            label="Phone"
                            value={fields.phone}
                            onChange={handleFieldChange}
                            error={Boolean(fieldErrors.phone)}
                            helperText={fieldErrors.phone}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            id="binding-email"
                            name="email"
                            label="Email"
                            value={fields.email}
                            onChange={handleFieldChange}
                            error={Boolean(fieldErrors.email)}
                            helperText={fieldErrors.email}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <CountrySelect
                            id="binding-location"
                            name="location"
                            label="Country"
                            value={fields.location}
                            onChange={handleFieldChange}
                          />
                        </Grid>
                      </Grid>
                    ) : null}
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      disabled={!organizationId || isSubmitting}
                      onClick={handleSubmit}
                      className={classes.submitButton}
                      data-testid="binding-submit"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit request'}
                    </Button>
                  </>
                )}

                {error ? (
                  <Typography
                    variant="body2"
                    color="error"
                    className={classes.error}
                  >
                    {error}
                  </Typography>
                ) : null}
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </AppLayout>
  );
}

export default OrganizationBindingView;
