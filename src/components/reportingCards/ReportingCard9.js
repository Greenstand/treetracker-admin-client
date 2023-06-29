import React from 'react';
import ReportingCard from './ReportingCard';
import Icon from '@material-ui/icons/Eco';
import useLoadData from './ReportingCard.hook';

export default function ReportingCard9(props) {
  const { startDate, endDate, disableSeeMore, rows } = props;

  const data = useLoadData(
    startDate,
    endDate,
    'trees',
    'trees',
    undefined,
    rows,
    'tree'
  );

  return (
    <ReportingCard
      text={{
        title: 'Trees',
        text1: 'Total',
      }}
      icon={Icon}
      color="#76bb23"
      data={data}
      disableSeeMore={disableSeeMore}
    />
  );
}
