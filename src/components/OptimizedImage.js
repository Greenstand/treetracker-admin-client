import React from 'react';
import Spinner from './common/Spinner';
import { Box } from '@material-ui/core';

import ImageErrorAlert from './ImageErrorAlert';

export default function OptimizedImage(props) {
  const {
    src,
    width,
    height,
    quality,
    screenWidths = [1600, 1280, 960, 0],
    imageSizes = [400, 300, 250, 200],
    fixed,
    rotation,
    alertHeight,
    alertWidth,
    alertPadding,
    alertPosition,
    alertTextSize,
    alertTitleSize,
    onImageReady,
    objectFit = 'cover',
    loadingState,
    setLoadingState,
    ...rest
  } = props;

  if (!src) return null;

  const cdnPath = `${process.env.REACT_APP_IMAGES_API_ROOT}/img`;
  const matches = src.match(/\/\/(.*?)\/(.*)/);

  let cdnUrl, sizes, srcSet;

  if (matches?.length > 1) {
    const domain = matches[1];
    const imagePath = matches[2];
    const params =
      (width ? `w=${Math.floor(width)},` : '') +
      (height ? `h=${Math.floor(height)},` : '') +
      (quality ? `q=${quality},` : '') +
      (rotation ? `r=${rotation}` : '');

    cdnUrl = `${cdnPath}/${domain}/${params}/${imagePath}`;

    if (!fixed && screenWidths.length === imageSizes.length) {
      sizes = screenWidths
        .map((size, i) => `(width: ${size}px) ${imageSizes[i]}px`)
        .join(', ');
      srcSet = imageSizes
        .map((size) => `${cdnPath}/${domain}/${params}/${imagePath} ${size}w`)
        .join(', ');
    }
  }

  return (
    <>
      {!cdnUrl || !src ? (
        <ImageErrorAlert
          alertHeight={alertHeight}
          alertWidth={alertWidth}
          alertPadding={alertPadding}
          alertPosition={alertPosition}
          alertTextSize={alertTextSize}
          alertTitleSize={alertTitleSize}
        />
      ) : (
        <>
          {loadingState && (
            <Box
              sx={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%);',
              }}
            >
              <Spinner />
            </Box>
          )}
          <img
            src={cdnUrl || src}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = null;
            }}
            alt=".."
            srcSet={srcSet}
            sizes={sizes}
            loading="lazy"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              margin: 'auto',
              inset: 0,
              objectFit,
              maxWidth: '100%',
              maxHeight: '100%',
            }}
            onLoad={() => {
              setLoadingState && setLoadingState(false);
            }}
            {...rest}
          />
        </>
      )}
    </>
  );
}
