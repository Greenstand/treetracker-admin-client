import React from 'react';
import ReportingCard from './ReportingCard';
import useLoadData from './ReportingCard.hook';
import NatureIcon from '@material-ui/icons/Nature';

export default function ReportingCard10(props) {
  const { startDate, endDate, /*disableSeeMore,*/ rows } = props;

  const data = useLoadData(
    startDate,
    endDate,
    'surviving_species',
    'surviving_species',
    undefined,
    rows
  );

  return (
    <ReportingCard
      text={{
        title: 'Surviving Species',
        text1: 'Total',
      }}
      icon={NatureIcon}
      color="#76bb23"
      data={data}
      disableSeeMore={true}
    />
  );
}
