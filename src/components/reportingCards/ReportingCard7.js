import React from 'react';
import ReportingCard from './ReportingCard';
import useLoadData from './ReportingCard.hook';
import Icon from '@material-ui/icons/Map';

export default function component(props) {
  const { startDate, endDate, disableSeeMore, rows } = props;

  const data = useLoadData(
    startDate,
    endDate,
    'catchments',
    'catchments',
    (data) => data.average,
    rows,
  );

  return (
    <ReportingCard
      text={{
        title: 'Catchments',
        text1: 'Average',
      }}
      icon={Icon}
      color="#ef8031"
      data={data}
      disableSeeMore={disableSeeMore}
    />
  );
}
