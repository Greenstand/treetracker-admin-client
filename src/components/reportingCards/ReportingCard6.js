import React from 'react';
import ReportingCard from './ReportingCard';
import useLoadData from './ReportingCard.hook';
import Icon from '@material-ui/icons/PhotoCamera';
import { formatReportingCardData } from '../../utilities';

export default function component(props) {
  const { startDate, endDate, disableSeeMore, rows } = props;

  const data = useLoadData(
    startDate,
    endDate,
    'trees_per_planters',
    'trees_per_planters',
    (data) => data.average,
    rows
  );

  return (
    <ReportingCard
      text={{
        title: 'Average Captures per Grower',
        text1: 'Average',
      }}
      icon={Icon}
      color="#76bb23"
      data={data && formatReportingCardData(data, 'No organization')}
      disableSeeMore={disableSeeMore}
    />
  );
}
