import React from 'react';
import { Box } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import ShareAppView from '../../views/ShareAppView';
import { useDomain, useDomainData } from './DomainContext';
import { DomainPage, QueryState } from './shared';
export default function ShareApp() {
  const domain = useDomain();
  const query = useDomainData(
    '/organizations',
    {},
    Boolean(domain.organizationId)
  );
  const organization = query.data?.rows?.[0];
  const mapped =
    Number.isSafeInteger(organization?.keycloak_organization_id) &&
    organization.keycloak_organization_id > 0 &&
    Boolean(organization.name?.trim());
  const base = process.env.REACT_APP_SHARE_APP_BASE || window.location.origin;
  const local = ['localhost', '127.0.0.1', '::1', '[::1]'].includes(
    new URL(base, window.location.origin).hostname
  );
  return (
    <DomainPage title="Share App">
      {!domain.organizationId ? (
        <Alert severity="info">
          Select an organization to create its app invite link and QR code.
        </Alert>
      ) : (
        <>
          <QueryState query={query} />
          {query.isSuccess && !organization && (
            <Alert severity="info">Organization details are unavailable.</Alert>
          )}
          {query.isSuccess && organization && !mapped && (
            <Alert severity="warning">
              This organization needs its mobile-app organization mapping and
              name before creating an invite. Contact a platform administrator.
            </Alert>
          )}
          {mapped && !query.isError && (
            <>
              {local && (
                <Box mb={3}>
                  <Alert severity="warning">
                    This preview link points to this computer. A publicly
                    reachable app invite link is needed for growers to open it
                    on their phones.
                  </Alert>
                </Box>
              )}
              <ShareAppView
                key={organization.id}
                embedded
                organization={{
                  id: organization.keycloak_organization_id,
                  name: organization.name,
                }}
              />
            </>
          )}
        </>
      )}
    </DomainPage>
  );
}
