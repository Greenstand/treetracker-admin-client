import React, { useState, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { AppContext } from '../../context/AppContext';
import { ALL_ORGANIZATIONS, ORGANIZATION_NOT_SET } from '../../models/Filter';

function SelectOrg({ orgId, defaultOrgs, handleSelection }) {
  const { orgList, userHasOrg } = useContext(AppContext);
  const [organizationId, setOrganizationId] = useState(orgId);

  const defaultOrgList = defaultOrgs
    ? defaultOrgs
    : userHasOrg
    ? [
        {
          id: ALL_ORGANIZATIONS,
          stakeholder_uuid: ALL_ORGANIZATIONS,
          name: 'All',
          value: 'All',
        },
      ]
    : [
        {
          id: ALL_ORGANIZATIONS,
          stakeholder_uuid: ALL_ORGANIZATIONS,
          name: 'All',
          value: 'All',
        },
        {
          id: ORGANIZATION_NOT_SET,
          stakeholder_uuid: ORGANIZATION_NOT_SET,
          name: 'Not set',
          value: null,
        },
      ];

  const handleChange = (e) => {
    e.preventDefault();
    const org = orgList.find(
      (o) => o.id === e.target.value || o.stakeholder_uuid === e.target.value
    );
    // console.log('handleChange', e);
    setOrganizationId(e.target.value); // set value for UI
    handleSelection(org || e.target.value); // pass on the org if found, or the chosen value to handler for filter
  };

  return (
    <TextField
      select
      data-testid="org-dropdown"
      htmlFor="organization"
      id="organization"
      label="Organization"
      name="organization"
      value={organizationId}
      onChange={handleChange}
    >
      {[...defaultOrgList, ...orgList].map((org) => (
        <MenuItem data-testid="org-item" key={org.id} value={org.id}>
          {org.name}
        </MenuItem>
      ))}
    </TextField>
  );
}

export default SelectOrg;
