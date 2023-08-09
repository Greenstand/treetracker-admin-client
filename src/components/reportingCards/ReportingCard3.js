import React from 'react';
import ReportingCard from './ReportingCard';
import useLoadData from './ReportingCard.hook';
import Icon from '@material-ui/icons/LiveHelp';
import { formatReportingCardData } from '../../utilities';

export default function component(props) {
  const { startDate, endDate, disableSeeMore, rows } = props;

  const data = useLoadData(
    startDate,
    endDate,
    'unverified_captures',
    'unverified_captures',
    undefined,
    rows
  );

  return (
    <ReportingCard
      text={{
        title: 'Unverified Captures',
        text1: 'Total',
      }}
      icon={Icon}
      color="#ef8031"
      data={data && formatReportingCardData(data, 'No organization')}
      disableSeeMore={disableSeeMore}
    />
  );
}
