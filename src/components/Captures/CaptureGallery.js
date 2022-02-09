import React, { /*useEffect, useState,*/ useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button'; // replace with icons down the line
import Grid from '@material-ui/core/Grid';
// import LinearProgress from '@material-ui/core/LinearProgress';
// import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import TablePagination from '@material-ui/core/TablePagination';

import TableChartIcon from '@material-ui/icons/TableChart';
import CaptureImageCard from './CaptureImageCard';
// import CaptureEdit from './../CaptureEdit';
import styles from './CaptureGallery.styles';
import { countToLocaleString } from '../../common/numbers';
import { CapturesContext } from '../../context/CapturesContext';
// import { SpeciesContext } from '../../context/SpeciesContext';
// import { TagsContext } from '../../context/TagsContext';

const log = require('loglevel').getLogger('../components/CaptureGallery');

const useStyles = makeStyles(styles);

const CaptureGallery = ({
  setShowGallery,
  handleShowCaptureDetail,
  handleShowGrowerDetail,
}) => {
  const {
    captures,
    captureCount,
    capturesSelected,
    isLoading,
    // isApproveAllProcessing,
    rowsPerPage,
    page,
    // approveAllComplete,
    // approveAll,
    // clickCapture,
    setPage,
    setRowsPerPage,
  } = useContext(CapturesContext);

  const classes = useStyles();
  // const speciesContext = useContext(SpeciesContext);
  // const tagsContext = useContext(TagsContext);
  // const [complete, setComplete] = useState(0);

  /* to display progress */
  // useEffect(() => {
  //   log.debug('-- approve all complete');
  //   setComplete(approveAllComplete);
  // }, [approveAllComplete]);

  function handleCaptureClick(e, capture) {
    e.stopPropagation();
    e.preventDefault();
    log.debug('click on capture:%d', capture);
    handleShowCaptureDetail(e, capture);
    //   clickCapture({
    //     capture,
    //     isShift: e.shiftKey,
    //     isCmd: e.metaKey,
    //     isCtrl: e.ctrlKey,
    //   });
  }

  function handleCapturePinClick(e, captureId) {
    e.stopPropagation();
    e.preventDefault();
    log.debug('click on capture pin:%d', captureId);
    const url = `${process.env.REACT_APP_WEBMAP_DOMAIN}/?treeid=${captureId}`;
    window.open(url, '_blank').opener = null;
  }

  function handleGrowerMapClick(e, growerId) {
    e.stopPropagation();
    e.preventDefault();
    log.debug('click on grower:%d', growerId);
    const url = `${process.env.REACT_APP_WEBMAP_DOMAIN}/?userid=${growerId}`;
    window.open(url, '_blank').opener = null;
  }

  // function resetApprovalFields() {
  //   tagsContext.setTagInput([]);
  //   speciesContext.setSpeciesInput('');
  // }

  // async function handleSubmit(editData) {
  //   log.debug('updateAction:', editData);
  //   // check selection
  //   if (capturesSelected.length === 0) {
  //     window.alert('Please select one or more captures');
  //     return;
  //   }
  //   const speciesId = await speciesContext.getSpeciesId();
  //   if (speciesId) {
  //     editData.speciesId = speciesId;
  //     log.debug('species id:', speciesId);
  //   }

  //   // create/retrieve tags
  //   editData.tags = await tagsContext.updateTags();
  //   const result = await approveAll(editData);
  //   if (!result) {
  //     window.alert('Failed to update a capture');
  //   } else if (!editData.rememberSelection) {
  //     resetApprovalFields();
  //   }
  // }

  function handleChangeRowsPerPage(event) {
    setPage(0);
    setRowsPerPage(event.target.value);
  }

  function handleChangePage(event, page) {
    setPage(page);
  }

  function isCaptureSelected(id) {
    return capturesSelected?.indexOf(id) >= 0;
  }

  const placeholderImages = isLoading
    ? Array(Math.max(rowsPerPage - captures.length, 0))
        .fill()
        .map((_, index) => {
          return {
            id: index,
            placeholder: true,
          };
        })
    : [];

  const captureImageItems = captures
    .concat(placeholderImages)
    .map((capture) => {
      return (
        <CaptureImageCard
          key={capture.id}
          capture={capture}
          isCaptureSelected={isCaptureSelected}
          handleCaptureClick={handleCaptureClick}
          handleShowGrowerDetail={handleShowGrowerDetail}
          handleShowCaptureDetail={handleShowCaptureDetail}
          handleCapturePinClick={handleCapturePinClick}
          handleGrowerMapClick={handleGrowerMapClick}
        />
      );
    });

  let imagePagination = (
    <TablePagination
      rowsPerPageOptions={[24, 96, 192, 384]}
      component="div"
      count={captureCount || 0}
      rowsPerPage={rowsPerPage}
      page={page}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      labelRowsPerPage="Captures per page:"
    />
  );

  return (
    <>
      <Grid item className={classes.body}>
        <Grid item className={classes.bodyInner}>
          <Grid container>
            <Grid
              item
              // ref={{ refContainer }}
              style={{
                width: '100%',
              }}
            >
              <Grid
                container
                justify="space-between"
                alignItems="center"
                className={classes.title}
              >
                <Typography variant="h5">
                  {captureCount !== null &&
                    `${countToLocaleString(captureCount)} capture${
                      captureCount === 1 ? '' : 's'
                    }`}
                </Typography>

                <Grid className={classes.cornerTable}>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => setShowGallery(false)}
                    startIcon={<TableChartIcon />}
                  >
                    Table View
                  </Button>
                  {imagePagination}
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid
                container
                className={classes.wrapper}
                spacing={1}
                data-testid="captures-gallery"
              >
                {captureImageItems}
              </Grid>
            </Grid>
            <Grid item container justify="flex-end" className={classes.title}>
              {imagePagination}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* <CaptureEdit
        onSubmit={handleSubmit}
        submitEnabled={captures.length > 0}
        variant="persistent"
      />
      {isApproveAllProcessing && (
        <AppBar
          position="fixed"
          style={{
            zIndex: 10000,
          }}
        >
          <LinearProgress
            color="primary"
            variant="determinate"
            value={complete}
          />
        </AppBar>
      )}
      {isApproveAllProcessing && (
        <Modal open={true} className={classes.modal}>
          <div className={classes.modalContent}>
            <h3>PROCESSING ... {parseInt(complete)}% complete</h3>
            <LinearProgress
              color="primary"
              variant="determinate"
              value={complete}
            />
          </div>
        </Modal>
      )} */}
    </>
  );
};

export default CaptureGallery;
