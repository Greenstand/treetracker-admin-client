import React from 'react';
import ReportingCard from './ReportingCard';
import useLoadData from './ReportingCard.hook';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';

export default function ReportingCard1(props) {
  const { startDate, endDate, disableSeeMore, rows } = props;

  const data = useLoadData(
    startDate,
    endDate,
    'planters',
    'planters',
    undefined,
    rows
  );

  return (
    <ReportingCard
      text={{
        title: 'Growers',
        text1: 'Total',
      }}
      icon={PeopleOutlineIcon}
      color="#e95839"
      data={data}
      disableSeeMore={disableSeeMore}
    />
  );
}
