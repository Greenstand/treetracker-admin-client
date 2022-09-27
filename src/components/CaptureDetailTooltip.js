import React, { useEffect, useState } from 'react';
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
import Category from '@material-ui/icons/Category';
import { useContext } from 'react';
import { SpeciesContext } from 'context/SpeciesContext';

const CaptureDetailTooltip = ({ capture, showCaptureClick }) => {
  const CaptureDetailTooltipUseStyles = makeStyles(() => ({
    box: {
      display: 'flex',
    },
    label: {
      marginLeft: '12px',
    },
  }));
  const [speciesName, setSpeciesName] = useState();
  const { speciesList } = useContext(SpeciesContext);

  useEffect(() => {
    setSpeciesName('');
    if (capture?.speciesId) {
      const currentSpecies = () => {
        return speciesList.find((species) => species.id === capture.speciesId);
      };
      const speciesData = currentSpecies();
      if (speciesData !== null) {
        setSpeciesName(speciesData.name);
      }
    }
  }, [capture]);

  const CaptureDetailTooltipStyles = CaptureDetailTooltipUseStyles();
  return (
    <Box style={{ width: '160px', display: 'block' }}>
      <Card
        style={{ paddingTop: '4px', paddingBottom: '4px' }}
        onClick={(e) => showCaptureClick(e, capture)}
      >
        <CardActionArea>
          <Container>
            {capture?.speciesId && (
              <Box className={CaptureDetailTooltipStyles.box}>
                <Category color="primary" />
                <Typography className={CaptureDetailTooltipStyles.label}>
                  {speciesName}
                </Typography>
              </Box>
            )}
            {capture.reference_id && (
              <Box className={CaptureDetailTooltipStyles.box}>
                <Nature color="primary" />
                <Typography className={CaptureDetailTooltipStyles.label}>
                  {capture.reference_id}
                </Typography>
              </Box>
            )}
            {capture.grower_account_id && (
              <Box className={CaptureDetailTooltipStyles.box}>
                <Person color="primary" />
                <Typography className={CaptureDetailTooltipStyles.label}>
                  {capture.grower_account_id}
                </Typography>
              </Box>
            )}
            {capture.wallet && (
              <Box className={CaptureDetailTooltipStyles.box}>
                <Badge color="primary" />
                <Typography className={CaptureDetailTooltipStyles.label}>
                  {capture.wallet}
                </Typography>
              </Box>
            )}
            {
              <Box className={CaptureDetailTooltipStyles.box}>
                <AccessTime color="primary" />
                <Typography className={CaptureDetailTooltipStyles.label}>
                  {getDateTimeStringLocale(capture.created_at)}
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
