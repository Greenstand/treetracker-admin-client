import React, { useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Fab,
  Grid,
  CircularProgress,
  Card,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import {
  ChevronLeft,
  ChevronRight,
  Edit as EditIcon,
} from '@material-ui/icons';
import Rotate90DegreesCcwIcon from '@material-ui/icons/Rotate90DegreesCcw';
import OptimizedImage from './OptimizedImage';

/* This component currently uses fixed size cards and scroll window,
 * but it wouldn't be too difficult to make it more flexible.
 */
const MAX_IMAGES_INCREMENT = 20;
const IMAGE_CARD_SIZE = 150;
const NUM_IMAGE_CARDS = 3;
const SCROLL_BUTTON_SIZE = 48;

const useStyle = makeStyles((theme) => ({
  container: {
    position: 'relative',
    width: `${IMAGE_CARD_SIZE * NUM_IMAGE_CARDS}px`,
  },
  imageList: {
    height: `${IMAGE_CARD_SIZE}px`,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    overflowX: 'auto',
    marginBottom: theme.spacing(4),
    justifyContent: 'start',
    alignItems: 'center',
    textAlign: 'center',
  },
  imageCard: {
    height: '100%',
    margin: theme.spacing(1.5),
    width: `${IMAGE_CARD_SIZE - theme.spacing(3)}px`,
    cursor: 'pointer',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  selectedImageCard: {
    border: `inset ${theme.spacing(1.5)}px ${theme.palette.primary.main}`,
    margin: 0,
  },
  scrollButton: {
    height: `${SCROLL_BUTTON_SIZE}px`,
    width: `${SCROLL_BUTTON_SIZE}px`,
    position: 'absolute',
    top: `${IMAGE_CARD_SIZE / 2 - SCROLL_BUTTON_SIZE / 2}px`,
  },
  scrollLeft: {
    left: `-${SCROLL_BUTTON_SIZE / 2}px`,
  },
  scrollRight: {
    right: `-${SCROLL_BUTTON_SIZE / 2}px`,
  },
  editOverlay: {
    display: 'none',
  },
  clickEdit: {
    margin: 5,
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 32,
    height: 32,
    zIndex: 5,
  },
  loadMore: {
    margin: theme.spacing(1.5),
  },
  placeholder: {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    textAlign: 'center',
    height: '100%',
  },
  clickRotate: {
    margin: 5,
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
  },
}));

export default function ImageScroller(props) {
  const {
    images,
    selectedImage,
    loading = false,
    blankMessage = '',
    imageRotation,
    onSelectChange,
    onUpload,
  } = props;
  const classes = useStyle();
  const [maxImages, setMaxImages] = useState(MAX_IMAGES_INCREMENT);
  const imageScrollerRef = useRef(null);
  let [rotation, setRotation] = useState(imageRotation);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [pendingUrl, setPendingUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  function loadMoreImages() {
    setMaxImages(maxImages + MAX_IMAGES_INCREMENT);
  }

  function scrollImagesLeft() {
    scrollImages(-NUM_IMAGE_CARDS);
  }

  function scrollImagesRight() {
    scrollImages(NUM_IMAGE_CARDS);
  }

  function scrollImages(numImages) {
    const startPos =
      Math.round(imageScrollerRef.current.scrollLeft / IMAGE_CARD_SIZE) *
      IMAGE_CARD_SIZE;
    imageScrollerRef.current.scrollTo({
      top: 0,
      left: startPos + numImages * IMAGE_CARD_SIZE,
      behavior: 'smooth',
    });
  }

  function handleRotationChange() {
    let newRotation = rotation + 90;
    if (newRotation > 270) {
      newRotation = 0;
    }
    setRotation(newRotation);
    onSelectChange('imageRotation', newRotation);
  }

  function handleImageChange(img) {
    onSelectChange('imageUrl', img);
    if (images.length > 1) {
      setRotation(0);
    }
  }

  function openEditDialog() {
    setEditDialogOpen(true);
  }

  function closeEditDialog() {
    setEditDialogOpen(false);
    setPendingUrl('');
    setPreviewUrl('');
  }

  function scaleToSquareImage(file, size = IMAGE_CARD_SIZE) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (ev) {
        const img = new Image();
        img.onload = function () {
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');

          const aspect = img.width / img.height;
          let sw = img.width;
          let sh = img.height;
          let sx = 0;
          let sy = 0;

          if (aspect > 1) {
            // landscape
            sw = img.height;
            sx = (img.width - img.height) / 2;
          } else {
            // portrait
            sh = img.width;
            sy = (img.height - img.width) / 2;
          }

          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, size, size);
          resolve(canvas.toDataURL('image/jpeg', 0.9));
        };
        img.onerror = reject;
        img.src = ev.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleFileInput(event) {
    const file = event?.target?.files?.[0];
    if (!file) {
      setPreviewUrl('');
      return;
    }

    setPendingUrl('');

    try {
      const scaledDataUrl = await scaleToSquareImage(file, IMAGE_CARD_SIZE);
      setPreviewUrl(scaledDataUrl);
    } catch (_) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }

  function handleUrlInput(event) {
    setPendingUrl(event.target.value);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
  }

  function handleUpload() {
    const chosenUrl = pendingUrl?.trim() || previewUrl;
    if (!chosenUrl) {
      return;
    }

    if (onUpload) {
      onUpload(chosenUrl);
    }

    onSelectChange('imageUrl', chosenUrl);

    if (previewUrl && !pendingUrl) {
      // keep preview URL for display until dialog closes
    }

    closeEditDialog();
  }

  return (
    <div className={classes.container}>
      <Grid
        item
        className={`image-list ${classes.imageList}`}
        ref={imageScrollerRef}
      >
        {loading ? (
          <div className={classes.placeholder}>
            <CircularProgress id="loading" />
          </div>
        ) : images.length ? (
          images.slice(0, maxImages).map((img, idx) => (
            <Card
              key={`${idx}_${img}`}
              className={`image-card ${classes.imageCard} ${
                img === selectedImage && classes.selectedImageCard
              }`}
            >
              <OptimizedImage
                src={img}
                width={IMAGE_CARD_SIZE}
                height={IMAGE_CARD_SIZE}
                className={classes.image}
                fixed
                rotation={img === selectedImage ? rotation : 0}
                onClick={() => handleImageChange(img)}
              />
              {img === selectedImage && (
                <>
                  <Fab
                    id="click-rotate"
                    className={classes.clickRotate}
                    onClick={handleRotationChange}
                  >
                    <Rotate90DegreesCcwIcon
                      style={{ transform: `rotateY(180deg)` }}
                    />
                  </Fab>
                  <Fab
                    id="click-edit"
                    className={classes.clickEdit}
                    onClick={openEditDialog}
                    size="small"
                  >
                    <EditIcon style={{ transform: 'scale(0.8)' }} />
                  </Fab>
                </>
              )}
            </Card>
          ))
        ) : (
          <div className={classes.placeholder}>{blankMessage}</div>
        )}
        {maxImages < images.length && (
          <Button
            id="load-more"
            className={classes.loadMore}
            onClick={loadMoreImages}
          >
            Load more
          </Button>
        )}
      </Grid>
      {images.length > NUM_IMAGE_CARDS && (
        <>
          <Fab
            id="scroll-left"
            className={`${classes.scrollButton} ${classes.scrollLeft}`}
            onClick={scrollImagesLeft}
          >
            <ChevronLeft />
          </Fab>
          <Fab
            id="scroll-right"
            className={`${classes.scrollButton} ${classes.scrollRight}`}
            onClick={scrollImagesRight}
          >
            <ChevronRight />
          </Fab>
        </>
      )}

      <Dialog
        open={editDialogOpen}
        onClose={closeEditDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit grower image</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <input
                id="new-image-file"
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                data-testid="image-file-input"
              />
            </Grid>
            <Grid item>
              <TextField
                label="Or paste image URL"
                value={pendingUrl}
                onChange={handleUrlInput}
                fullWidth
                variant="outlined"
                data-testid="image-url-input"
              />
            </Grid>
            <Grid item>
              {(previewUrl || pendingUrl) && (
                <img
                  src={pendingUrl || previewUrl}
                  alt="Preview"
                  style={{
                    width: '100%',
                    maxHeight: 240,
                    objectFit: 'contain',
                  }}
                  data-testid="image-preview"
                />
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog}>Cancel</Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            color="primary"
            disabled={!pendingUrl && !previewUrl}
          >
            Upload & use
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
