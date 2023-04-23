import React from 'react';
import { Box, Divider, Typography } from '@material-ui/core';
import EmailIcon from '@material-ui/icons/EmailOutlined';
import PhoneIcon from '@material-ui/icons/PhoneOutlined';
import OrgIcon from '@material-ui/icons/LanguageOutlined';
import Person from '@material-ui/icons/Person';
import GrowerOrganization from '../GrowerOrganization';
import OptimizedImage from '../OptimizedImage';
import { useStyle } from './Growers.styles.js';
const SIZE = 32;

const GrowerTooltip = ({ grower, growerClick }) => {
  const classes = useStyle();
  const matches = grower.imageUrl?.match(/\/\/(.*?)\/(.*)/);

  return (
    <Box className={classes.tooltipCard} onClick={() => growerClick(grower)}>
      <Box className={classes.tooltipCardHeader}>
        {matches?.length > 1 ? (
          <OptimizedImage
            rotation={grower.image_rotation}
            src={grower.imageUrl}
            width={SIZE}
            height={SIZE}
            style={{
              height: `${SIZE}px`,
              width: `${SIZE}px`,
            }}
          />
        ) : (
          <Person style={{ fill: '#ccc' }} />
        )}
        <Typography className={classes.tooltipTitle}>
          {grower.firstName} {grower.lastName}
        </Typography>
      </Box>

      <Divider variant="middle" />

      <Box m={1}>
        {grower.email && (
          <Box className={classes.tooltipIcon}>
            <EmailIcon color="primary" />
            <Typography className={classes.tooltipLabel}>
              {grower.email}
            </Typography>
          </Box>
        )}
        {(grower.organizaton || grower.organizationId) && (
          <Box className={classes.tooltipIcon}>
            <OrgIcon color="primary" />
            <Box className={classes.tooltipLabel}>
              <GrowerOrganization
                organizationName={grower.organization}
                assignedOrganizationId={grower.organizationId}
                compact={true}
              />
            </Box>
          </Box>
        )}
        {grower.phone && (
          <Box className={classes.tooltipIcon}>
            <PhoneIcon color="primary" />
            <Typography className={classes.tooltipLabel}>
              {grower.phone}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default GrowerTooltip;
