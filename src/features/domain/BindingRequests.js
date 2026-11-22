import React from 'react';
import OrganizationBindingRequests from '../../components/OrganizationBindingRequests';
import { DomainPage } from './shared';
export default function BindingRequests() {
  return (
    <DomainPage
      title="Org binding"
      selectOrganization={false}
    >
      <OrganizationBindingRequests />
    </DomainPage>
  );
}
