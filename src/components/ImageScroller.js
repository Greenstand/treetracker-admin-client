import React, { useState, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Fab,
  Grid,
  CircularProgress,
  Card,
  CardMedia,
  Button,
} from '@material-ui/core'
import {
  ChevronLeft,
  ChevronRight,
} from '@material-ui/icons'

/* This component currently uses fixed size cards and scroll window,
 * but it wouldn't be too difficult to make it more flexible.
 */
const MAX_IMAGES_INCREMENT = 20
const IMAGE_CARD_SIZE = 150
const NUM_IMAGE_CARDS = 3
const SCROLL_BUTTON_SIZE = 48

const useStyle = makeStyles(theme => ({
  container: {
    position: 'relative',
    width: `${IMAGE_CARD_SIZE * NUM_IMAGE_CARDS}px`,
  },
  imageList: {
    height: `${IMAGE_CARD_SIZE + 16}px`,
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
    border: `solid ${theme.spacing(1.5)}px ${theme.palette.primary.main}`,
    margin: 0,
  },
  scrollButton: {
    height: `${SCROLL_BUTTON_SIZE}px`,
    width: `${SCROLL_BUTTON_SIZE}px`,
    position: 'absolute',
    top: `${IMAGE_CARD_SIZE/2 - SCROLL_BUTTON_SIZE/2}px`
  },
  scrollLeft: {
    left: `-${SCROLL_BUTTON_SIZE/2}px`,
  },
  scrollRight: {
    right: `-${SCROLL_BUTTON_SIZE/2}px`,
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
}));

export default function ImageScroller(props) {
  
  const {
    images,
    selectedImage,
    onSelectImage,
    loading = false,
    blankMessage = ''
  } = props;

  const classes = useStyle()
  const [ maxImages, setMaxImages ] = useState(MAX_IMAGES_INCREMENT)
  const imageScrollerRef = useRef(null);

  function loadMoreImages() {
    setMaxImages(maxImages + MAX_IMAGES_INCREMENT)
  }

  function scrollImagesLeft() {
    scrollImages(-NUM_IMAGE_CARDS)
  }

  function scrollImagesRight() {
    scrollImages(NUM_IMAGE_CARDS)
  }

  function scrollImages(numImages) {
    const startPos = Math.round(imageScrollerRef.current.scrollLeft/IMAGE_CARD_SIZE) * IMAGE_CARD_SIZE
    imageScrollerRef.current.scrollTo({
      top: 0,
      left: startPos + numImages*IMAGE_CARD_SIZE,
      behavior: 'smooth'
    })
  }

  return (
    <div className={classes.container}>
      <Grid item className={`image-list ${classes.imageList}`} ref={imageScrollerRef}>
      {loading ? <div className={classes.placeholder}><CircularProgress id="loading"/></div> :
        (images.length ? 
          images.slice(0, maxImages).map((img, idx) =>
            <Card key={`${idx}_${img}`} onClick={() => onSelectImage(img)}
                  className={`image-card ${classes.imageCard} ${img === selectedImage && classes.selectedImageCard}`}>
              <CardMedia image={img} title={img} className={classes.image}/>
            </Card>
          )
        : <div className={classes.placeholder}>{blankMessage}</div>)
      }
      {maxImages < images.length &&
        <Button id="load-more" className={classes.loadMore} onClick={loadMoreImages}>
          Load more
        </Button>
      }
      </Grid>
      {images.length > NUM_IMAGE_CARDS &&
        <React.Fragment>
          <Fab id="scroll-left"
            className={`${classes.scrollButton} ${classes.scrollLeft}`}
            onClick={scrollImagesLeft}>
            <ChevronLeft />
          </Fab>
          <Fab id="scroll-right"
            className={`${classes.scrollButton} ${classes.scrollRight}`}
            onClick={scrollImagesRight}>
            <ChevronRight />
          </Fab>
        </React.Fragment>
      }
    </div>
  );
}
