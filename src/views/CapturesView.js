import React, { useState, useEffect } from 'react';
import { documentTitle } from '../common/variables';
import { Grid } from '@material-ui/core';
import CaptureDetailDialog from '../components/CaptureDetailDialog';
import GrowerDetail from '../components/GrowerDetail';
import CaptureGallery from '../components/Captures/CaptureGallery';
// import SidePanel from '../components/SidePanel';
import CaptureTable from '../components/Captures/CaptureTable';
import { CaptureDetailProvider } from '../context/CaptureDetailContext';
import { CapturesProvider } from '../context/CapturesContext';
import { SpeciesProvider } from '../context/SpeciesContext';
import { TagsProvider } from '../context/TagsContext';
import CaptureFilterHeader from '../components/CaptureFilterHeader';

function CapturesView() {
  const [showGallery, setShowGallery] = useState(true);
  const [captureDetail, setCaptureDetail] = useState({
    isOpen: false,
    capture: {},
  });
  const [growerDetail, setGrowerDetail] = useState({
    isOpen: false,
    grower: {},
  });

  useEffect(() => {
    document.title = `Capture Data - ${documentTitle}`;
  }, []);

  function handleShowCaptureDetail(e, capture) {
    e.preventDefault();
    e.stopPropagation();
    setCaptureDetail({
      isOpen: true,
      capture: capture,
    });
  }

  function handleCloseCaptureDetail() {
    setCaptureDetail({
      isOpen: false,
      capture: {},
    });
  }

  async function handleShowGrowerDetail(e, planterId) {
    e.preventDefault();
    e.stopPropagation();
    setGrowerDetail({
      isOpen: true,
      growerId: planterId,
    });
  }

  function handleCloseGrowerDetail() {
    setGrowerDetail({
      isOpen: false,
      growerId: null,
    });
  }

  return (
    <Grid
      container
      direction="column"
      style={{ flexWrap: 'nowrap', height: '100%', overflow: 'hidden' }}
    >
      <CapturesProvider>
        <SpeciesProvider>
          <TagsProvider>
            <CaptureFilterHeader
              showGallery={showGallery}
              setShowGallery={setShowGallery}
            />
            {showGallery ? (
              <CaptureGallery
                setCaptureDetail={setCaptureDetail}
                setShowGallery={setShowGallery}
                handleShowCaptureDetail={handleShowCaptureDetail}
                handleShowGrowerDetail={handleShowGrowerDetail}
              />
            ) : (
              <CaptureTable
                setCaptureDetail={setCaptureDetail}
                setShowGallery={setShowGallery}
                handleShowCaptureDetail={handleShowCaptureDetail}
                handleShowGrowerDetail={handleShowGrowerDetail}
              />
            )}
            <GrowerDetail
              open={growerDetail.isOpen}
              growerId={growerDetail.growerId}
              onClose={() => handleCloseGrowerDetail()}
            />
            <CaptureDetailProvider>
              <CaptureDetailDialog
                open={captureDetail.isOpen}
                onClose={() => handleCloseCaptureDetail()}
                capture={captureDetail.capture}
              />
            </CaptureDetailProvider>
          </TagsProvider>
        </SpeciesProvider>
      </CapturesProvider>
    </Grid>
  );
}

export default CapturesView;
