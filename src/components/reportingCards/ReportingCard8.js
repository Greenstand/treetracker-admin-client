import React from 'react';
import ReportingCard from './ReportingCard';
import useLoadData from './ReportingCard.hook';
import PeopleIcon from '@material-ui/icons/People';
import { formatReportingCardData } from '../../utilities';

export default function component(props) {
  const { startDate, endDate, disableSeeMore, rows } = props;

  const data = useLoadData(
    startDate,
    endDate,
    'gender_details',
    'gender_details',
    (data) => data.total,
    rows
  );

  return (
    <ReportingCard
      text={{
        title: 'Grower Gender Counts',
        text1: 'Total Growers',
      }}
      icon={PeopleIcon}
      color="#e95839"
      data={data && formatReportingCardData(data, 'Not Set')}
      disableSeeMore={disableSeeMore}
    />
  );
}
