import React from 'react';
import ReportingCard from './ReportingCard';
import useLoadData from './ReportingCard.hook';
import PeopleIcon from '@material-ui/icons/People';
import { formatReportingCardData } from '../../utilities';

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

  console.log('Growers', data);

  return (
    <ReportingCard
      text={{
        title: 'Growers',
        text1: 'Total',
      }}
      icon={PeopleIcon}
      color="#e95839"
      data={data && formatReportingCardData(data, 'No organization')}
      disableSeeMore={disableSeeMore}
    />
  );
}
