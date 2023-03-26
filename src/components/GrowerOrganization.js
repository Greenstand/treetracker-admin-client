import React, { useContext } from 'react';

import { AppContext } from '../context/AppContext.js';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { getOrganizationById } from 'utilities/index.js';

/**
 * @function
 * @name GrowerOrganization
 * @description display organision associated with the grower
 *
 * @param {object} props
 * @param {string} props.organizationName name of organization grower belongs to
 * @param {number} props.assignedOrganizationId id of organization assigned to grower
 * @param {boolean} props.compact only show one value (assigned org takes priority)
 *
 * @returns {React.Component}
 */
const GrowerOrganization = (props) => {
  const appContext = useContext(AppContext);
  const { organizationName, assignedOrganizationId, compact } = props;

  const renderGrowerOrganization = () => (
    <Typography style={{ color: '#C0C0C0', fontStyle: 'italic' }}>
      {organizationName}
    </Typography>
  );
  const renderGrowerAssignedOrganization = (id) => {
    const assignedOrganization = getOrganizationById(appContext.orgList, id);
    return (
      <Typography>
        {assignedOrganization?.name} ({id})
      </Typography>
    );
  };
  const orgNamesMatch =
    assignedOrganizationId &&
    organizationName &&
    (
      getOrganizationById(appContext.orgList, assignedOrganizationId)?.name ||
      ''
    ).toLowerCase() === organizationName.toLowerCase();

  return (
    <>
      {assignedOrganizationId &&
        renderGrowerAssignedOrganization(assignedOrganizationId)}
      {organizationName &&
        (!compact || !assignedOrganizationId) &&
        !orgNamesMatch &&
        renderGrowerOrganization()}
    </>
  );
};

GrowerOrganization.propTypes = {
  organizationName: PropTypes.string,
};
GrowerOrganization.defaultProps = {
  organizationName: null,
};

export default GrowerOrganization;
