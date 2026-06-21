import React, { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';

import { updateOrganization } from 'api/organizations';
import { getApiErrorMessage } from 'api/apiUtils';
import {
  organizationSchema,
  mapOrganizationValidationErrors,
  getOrganizationValidationErrors,
} from 'models/organizationSchema';

const useStyles = makeStyles((theme) => ({
  input: {
    margin: theme.spacing(0, 0, 3, 0),
  },
}));

const FORM_FIELDS = [
  { name: 'name', label: 'Organization Name', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'phone', label: 'Phone Number' },
  { name: 'mapName', label: 'Map Name' },
  {
    name: 'website',
    label: 'Website',
    helperText: 'Include http:// or https://',
  },
  {
    name: 'logoUrl',
    label: 'Logo URL',
    helperText: 'Optional public image URL',
  },
];

function getOrgId(org) {
  return org?.id;
}

function orgToForm(org) {
  return {
    name: org.name ?? '',
    email: org.email ?? '',
    phone: org.phone ?? '',
    website: org.website ?? '',
    logoUrl: org.logoUrl ?? org.logo_url ?? '',
    mapName: org.mapName ?? org.map_name ?? '',
  };
}

export default function OrganizationFormDialog({
  organization,
  onClose,
  onSaved,
  children,
}) {
  const classes = useStyles();
  const editingId = getOrgId(organization);

  // The values the org was loaded with — used to send only changed fields on
  // save. Captured once on mount (the dialog remounts per open).
  const initialForm = useRef(orgToForm(organization)).current;
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const saveMutation = useMutation({
    mutationFn: ({ id, payload }) => updateOrganization(id, payload),
    onSuccess: () => {
      onSaved();
    },
  });

  function handleFieldChange(event) {
    const { name, value } = event.target;
    const nextForm = { ...form, [name]: value };
    const nextErrors = getOrganizationValidationErrors(nextForm);

    setForm(nextForm);
    saveMutation.reset();
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

    // PATCHes only the fields that actually changed, so we never clobber
    // values we didn't touch.
    const changedFields = Object.fromEntries(
      Object.entries(result.data).filter(
        ([field, value]) => value !== initialForm[field]
      )
    );

    // Nothing changed — skip the request and just close.
    if (Object.keys(changedFields).length === 0) {
      onClose();
      return;
    }

    saveMutation.mutate({ id: editingId, payload: changedFields });
  }

  const hasFormErrors = Object.values(errors).some(Boolean);
  const formErrorMessage = saveMutation.isError
    ? getApiErrorMessage(saveMutation.error, 'Failed to save organization')
    : '';

  return (
    <Dialog
      open
      onClose={onClose}
      aria-labelledby="organization-form-title"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="organization-form-title">Edit Organization</DialogTitle>
      <form noValidate onSubmit={handleSubmit}>
        <DialogContent>
          {saveMutation.isError && (
            <Alert severity="error" className={classes.input}>
              {formErrorMessage}
            </Alert>
          )}
          {FORM_FIELDS.map((field) => (
            <TextField
              key={field.name}
              id={`organization-${field.name}`}
              name={field.name}
              label={field.label}
              type={field.type || 'text'}
              required={field.required}
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={form[field.name] || ''}
              onChange={handleFieldChange}
              onBlur={handleFieldChange}
              error={Boolean(errors[field.name])}
              helperText={errors[field.name] || field.helperText}
              className={classes.input}
            />
          ))}
          {children && <div className={classes.input}>{children}</div>}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={saveMutation.isPending}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={hasFormErrors || saveMutation.isPending}
          >
            {saveMutation.isPending ? <CircularProgress size={21} /> : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
