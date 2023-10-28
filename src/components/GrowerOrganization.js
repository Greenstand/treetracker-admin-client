import React, { useContext } from 'react';

import { AppContext } from '../context/AppContext.js';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { getOrganizationById } from 'utilities/index.js';

import {
  Paper,
  List,
  ListItem,
  Collapse,
  FormControlLabel,
  Radio,
  ListItemText,
} from '@material-ui/core';

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

  const assignedOrganization = getOrganizationById(
    appContext.orgList,
    assignedOrganizationId
  );

  const renderGrowerOrganization = () => (
    <Typography style={{ color: '#C0C0C0', fontStyle: 'italic' }}>
      {organizationName}
    </Typography>
  );
  const renderGrowerAssignedOrganization = (assignedOrganization) => {
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };
    const subOrganizations = ['SubOrg1', 'SubOrg2', 'SubOrg3'];

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Paper
          elevation={0}
          style={{
            width: '150px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px',
              cursor: 'pointer',
            }}
          >
            <Typography variant="h6">
              {assignedOrganization.name} ({assignedOrganization.id})
            </Typography>
          </div>
          <Collapse in={expanded} style={{ padding: '10px', marginTop: '0' }}>
            <div>
              <List>
                {subOrganizations.map((subOrg, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={subOrg} />
                  </ListItem>
                ))}
              </List>
            </div>
          </Collapse>
        </Paper>
        <div style={{ position: 'relative' }}>
          <FormControlLabel
            control={<Radio checked={expanded} onClick={handleExpandClick} />}
            label="Show Sub-Orgs"
            style={{
              right: '0',
              position: 'absolute',
              top: '20px',
              left: '-160px',
              display: 'block',
            }}
          />
        </div>
      </div>
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
      {assignedOrganization &&
        renderGrowerAssignedOrganization(assignedOrganization)}
      {organizationName &&
        (!compact || !assignedOrganization) &&
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
