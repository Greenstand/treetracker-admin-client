import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';

import Badge from '@material-ui/icons/PersonPin';
import AccessTime from '@material-ui/icons/DateRange';
import Note from '@material-ui/icons/Note';
import Person from '@material-ui/icons/Person';
import Nature from '@material-ui/icons/Nature';

const VerifyTooltip = ({ capture, showCaptureClick }) => {
  const verifyTooltipUseStyles = makeStyles(() => ({
    box: {
      display: 'flex',
    },
    label: {
      marginLeft: '12px',
    },
  }));

  const verifyTooltipStyles = verifyTooltipUseStyles();

  return (
    <Box style={{ width: '160px', display: 'block' }}>
      <Card
        style={{ paddingTop: '4px', paddingBottom: '4px' }}
        onClick={(e) => showCaptureClick(e, capture)}
      >
        <CardActionArea>
          <Container>
            {capture.id && (
              <Box className={verifyTooltipStyles.box}>
                <Nature color="primary" />
                <Typography className={verifyTooltipStyles.label}>
                  {capture.id}
                </Typography>
              </Box>
            )}
            {capture.planterId && (
              <Box className={verifyTooltipStyles.box}>
                <Person color="primary" />
                <Typography className={verifyTooltipStyles.label}>
                  {capture.planterId}
                </Typography>
              </Box>
            )}
            {capture.planterIdentifier && (
              <Box className={verifyTooltipStyles.box}>
                <Badge color="primary" />
                <Typography className={verifyTooltipStyles.label}>
                  {capture.planterIdentifier}
                </Typography>
              </Box>
            )}
            {
              <Box className={verifyTooltipStyles.box}>
                <AccessTime color="primary" />
                <Typography className={verifyTooltipStyles.label}>
                  {new Date(Date.parse(capture.timeCreated)).toDateString()}
                </Typography>
              </Box>
            }
            {capture.note && (
              <Box className={verifyTooltipStyles.box}>
                <Note color="primary" />
                <Typography className={verifyTooltipStyles.label}>
                  {capture.note}
                </Typography>
              </Box>
            )}
          </Container>
        </CardActionArea>
      </Card>
    </Box>
  );
};

export default VerifyTooltip;
