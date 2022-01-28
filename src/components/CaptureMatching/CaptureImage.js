import React from 'react';

import CaptureHeader from './CaptureHeader';
import Grower from './Grower';

import { Tooltip, Typography, Box, Button, Paper } from '@material-ui/core';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import { makeStyles } from '@material-ui/core/styles';
import { getDateTimeStringLocale } from 'common/locale';

function Country({ lat, lon }) {
  const [content, setContent] = React.useState('');
  if (lat === 'undefined' || lon === 'undefined') {
    setContent('No data');
  }

  React.useEffect(() => {
    setContent('loading...');
    fetch(
      `${process.env.REACT_APP_QUERY_API_ROOT}/countries?lat=${lat}&lon=${lon}`
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else if (res.status === 404) {
          setContent('Can not find country at this place');
          return Promise.reject();
        } else {
          setContent('Unknown error');
          return Promise.reject();
        }
      })
      .then((data) => {
        setContent(data.countries[0].name);
      });
    // .catch(err => {
    //   console.error('e:', err);
    //   setContent('Unknown error');
    // });
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
    // height: '52vh',
    flexGrow: 1,
    overflow: 'scroll',
  },

  imgContainer: {
    width: '100%',
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
    width: 71,
    height: 31,
  },
}));

function CaptureImage(props) {
  const {
    captureImages,
    currentPage,
    noOfPages,
    handleChange,
    imgPerPage,
    imgCount,
    handleSkip,
  } = props;

  const classes = useStyles();

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
        captureImages
          .slice((currentPage - 1) * imgPerPage, currentPage * imgPerPage)
          .map((capture) => {
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
                    {/* <UseLocation/> */}
                  </Box>

                  <Grower
                    planter_photo_url={capture.planter_photo_url}
                    planter_username={capture.planter_username}
                    status={capture.status}
                  />

                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleSkip}
                    className={classes.button}
                  >
                    Skip
                    <SkipNextIcon />
                  </Button>
                </Box>

                <Box className={classes.imgBox}>
                  {/* {treeList.slice(0, 1).map( img => { */}

                  <img
                    key={capture.id}
                    className={classes.imgContainer}
                    src={capture.image_url}
                    alt={`Capture ${capture.id}`}
                  />
                </Box>
              </Paper>
            );
          })}
    </Box>
  );
}

export default CaptureImage;
