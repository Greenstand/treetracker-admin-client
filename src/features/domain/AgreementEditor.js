import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useQueryClient } from '@tanstack/react-query';
import { useDomain, useDomainData } from './DomainContext';
import { domainRequest, errorMessage } from './api';
import { QueryState, dateTime } from './shared';
export function AgreementCreate({ onClose }) {
  const d = useDomain(),
    cache = useQueryClient(),
    options = useDomainData('/agreement-options');
  const [form, setForm] = useState({ capture_payment_currency: 'USD' }),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  const set = (key, value) => setForm({ ...form, [key]: value });
  const save = async () => {
    setBusy(true);
    setError('');
    try {
      await domainRequest('/agreements', {
        method: 'POST',
        data: { ...form, organizationId: d.organizationId },
      });
      await cache.invalidateQueries({ queryKey: ['admin-domain'] });
      onClose();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Dialog open fullWidth maxWidth="sm" onClose={busy ? undefined : onClose}>
      <DialogTitle>New agreement</DialogTitle>
      <DialogContent dividers>
        <Alert severity="info">
          Create shared terms for many individual grower contracts. This saves a
          planning draft. Open it separately when its terms are ready.
        </Alert>
        <QueryState query={options} />
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          required
          fullWidth
          margin="normal"
          label="Agreement name"
          value={form.name || ''}
          onChange={(e) => set('name', e.target.value)}
        />
        <TextField
          fullWidth
          multiline
          margin="normal"
          label="Description / shared terms"
          value={form.description || ''}
          onChange={(e) => set('description', e.target.value)}
        />
        {[
          ['funder_id', 'Funding organization', options.data?.funders],
          [
            'consolidation_rule_id',
            'Earnings calculation rule',
            options.data?.rules,
          ],
        ].map(([key, label, rows]) => (
          <TextField
            key={key}
            required
            select
            fullWidth
            margin="normal"
            label={label}
            value={form[key] || ''}
            onChange={(e) => set(key, e.target.value)}
          >
            {(rows || []).map((r) => (
              <MenuItem key={r.id} value={r.id}>
                {r.name}
              </MenuItem>
            ))}
          </TextField>
        ))}
        {options.isSuccess && !options.data?.rules?.length && (
          <Alert severity="warning">
            No authorized earnings calculation rule is available. A Greenstand
            administrator must configure one before this agreement can be
            created.
          </Alert>
        )}
        <TextField
          required
          fullWidth
          margin="normal"
          label="Payment per approved capture"
          value={form.capture_payment || ''}
          onChange={(e) => set('capture_payment', e.target.value)}
          inputProps={{ inputMode: 'decimal' }}
        />
        <TextField
          required
          select
          fullWidth
          margin="normal"
          label="Currency"
          value={form.capture_payment_currency}
          onChange={(e) => set('capture_payment_currency', e.target.value)}
        >
          {['USD', 'SLL'].map((v) => (
            <MenuItem key={v} value={v}>
              {v}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          required
          fullWidth
          margin="normal"
          type="number"
          label="Default quota per individual contract"
          value={form.max_captures || ''}
          inputProps={{ min: 1, step: 1 }}
          onChange={(e) => set('max_captures', e.target.value)}
        />
        <TextField
          required
          fullWidth
          margin="normal"
          label="Reason / audit note"
          value={form.reason || ''}
          onChange={(e) => set('reason', e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={busy} onClick={onClose}>
          Cancel
        </Button>
        <Button
          color="primary"
          disabled={
            busy ||
            [
              'name',
              'funder_id',
              'consolidation_rule_id',
              'capture_payment',
              'max_captures',
              'reason',
            ].some((k) => !form[k]?.trim())
          }
          onClick={save}
        >
          Create planning agreement
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export function AgreementLifecycle({ agreement, onClose }) {
  const d = useDomain(),
    cache = useQueryClient(),
    history = useDomainData('/agreements/' + agreement.id + '/history');
  const [status, setStatus] = useState(''),
    [reason, setReason] = useState(''),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  const choices =
    { planning: ['open', 'aborted'], open: ['closed'] }[agreement.status] || [];
  const save = async () => {
    setBusy(true);
    setError('');
    try {
      await domainRequest('/agreements/' + agreement.id, {
        method: 'PATCH',
        data: {
          organizationId: agreement.organization_id,
          expected_status: agreement.status,
          status,
          reason,
        },
      });
      await cache.invalidateQueries({ queryKey: ['admin-domain'] });
      onClose();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Box my={2}>
      {error && <Alert severity="error">{error}</Alert>}
      {d.canManageBilling && choices.length > 0 && (
        <>
          <Typography>
            Opening makes these terms available for new contracts. Closing
            prevents new contracts; individual contracts keep their current
            status.
          </Typography>
          <TextField
            fullWidth
            select
            margin="normal"
            label="Change agreement status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {choices.map((v) => (
              <MenuItem key={v} value={v}>
                {v}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            required
            margin="normal"
            label="Reason for agreement status change"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <Button disabled={busy || !status || !reason.trim()} onClick={save}>
            Save agreement status
          </Button>
        </>
      )}
      <Typography variant="h6">Agreement history</Typography>
      <QueryState query={history} />
      {history.data?.rows.map((e) => (
        <Typography key={e.id}>
          {dateTime(e.created_at)} UTC · {e.previous_status || 'Created'} →{' '}
          {e.status} · {e.reason} · Reviewer {e.actor_id}
        </Typography>
      ))}
    </Box>
  );
}
