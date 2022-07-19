import React, { useState, useEffect } from 'react';

export default function Country({ lat, lon }) {
  const [content, setContent] = useState('');
  if (!lat || !lon || lat === 'undefined' || lon === 'undefined') {
    setContent('No data');
  }

  useEffect(() => {
    // if (lat && lon) {
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
    // }
  }, [lat, lon]);

  return <span>{content}</span>;
}
