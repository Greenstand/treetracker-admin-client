import React from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  Divider,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import EmailIcon from '@material-ui/icons/EmailOutlined';
import PhoneIcon from '@material-ui/icons/PhoneOutlined';
import OrgIcon from '@material-ui/icons/LanguageOutlined';
import GrowerOrganization from '../GrowerOrganization';

const GrowerTooltip = ({ grower, growerClick }) => {
  const useStyles = makeStyles(() => ({
    box: {
      display: 'flex',
      marginTop: '2px',
    },
    label: {
      marginLeft: '12px',
    },
  }));

  const growerToolTipStyles = useStyles();

  return (
    <Box>
      <Box style={{ width: '160px', display: 'block' }}>
        <Card
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          onClick={() => growerClick(grower)}
        >
          <CardActionArea>
            <Box style={{ display: 'flex', margin: '4px' }}>
              <Box
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  margin: '2px',
                }}
              >
                <CardMedia
                  component="img"
                  height="24px"
                  width="24px"
                  // style={{ borderRadius: '10px' }}
                  image={grower.imageUrl}
                />
              </Box>
              <Box>
                <Typography
                  className={growerToolTipStyles.label}
                >
                  {grower.firstName} {grower.lastName}
                </Typography>
              </Box>
            </Box>
            <Divider
              variant="middle"
              sx={{
                marginBottom: '2px',
                marginTop: '4px',
              }}
            />
            <Box
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                margin: '0 4px 0 4px',
              }}
            >
              {grower.email && (
                <Box className={growerToolTipStyles.box}>
                  <EmailIcon color="primary" />
                  <Typography
                    className={growerToolTipStyles.label}
                  >
                    {grower.email}
                  </Typography>
                </Box>
              )}
              {(grower.organizaton || grower.organizationId) && (
                <Box className={growerToolTipStyles.box}>
                  <OrgIcon color="primary" />
                    <Box className={growerToolTipStyles.label}>
                      <GrowerOrganization
                        organizationName={grower.organization}
                        assignedOrganizationId={grower.organizationId}
                        compact={true}
                      />
                    </Box>
                </Box>
              )}
              {grower.phone && (
                <Box className={growerToolTipStyles.box}>
                  <PhoneIcon color="primary"/>
                  <Typography
                    className={growerToolTipStyles.label}
                  >
                    {grower.phone}
                  </Typography>
                </Box>
              )}
            </Box>
          </CardActionArea>
        </Card>
      </Box>
    </Box>
  );
};

export default GrowerTooltip;
