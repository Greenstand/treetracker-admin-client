import React from 'react';
import ReportingCard from './ReportingCard';
import Icon from '@material-ui/icons/Done';
import useLoadData from './ReportingCard.hook';

export default function ReportingCard10(props) {
  const { startDate, endDate, disableSeeMore, rows } = props;

  const data = useLoadData(
    startDate,
    endDate,
    'matched_captures',
    'matched_captures',
    undefined,
    rows
  );

  return (
    <ReportingCard
      text={{
        title: 'Matched Captures',
        text1: 'Total',
      }}
      icon={Icon}
      color="#76bb23"
      data={data}
      disableSeeMore={disableSeeMore}
    />
  );
}
