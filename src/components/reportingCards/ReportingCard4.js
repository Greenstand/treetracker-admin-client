import React from 'react';
import ReportingCard from './ReportingCard';
import log from 'loglevel';
import useLoadData from './ReportingCard.hook';
import Icon from '@material-ui/icons/Flag';

export default function component(props) {
  const { startDate, endDate } = props;

  const data = useLoadData(
    startDate,
    endDate,
    'top_planters',
    'top_planters',
    (data) => data.average,
  );

  return (
    <ReportingCard
      text={{
        title: 'Top Planters',
        text1: 'Average',
      }}
      icon={Icon}
      color="#1976d2"
      data={data}
    />
  );
}
