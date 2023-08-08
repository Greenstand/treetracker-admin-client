import { useState, useEffect } from 'react';
import axios from 'axios';
import log from 'loglevel';

export default function useLoadData(
  startDate,
  endDate,
  field1,
  field2,
  getNum1 = (e) => e.total,
  rows,
  category = 'capture'
) {
  const [data, setData] = useState(undefined);

  async function loadMore(apiUrl, createDatesParams) {
    const res = await axios({
      method: 'get',
      url: apiUrl,
      params: {
        card_title: field1,
        ...createDatesParams,
        // TODO optimize when data increases
        limit: 100,
      },
    });
    setData((data) => ({
      ...data,
      moreData: res.data.card_information,
    }));
  }

  async function load(apiUrl, createDatesParams) {
    const CARD_API_URL = apiUrl + '/card';
    const res = await axios({
      method: 'get',
      url: apiUrl,
      params: {
        ...createDatesParams,
      },
    });
    const { data } = res;
    if (!data) {
      log.error('No data found in response');
    }
    log.debug('Reporting data: ', data);

    let top;
    if (rows !== undefined) {
      // there is rows set, use single API to load it

      const res = await axios({
        method: 'get',
        url: CARD_API_URL,
        params: {
          ...createDatesParams,
          card_title: field1,
          limit: rows,
        },
      });
      top = res.data.card_information;
    }

    setData({
      num1: getNum1(data[field1]),
      top: top || data[field1][field2],
      loadMore: () => loadMore(CARD_API_URL, createDatesParams),
    });
  }

  useEffect(() => {
    setData(undefined);
    const API_URL = `${process.env.REACT_APP_REPORTING_API_ROOT}/${category}/statistics`;
    const PARAM =
      category === 'tree'
        ? {
            tree_created_start_date: startDate ? startDate : undefined,
            tree_created_end_date: endDate ? endDate : undefined,
          }
        : {
            capture_created_start_date: startDate ? startDate : undefined,
            capture_created_end_date: endDate ? endDate : undefined,
          };
    load(API_URL, PARAM);
  }, [startDate, endDate]);

  return data;
}
