import React from 'react';
import ReportingCard from './ReportingCard';
import log from 'loglevel';
import useLoadData from './ReportingCard.hook';
import Icon from '@material-ui/icons/Eco';

export default function component(props) {
  const { startDate, endDate, disableSeeMore, rows } = props;

  const data = useLoadData(
    startDate,
    endDate,
    'species',
    'species',
    undefined,
    rows,
  );

  return (
    <ReportingCard
      text={{
        title: 'Species',
        text1: 'Total',
      }}
      icon={Icon}
      color="#76bb23"
      data={data}
      disableSeeMore={disableSeeMore}
    />
  );
}
