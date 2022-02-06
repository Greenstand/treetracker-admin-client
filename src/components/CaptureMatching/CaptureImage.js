import React, { useState, useEffect, useCallback } from 'react';

import CaptureHeader from './CaptureHeader';
import Grower from './Grower';
import OptimizedImage from '../OptimizedImage';
import { Tooltip, Typography, Box, Button, Paper } from '@material-ui/core';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import { makeStyles } from '@material-ui/core/styles';
import { getDateTimeStringLocale } from 'common/locale';

function Country({ lat, lon }) {
  const [content, setContent] = useState('');
  if (lat === 'undefined' || lon === 'undefined') {
    setContent('No data');
  }

  useEffect(() => {
    setContent('loading...');
    fetch(
      `${process.env.REACT_APP_QUERY_API_ROOT}/countries?lat=${lat}&lon=${lon}`
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else if (res.status === 404) {
          setContent(`Can not find country at lat:${lat}, lon:${lon}`);
          return Promise.reject();
        } else {
          setContent('Unknown error');
          return Promise.reject();
        }
      })
      .then((data) => {
        setContent(data.countries[0].name);
      });
  }, []);

  return <span>{content}</span>;
}

const useStyles = makeStyles((theme) => ({
  containerBox: {
    background: '#fff',
    borderRadius: '4px',
    flexGrow: '1',
    display: 'flex',
    flexDirection: 'column',
    height: '1px',
  },

  headerBox: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
    alignItems: 'center',
  },

  imgBox: {
    flexGrow: 1,
    overflow: 'auto',
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(2),
  },

  imgContainer: {
    objectFit: 'contain',
  },
  captureInfo: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
  },
  box1: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  box3: {
    display: 'flex',
    gap: '4px',
    justifyContent: 'start',
    alignItems: 'center',
    marginTop: '4px',
    '& svg': {
      width: '16px',
      height: '16px',
    },
  },
  button: {
    height: '100%',
  },
}));

function CaptureImage(props) {
  const {
    captureImages,
    currentPage,
    noOfPages,
    handleChange,
    imgCount,
    handleSkip,
  } = props;
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const classes = useStyles();

  const resizeWindow = useCallback(() => {
    setScreenWidth(window.innerWidth);
    setScreenHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', resizeWindow);
    return () => {
      window.removeEventListener('resize', resizeWindow);
    };
  }, [resizeWindow]);

  return (
    <Box className={classes.box1}>
      <CaptureHeader
        currentPage={currentPage}
        handleChange={handleChange}
        imgCount={imgCount}
        handleSkip={handleSkip}
        noOfPages={noOfPages}
        captureImages={captureImages}
      />

      <Box height={16} />

      {captureImages &&
        captureImages.map((capture) => {
          return (
            <Paper
              elevation={4}
              key={`capture_${capture.id}`}
              className={classes.containerBox}
            >
              <Box className={classes.headerBox}>
                <Box className={classes.box2}>
                  <Tooltip title={capture.id}>
                    <Typography variant="h5">
                      Capture {(capture.id + '').substring(0, 10) + '...'}
                    </Typography>
                  </Tooltip>
                  <Box className={classes.captureInfo}>
                    <Box className={classes.box3}>
                      <AccessTimeIcon />
                      <Typography variant="body1">
                        {getDateTimeStringLocale(capture.created_at)}
                      </Typography>
                    </Box>
                    <Box className={classes.box3}>
                      <LocationOnOutlinedIcon />
                      <Typography variant="body1">
                        <Country lat={capture.lat} lon={capture.lon} />
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Grower
                  grower_photo_url={capture.grower_photo_url}
                  grower_username={capture.grower_username}
                  planting_organization_id={capture.planting_organization_id}
                />

                <Button
                  variant="text"
                  color="primary"
                  onClick={handleSkip}
                  className={classes.button}
                >
                  Skip
                  <SkipNextIcon />
                </Button>
              </Box>

              <Box className={classes.imgBox}>
                <OptimizedImage
                  id={capture.id}
                  src={capture.image_url}
                  alt={`Capture ${capture.id}`}
                  width={screenWidth * 0.5}
                  height={screenHeight * 0.6}
                  style={{ maxWidth: '100%', maxHeight: '100%' }}
                />
              </Box>
            </Paper>
          );
        })}
    </Box>
  );
}

export default CaptureImage;
