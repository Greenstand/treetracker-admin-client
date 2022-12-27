import React from 'react';
import ReportingCard from './ReportingCard';
import useLoadData from './ReportingCardTree.hook';
import NatureIcon from '@material-ui/icons/Nature';

export default function ReportingCard9(props) {
  const { startDate, endDate, /*disableSeeMore,*/ rows } = props;

  const data = useLoadData(
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
      icon={NatureIcon}
      color="#76bb23"
      data={data}
      disableSeeMore={true}
    />
  );
}
