import React from 'react';
import OrganizationBindingRequests from '../../components/OrganizationBindingRequests';
import { DomainPage } from './shared';
export default function BindingRequests() {
  return (
    <DomainPage
      title="Organization binding requests"
      selectOrganization={false}
    >
      <OrganizationBindingRequests />
    </DomainPage>
  );
}
