import React from 'react';
import ReportingCard from './ReportingCard';
import Icon from '@material-ui/icons/Eco';
import useLoadTreeData from './ReportingCardTree.hook';

export default function ReportingCard9(props) {
  const { startDate, endDate, disableSeeMore, rows } = props;

  const data = useLoadTreeData(
    startDate,
    endDate,
    'trees',
    'trees',
    undefined,
    rows
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
