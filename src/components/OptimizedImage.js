import React from 'react';

export default function OptimizedImage(props) {
  const {
    src,
    width,
    quality,
    screenWidths = [1600, 1280, 960, 0],
    imageSizes = [400, 300, 250, 200],
    fixed,
    rotation,
    objectFit = 'cover',
    ...rest
  } = props;

  if (!src) return <></>;

  const cdnPath = 'https://cdn.statically.io/img';
  const matches = src.match(/\/\/(.*?)\/(.*)/);

  let cdnUrl, sizes, srcSet;

  if (matches?.length > 1) {
    const domain = matches[1];
    const imagePath = matches[2];
    const params =
      `f=auto` +
      (width ? `,w=${width}` : '') +
      (quality ? `,q=${quality}` : '');

    //console.log('params', params);

    cdnUrl = `${cdnPath}/${domain}/${params}/${imagePath}`;

    if (!fixed && screenWidths.length === imageSizes.length) {
      sizes = screenWidths
        .map((size, i) => `(min-width: ${size}px) ${imageSizes[i]}px`)
        .join(', ');
      srcSet = imageSizes
        .map((size) => `${cdnPath}/${domain}/${params}/${imagePath} ${size}w`)
        .join(', ');
    }
  }

  return (
    <>
      <img
        src={cdnUrl || src}
        alt=".."
        srcSet={srcSet}
        sizes={sizes}
        loading="lazy"
        style={{
          position: 'absolute',
          inset: 0,
          objectFit,
          width: 'calc(100%)', // width for image rotation
          height: 'calc(100%)', // height for image rotation
          transform: `rotate(${rotation}deg)`,
        }}
        {...rest}
      />
    </>
  );
}
