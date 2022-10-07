import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid, Typography, CardActionArea } from '@material-ui/core';
import Badge from '@material-ui/icons/PersonPin';
import AccessTime from '@material-ui/icons/DateRange';
import { Note, Nature, Category } from '@material-ui/icons';
import { getDateTimeStringLocale } from 'common/locale';
import { SpeciesContext } from 'context/SpeciesContext';

const CaptureDetailTooltip = ({ capture, showCaptureClick }) => {
  const CaptureDetailTooltipUseStyles = makeStyles(() => ({
    button: {
      padding: '4px',
    },
    label: {
      marginLeft: '12px',
    },
  }));
  const styles = CaptureDetailTooltipUseStyles();

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

  return (
    <Box width={160} onClick={showCaptureClick(capture)}>
      <CardActionArea className={styles.button}>
        {capture?.species_id && (
          <Grid container>
            <Category color="primary" />
            <Typography className={styles.label}>{speciesName}</Typography>
          </Grid>
        )}
        {capture.reference_id && (
          <Grid container>
            <Nature color="primary" />
            <Typography className={styles.label}>
              {capture.reference_id}
            </Typography>
          </Grid>
        )}
        {capture.wallet && (
          <Grid container>
            <Badge color="primary" />
            <Typography className={styles.label}>{capture.wallet}</Typography>
          </Grid>
        )}
        {capture.captured_at && (
          <Grid container>
            <AccessTime color="primary" />
            <Typography className={styles.label}>
              {getDateTimeStringLocale(capture.captured_at)}
            </Typography>
          </Grid>
        )}
        {capture.note && (
          <Grid container>
            <Note color="primary" />
            <Typography className={styles.label}>{capture.note}</Typography>
          </Grid>
        )}
      </CardActionArea>
    </Box>
  );
};

export default CaptureDetailTooltip;
