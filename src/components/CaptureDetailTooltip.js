import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { getDateTimeStringLocale } from '../common/locale';
import Badge from '@material-ui/icons/PersonPin';
import AccessTime from '@material-ui/icons/DateRange';
import Note from '@material-ui/icons/Note';
import Person from '@material-ui/icons/Person';
import Nature from '@material-ui/icons/Nature';

const CaptureDetailTooltip = ({ capture, showCaptureClick }) => {
  const CaptureDetailTooltipUseStyles = makeStyles(() => ({
    box: {
      display: 'flex',
    },
    label: {
      marginLeft: '12px',
    },
  }));

  const CaptureDetailTooltipStyles = CaptureDetailTooltipUseStyles();

  return (
    <Box style={{ width: '160px', display: 'block' }}>
      <Card
        style={{ paddingTop: '4px', paddingBottom: '4px' }}
        onClick={(e) => showCaptureClick(e, capture)}
      >
        <CardActionArea>
          <Container>
            {capture.id && (
              <Box className={CaptureDetailTooltipStyles.box}>
                <Nature color="primary" />
                <Typography className={CaptureDetailTooltipStyles.label}>
                  {capture.id}
                </Typography>
              </Box>
            )}
            {capture.planterId && (
              <Box className={CaptureDetailTooltipStyles.box}>
                <Person color="primary" />
                <Typography className={CaptureDetailTooltipStyles.label}>
                  {capture.planterId}
                </Typography>
              </Box>
            )}
            {capture.planterIdentifier && (
              <Box className={CaptureDetailTooltipStyles.box}>
                <Badge color="primary" />
                <Typography className={CaptureDetailTooltipStyles.label}>
                  {capture.planterIdentifier}
                </Typography>
              </Box>
            )}
            {
              <Box className={CaptureDetailTooltipStyles.box}>
                <AccessTime color="primary" />
                <Typography className={CaptureDetailTooltipStyles.label}>
                  {getDateTimeStringLocale(capture.timeCreated)}
                </Typography>
              </Box>
            }
            {capture.note && (
              <Box className={CaptureDetailTooltipStyles.box}>
                <Note color="primary" />
                <Typography className={CaptureDetailTooltipStyles.label}>
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

export default CaptureDetailTooltip;
