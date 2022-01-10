import React from 'react';
import ReportingCard from './ReportingCard';
import useLoadData from './ReportingCard.hook';
import Icon from '@material-ui/icons/PhotoCamera';

export default function component(props) {
  const { startDate, endDate, disableSeeMore, rows } = props;

  const data = useLoadData(
    startDate,
    endDate,
    'trees_per_planters',
    'trees_per_planters',
    (data) => data.average,
    rows,
  );

  return (
    <ReportingCard
      text={{
        title: 'Average captures per grower per organization',
        text1: 'Average',
      }}
      icon={Icon}
      color="#76bb23"
      data={data}
      disableSeeMore={disableSeeMore}
    />
  );
}
