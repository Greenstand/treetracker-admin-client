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
import { Alert, Autocomplete } from '@material-ui/lab';
import { useQueryClient } from '@tanstack/react-query';
import { useDomain, useDomainData } from './DomainContext';
import { domainRequest, errorMessage } from './api';
import { QueryState, dateTime } from './shared';
export function ContractCreate({ onClose }) {
  const d = useDomain(),
    cache = useQueryClient();
  const [project, setProject] = useState(null),
    [grower, setGrower] = useState(null),
    [search, setSearch] = useState(''),
    [agreement, setAgreement] = useState(''),
    [quota, setQuota] = useState(''),
    [reason, setReason] = useState(''),
    [notes, setNotes] = useState(''),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  const options = useDomainData(
    '/contract-options',
    {},
    Boolean(d.organizationId)
  );
  const projects = useDomainData(
    '/projects',
    { size: 100 },
    Boolean(d.organizationId)
  );
  const growers = useDomainData(
    '/growers',
    { search, size: 50 },
    Boolean(d.organizationId)
  );
  const save = async () => {
    setBusy(true);
    setError('');
    try {
      await domainRequest('/contracts', {
        method: 'POST',
        data: {
          organizationId: d.organizationId,
          project_id: project.id,
          grower_account_id: grower.id,
          agreement_id: agreement,
          capture_quota: quota,
          notes,
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
    <Dialog open fullWidth maxWidth="sm" onClose={busy ? undefined : onClose}>
      <DialogTitle>New contract</DialogTitle>
      <DialogContent dividers>
        <Alert severity="info">
          Shared terms come from an open agreement. This contract starts
          unsigned. Manual worker approval is required before signing.
        </Alert>
        {[options, projects, growers].map((q, i) => (
          <QueryState key={i} query={q} />
        ))}
        {error && <Alert severity="error">{error}</Alert>}
        <Box my={2}>
          <Autocomplete
            options={(projects.data?.rows || []).filter(
              (p) => p.status === 'active'
            )}
            value={project}
            onChange={(_, v) => setProject(v)}
            getOptionLabel={(v) => v.name || ''}
            renderInput={(p) => (
              <TextField {...p} label="Project" variant="outlined" />
            )}
          />
        </Box>
        <Box my={2}>
          <Autocomplete
            options={growers.data?.rows || []}
            value={grower}
            onChange={(_, v) => setGrower(v)}
            onInputChange={(_, v) => setSearch(v)}
            getOptionLabel={(v) =>
              [v.first_name, v.last_name].filter(Boolean).join(' ') ||
              v.wallet ||
              v.id
            }
            renderInput={(p) => (
              <TextField {...p} label="Grower" variant="outlined" />
            )}
          />
        </Box>
        <TextField
          select
          fullWidth
          variant="outlined"
          label="Agreement"
          value={agreement}
          onChange={(e) => {
            setAgreement(e.target.value);
            setQuota(
              options.data?.agreements.find((a) => a.id === e.target.value)
                ?.max_captures || ''
            );
          }}
        >
          {(options.data?.agreements || []).map((a) => (
            <MenuItem key={a.id} value={a.id}>
              {a.name}
            </MenuItem>
          ))}
        </TextField>
        {options.isSuccess && !options.data?.agreements?.length && (
          <Alert severity="warning">
            No open agreement is available for this organization. Create and
            open an agreement in the Agreements tab first.
          </Alert>
        )}
        <TextField
          fullWidth
          margin="normal"
          label="Capture quota (approved captures)"
          type="number"
          value={quota}
          onChange={(e) => setQuota(e.target.value)}
          inputProps={{ min: 1, step: 1 }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Notes"
          multiline
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          required
          label="Reason / audit note"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
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
            !project ||
            !grower ||
            !agreement ||
            !Number.isInteger(Number(quota)) ||
            Number(quota) < 1 ||
            !reason.trim()
          }
          onClick={save}
        >
          Create unsigned contract
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export function ContractStatus({ contract, onClose }) {
  const cache = useQueryClient(),
    [status, setStatus] = useState(''),
    [reason, setReason] = useState(''),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  const choices =
    { unsigned: ['signed', 'aborted'], signed: ['completed', 'cancelled'] }[
      contract.status
    ] || [];
  const history = useDomainData('/contracts/' + contract.id + '/history');
  const save = async () => {
    setBusy(true);
    setError('');
    try {
      await domainRequest('/contracts/' + contract.id, {
        method: 'PATCH',
        data: {
          organizationId: contract.organization_id,
          status,
          expected_status: contract.status,
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
    <Box my={3}>
      {error && <Alert severity="error">{error}</Alert>}
      {choices.length > 0 && (
        <>
          <TextField
            select
            label="Change status"
            fullWidth
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
            label="Reason for status change"
            margin="normal"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <Button disabled={busy || !status || !reason.trim()} onClick={save}>
            Save status
          </Button>
        </>
      )}
      <Typography variant="h6">Contract history</Typography>
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
export function WorkerVerification({ growerId }) {
  const cache = useQueryClient(),
    [open, setOpen] = useState(false),
    [form, setForm] = useState({
      outcome: 'approved',
      verified_at: new Date().toISOString().slice(0, 16),
    }),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  const query = useDomainData(
    '/growers/' + growerId + '/worker-verification',
    {},
    true,
    true
  );
  const save = async () => {
    setBusy(true);
    setError('');
    try {
      await domainRequest('/growers/' + growerId + '/worker-verification', {
        method: 'POST',
        data: {
          ...form,
          verified_at: new Date(form.verified_at + 'Z').toISOString(),
        },
      });
      await cache.invalidateQueries({ queryKey: ['admin-domain'] });
      setOpen(false);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Box my={2}>
      <Typography variant="h6">Manual worker verification</Typography>
      <QueryState query={query} />
      <Typography>
        Latest outcome: {query.data?.rows[0]?.outcome || 'Not reviewed'}
      </Typography>
      <Button onClick={() => setOpen(true)}>
        Record mobile-money verification
      </Button>
      {query.data?.rows.map((v) => (
        <Typography key={v.id}>
          {dateTime(v.verified_at)} UTC · {v.outcome} · {v.registered_name} ·{' '}
          {v.provider} · {v.reason}
        </Typography>
      ))}
      {open && (
        <Dialog
          open
          fullWidth
          maxWidth="sm"
          onClose={busy ? undefined : () => setOpen(false)}
        >
          <DialogTitle>Record manual payment-account check</DialogTitle>
          <DialogContent dividers>
            <Alert severity="info">
              Record a check already performed. This does not send money, sign a
              contract or approve captures.
            </Alert>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              select
              fullWidth
              label="Outcome"
              value={form.outcome}
              onChange={(e) => setForm({ ...form, outcome: e.target.value })}
            >
              {['approved', 'rejected'].map((v) => (
                <MenuItem key={v} value={v}>
                  {v}
                </MenuItem>
              ))}
            </TextField>
            {[
              ['registered_name', 'Registered recipient name'],
              ['provider', 'Mobile-money provider'],
              ['account_reference', 'Payment account reference'],
              ['transaction_reference', 'Test-payment transaction reference'],
              ['reason', 'Review notes'],
            ].map(([key, label]) => (
              <TextField
                required
                fullWidth
                margin="normal"
                key={key}
                label={label}
                value={form[key] || ''}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            ))}
            <TextField
              required
              fullWidth
              margin="normal"
              type="datetime-local"
              label="Check date (UTC)"
              InputLabelProps={{ shrink: true }}
              value={form.verified_at}
              onChange={(e) =>
                setForm({ ...form, verified_at: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button disabled={busy} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={
                busy ||
                [
                  'registered_name',
                  'provider',
                  'account_reference',
                  'transaction_reference',
                  'reason',
                  'verified_at',
                ].some((k) => !form[k]?.trim())
              }
              onClick={save}
            >
              Record review
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
