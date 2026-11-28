import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Link, useHistory } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { useDomain, useDomainData } from './DomainContext';

function ToolbarContent() {
  const { user, logout } = useContext(AppContext);
  const domain = useDomain();
  const history = useHistory();
  const [settings, setSettings] = useState(null);
  const [choosingOrg, setChoosingOrg] = useState(false);
  const [organization, setOrganization] = useState('');
  const organizations = useDomainData(
    '/organizations',
    { size: 100 },
    Boolean(domain.platform && choosingOrg),
    true
  );
  if (!user) return null;
  const enterOrganization = () => {
    if (domain.platform) {
      setOrganization(domain.organizationId || '');
      setChoosingOrg(true);
    } else history.push('/projects');
  };
  const switchToOrg = () => {
    domain.setOrganizationId(organization);
    domain.setViewMode('organization');
    setChoosingOrg(false);
    history.push('/projects');
  };
  return (
    <Box
      px={4}
      py={2}
      display="flex"
      alignItems="center"
      justifyContent="flex-end"
      flexWrap="wrap"
      style={{ gap: 10, borderBottom: '1px solid #e5e5e5', background: '#fff' }}
    >
      {domain.viewMode === 'organization' && domain.platform && (
        <Typography variant="caption" color="textSecondary">
          Organization preview · signed in as administrator
        </Typography>
      )}
      <ButtonGroup size="small" aria-label="Administration view">
        <Button
          variant={
            domain.viewMode === 'organization' || !domain.platform
              ? 'contained'
              : 'outlined'
          }
          onClick={enterOrganization}
        >
          Org user
        </Button>
        <Button
          disabled={!domain.platform}
          variant={
            domain.platform && domain.viewMode !== 'organization'
              ? 'contained'
              : 'outlined'
          }
          onClick={() => {
            domain.setViewMode('admin');
            history.push('/organizations');
          }}
        >
          Admin
        </Button>
      </ButtonGroup>
      <Tooltip title="Settings">
        <IconButton
          size="small"
          aria-label="Settings"
          onClick={(event) => setSettings(event.currentTarget)}
        >
          <SettingsIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={user.email || user.username || 'My account'}>
        <IconButton
          size="small"
          aria-label="My account"
          component={Link}
          to="/account"
        >
          <AccountCircleIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Sign out">
        <IconButton size="small" aria-label="Sign out" onClick={logout}>
          <ExitToAppIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={settings}
        open={Boolean(settings)}
        onClose={() => setSettings(null)}
      >
        <MenuItem
          component={Link}
          to="/account"
          onClick={() => setSettings(null)}
        >
          My account
        </MenuItem>
        <MenuItem
          component={Link}
          to="/subscription-plans"
          onClick={() => setSettings(null)}
        >
          Subscription plans
        </MenuItem>
        {domain.permissions?.includes('manage_members') && (
          <MenuItem
            component={Link}
            to="/organization-users"
            onClick={() => setSettings(null)}
          >
            Organization users
          </MenuItem>
        )}
      </Menu>
      <Dialog
        open={choosingOrg}
        onClose={() => setChoosingOrg(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Organization view</DialogTitle>
        <DialogContent>
          <Typography paragraph>
            Preview an organization workspace using your administrator access.
            Your identity and server permissions remain unchanged.
          </Typography>
          <TextField
            select
            fullWidth
            variant="outlined"
            label="Organization"
            value={organization}
            onChange={(event) => setOrganization(event.target.value)}
          >
            {(organizations.data?.rows || []).map((org) => (
              <MenuItem key={org.id} value={org.id}>
                {org.name}
              </MenuItem>
            ))}
          </TextField>
          {organizations.isError && (
            <Typography color="error">
              Could not load organizations. Close and try again.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChoosingOrg(false)}>Cancel</Button>
          <Button
            color="primary"
            disabled={!organization || organizations.isLoading}
            onClick={switchToOrg}
          >
            Open organization view
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function UserToolbar() {
  const domain = useDomain();
  return domain.userId ? <ToolbarContent /> : null;
}
