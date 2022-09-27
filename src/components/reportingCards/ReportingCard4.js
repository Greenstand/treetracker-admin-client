import React from 'react';
import ReportingCard from './ReportingCard';
import useLoadData from './ReportingCard.hook';
import Icon from '@material-ui/icons/Flag';

export default function component(props) {
  const { startDate, endDate, disableSeeMore, rows } = props;

  const data = useLoadData(
    startDate,
    endDate,
    'top_planters',
    'top_planters',
    (data) => data?.average,
    rows
  );

  return (
    <ReportingCard
      text={{
        title: 'Top Growers',
        text1: 'Average',
      }}
      icon={Icon}
      color="#1976d2"
      data={data}
      disableSeeMore={disableSeeMore}
    />
  );
}
