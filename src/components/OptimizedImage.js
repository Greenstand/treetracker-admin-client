import React from 'react';

export default function OptimizedImage(props) {
  const {
    src,
    width = 320,
    height,
    quality,
    screenWidths = [1600, 1280, 960, 0],
    imageSizes = [400, 300, 250, 200],
    fixed,
    ...rest
  } = props;

  if (!src) return <></>;

  const cdnPath = 'https://cdn.statically.io/img';
  const domain = src.match(/\/\/(.*)\//)[1];
  const imagePath = src.match(/.com\/(.*)/)[1];
  const params =
    `f=auto,w=${width}` +
    (height ? `,h=${height}` : '') +
    (quality ? `,q=${quality}` : '');

  const cdnUrl = `${cdnPath}/${domain}/${params}/${imagePath}`;

  let sizes, srcSet;
  if (!fixed && screenWidths.length === imageSizes.length) {
    sizes = screenWidths
      .map((size, i) => `(min-width: ${size}px) ${imageSizes[i]}px`)
      .join(', ');
    srcSet = imageSizes
      .map((size) => `${cdnPath}/${domain}/${params}/${imagePath} ${size}w`)
      .join(', ');
  }

  return (
    <>
      <img
        src={cdnUrl}
        alt=".."
        srcSet={srcSet}
        sizes={sizes}
        loading="lazy"
        style={{
          position: 'absolute',
          inset: 0,
          objectFit: 'cover',
          width: '100%',
          height: '100%',
        }}
        {...rest}
      />
    </>
  );
}
