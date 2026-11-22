import React, { useState } from 'react';
import { Box, Tab, Tabs } from '@material-ui/core';
import OrganizationBindingRequests from '../../components/OrganizationBindingRequests';
import Organizations from './Organizations';
import { DomainPage } from './shared';
export default function BindingRequests() {
  const [tab, setTab] = useState(0);
  const navigation = (
    <Box mb={4}>
      <Tabs
        value={tab}
        onChange={(event, value) => setTab(value)}
        indicatorColor="primary"
        textColor="primary"
        aria-label="Organization management"
      >
        <Tab
          id="org-requests-tab"
          label="Users requesting to bind to an organization"
        />
        <Tab id="org-directory-tab" label="Organizations" />
      </Tabs>
    </Box>
  );
  if (tab === 1) return <Organizations navigation={navigation} />;
  return (
    <DomainPage title="Organization Management" selectOrganization={false}>
      {navigation}
      <Box role="tabpanel" aria-labelledby="org-requests-tab">
        <OrganizationBindingRequests />
      </Box>
    </DomainPage>
  );
}
