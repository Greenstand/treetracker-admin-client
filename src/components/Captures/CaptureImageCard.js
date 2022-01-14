import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import { LocationOn } from '@material-ui/icons';
import CheckIcon from '@material-ui/icons/Check';
import Map from '@material-ui/icons/Map';
import Nature from '@material-ui/icons/Nature';
import Person from '@material-ui/icons/Person';
import OptimizedImage from './../OptimizedImage';

const useStyles = makeStyles((theme) => ({
  card: {
    cursor: 'pointer',
    '&:hover $cardMedia': {
      transform: 'scale(1.04)',
    },
  },
  cardCheckbox: {
    position: 'absolute',
    height: '1.2em',
    width: '1.2em',
    top: '0.2rem',
    left: '0.3rem',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  cardSelected: {
    backgroundColor: theme.palette.action.selected,
  },
  cardContent: {
    padding: '87% 0 0 0',
    position: 'relative',
    overflow: 'hidden',
  },
  cardMedia: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    transform: 'scale(1)',
    transition: theme.transitions.create('transform', {
      easing: theme.transitions.easing.easeInOut,
      duration: '0.2s',
    }),
  },
  cardWrapper: {
    position: 'relative',
    padding: theme.spacing(2),
  },
  placeholderCard: {
    pointerEvents: 'none',
    '& $card': {
      background: '#eee',
      '& *': {
        opacity: 0,
      },
    },
  },
  cardActions: {
    display: 'flex',
    padding: theme.spacing(0, 2),
  },
}));

const CaptureImageCard = ({
  capture,
  isCaptureSelected,
  handleCaptureClick,
  handleShowGrowerDetail,
  handleShowCaptureDetail,
  handleCapturePinClick,
  handleGrowerMapClick,
}) => {
  const classes = useStyles();

  return (
    <Grid item xs={12} sm={3} md={2} xl={2}>
      <div
        className={clsx(
          classes.cardWrapper,
          isCaptureSelected(capture.id) ? classes.cardSelected : undefined,
          capture.placeholder && classes.placeholderCard
        )}
      >
        {isCaptureSelected(capture.id) && (
          <Paper className={classes.cardCheckbox} elevation={4}>
            <CheckIcon />
          </Paper>
        )}
        <Card
          onClick={(e) => handleCaptureClick(e, capture.id)}
          id={`card_${capture.id}`}
          className={classes.card}
          elevation={capture.placeholder ? 0 : 3}
        >
          <CardContent className={classes.cardContent}>
            <OptimizedImage
              src={capture.imageUrl}
              width={400}
              className={classes.cardMedia}
            />
          </CardContent>

          <Grid justify="center" container className={classes.cardActions}>
            <Grid item>
              <IconButton
                onClick={(e) => handleShowGrowerDetail(e, capture.planterId)}
                aria-label={`Grower details`}
                title={`Grower details`}
              >
                <Person color="primary" />
              </IconButton>
              <IconButton
                onClick={(e) => handleShowCaptureDetail(e, capture)}
                aria-label={`Capture details`}
                title={`Capture details`}
              >
                <Nature color="primary" />
              </IconButton>
              <IconButton
                variant="link"
                href={`${process.env.REACT_APP_WEBMAP_DOMAIN}/?treeid=${capture.id}`}
                target="_blank"
                onClick={(e) => handleCapturePinClick(e, capture.id)}
                aria-label={`Capture location`}
                title={`Capture location`}
              >
                <LocationOn color="primary" />
              </IconButton>
              <IconButton
                variant="link"
                href={`${process.env.REACT_APP_WEBMAP_DOMAIN}/?userid=${capture.planterId}`}
                target="_blank"
                onClick={(e) => handleGrowerMapClick(e, capture.planterId)}
                aria-label={`Grower map`}
                title={`Grower map`}
              >
                <Map color="primary" />
              </IconButton>
            </Grid>
          </Grid>
        </Card>
      </div>
    </Grid>
  );
};

export default CaptureImageCard;
