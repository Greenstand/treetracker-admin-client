import React, { useState, useEffect } from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import { publicAxios } from '../../api/httpClient';

export default function Country({ lat, lon }) {
  console.log('Country:', lat, lon);
  console.count();

  const [content, setContent] = useState(<Skeleton variant="text" />);

  if (!lat || !lon || lat === 'undefined' || lon === 'undefined') {
    setContent('No data');
  }

  useEffect(() => {
    publicAxios
      .get(
        `${process.env.REACT_APP_QUERY_API_ROOT}/countries?lat=${lat}&lon=${lon}`
      )
      .then((res) => {
        const data = res.data;
        setContent(data.countries[0].name);
      })
      .catch((error) => {
        if (error?.response?.status === 404) {
          setContent(`Can not find country at lat:${lat}, lon:${lon}`);
        } else {
          setContent('Unknown error');
        }
      });
  }, [lat, lon]);

  return <span>{content}</span>;
}
