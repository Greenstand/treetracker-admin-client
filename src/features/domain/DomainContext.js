import React, { createContext, useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { domainRequest } from './api';
const DomainContext = createContext({});
export function DomainProvider({ user, children }) {
  const [selection, setSelection] = useState(null);
  const platform = user?.policy?.policies?.some(
    (role) => role.name === 'greenstand-admin'
  );
  const identity = useQuery({
    queryKey: ['admin-domain-context', user?.id],
    queryFn: ({ signal }) => domainRequest('/context', { signal }),
    enabled: Boolean(user?.id),
    retry: false,
  });
  const organizationId = platform ? selection : identity.data?.organizationId;
  const administrator =
    platform ||
    user?.policy?.policies?.some((role) => role.name === 'org-admin-saas');
  const permissions = administrator
    ? [
        'verify_captures',
        'manage_projects',
        'manage_species',
        'view_contracts',
        'manage_members',
      ]
    : identity.data?.permissions || [];
  const ready = Boolean(user?.id) && identity.isSuccess;
  return (
    <DomainContext.Provider
      value={{
        userId: user?.id,
        platform,
        canManageBilling: administrator,
        organizationId,
        ready,
        permissions,
        identity,
        setOrganizationId: setSelection,
      }}
    >
      {children}
    </DomainContext.Provider>
  );
}
export const useDomain = () => useContext(DomainContext);
export function useDomainData(
  path,
  params = {},
  enabled = true,
  unscoped = false
) {
  const { userId, organizationId, ready } = useDomain();
  const scope = unscoped ? undefined : organizationId;
  return useQuery({
    queryKey: ['admin-domain', userId, scope, path, params],
    queryFn: ({ signal }) =>
      domainRequest(path, {
        signal,
        params: { ...params, organizationId: scope || undefined },
      }),
    enabled: ready && enabled,
    retry: false,
  });
}
