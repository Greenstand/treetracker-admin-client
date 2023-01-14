import { useState, useEffect } from 'react';
import axios from 'axios';
import log from 'loglevel';

export default function useLoadData(
  startDate,
  endDate,
  field1,
  field2,
  getNum1 = (e) => e.total,
  rows
) {
  const [data, setData] = useState(undefined);

  async function loadMore() {
    const res = await axios({
      method: 'get',
      url: `${process.env.REACT_APP_REPORTING_API_ROOT}/capture/statistics/card`,
      params: {
        card_title: field1,
        capture_created_start_date: startDate ? startDate : undefined,
        capture_created_end_date: endDate ? endDate : undefined,
        // TODO optimize when data increases
        limit: 100,
      },
    });
    setData((data) => ({
      ...data,
      moreData: res.data.card_information,
    }));
  }

  async function load(startDate, endDate) {
    const res = await axios({
      method: 'get',
      url: `${process.env.REACT_APP_REPORTING_API_ROOT}/capture/statistics`,
      params: {
        capture_created_start_date: startDate ? startDate : undefined,
        capture_created_end_date: endDate ? endDate : undefined,
      },
    });
    const { data } = res;
    if(!data) {
        log.error('No data found in response');
    }
    log.debug('Reporting data: ', data);

    let top;
    if (rows !== undefined) {
      // there is rows set, use single API to load it
      const res = await axios({
        method: 'get',
        url: `${process.env.REACT_APP_REPORTING_API_ROOT}/capture/statistics/card`,
        params: {
          capture_created_start_date: startDate ? startDate : undefined,
          capture_created_end_date: endDate ? endDate : undefined,
          card_title: field1,
          limit: rows,
        },
      });
      top = res.data.card_information;
    }

    setData({
      num1: getNum1(data[field1]),
      top: top || data[field1][field2],
      loadMore,
    });
  }

  useEffect(() => {
    setData(undefined);
    load(startDate, endDate);
  }, [startDate, endDate]);

  return data;
}
