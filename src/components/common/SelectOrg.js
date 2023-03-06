import React, { useContext } from 'react';
import { TextField, MenuItem } from '@material-ui/core';
import { AppContext } from 'context/AppContext';
import { ALL_ORGANIZATIONS, ORGANIZATION_NOT_SET } from 'models/Filter';

function SelectOrg({ orgId, defaultOrgs, handleSelection }) {
  const { orgList, userHasOrg } = useContext(AppContext);

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
    const org = [...defaultOrgList, ...orgList].find(
      (o) => o.id === e.target.value || o.stakeholder_uuid === e.target.value
    );

    handleSelection(org);
  };

  return (
    <TextField
      select
      data-testid="org-dropdown"
      htmlFor="organization"
      id="organization"
      label="Organization"
      name="organization"
      // orgId could be either a uuid string or an array of uuids
      value={Array.isArray(orgId) ? ALL_ORGANIZATIONS : orgId}
      onChange={handleChange}
    >
      {[...defaultOrgList, ...orgList].map((org) => (
        <MenuItem
          data-testid="org-item"
          key={org.stakeholder_uuid}
          value={org.stakeholder_uuid}
        >
          {org.name}
        </MenuItem>
      ))}
    </TextField>
  );
}

export default SelectOrg;
