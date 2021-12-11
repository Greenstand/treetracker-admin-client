import React from 'react';
import axios from 'axios';
import log from 'loglevel';

export default function useLoadData(
  startDate,
  endDate,
  field1,
  field2,
  getNum1 = (e) => e.total,
) {
  const [data, setData] = React.useState(undefined);

  async function load(baseUrl, startDate, endDate) {
    const res = await axios.get(
      `${baseUrl}?${
        startDate ? 'capture_created_start_date=' + startDate : ''
      }&${endDate ? 'capture_created_end_date=' + endDate : ''}`,
    );
    const { data } = res;
    log.warn('load data: ', data);
    setData({
      num1: getNum1(data[field1]),
      top: data[field1][field2].map((p) => ({
        name: p.name,
        num: p.number,
      })),
    });
  }

  React.useEffect(() => {
    setData(undefined);
    load(
      `${process.env.REACT_APP_REPORTING_API_ROOT}/capture/statistics`,
      startDate,
      endDate,
    );
  }, [startDate, endDate]);

  return data;
}
