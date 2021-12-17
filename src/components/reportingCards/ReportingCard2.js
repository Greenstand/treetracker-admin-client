import React from 'react';
import ReportingCard from './ReportingCard';
import useLoadData from './ReportingCard.hook';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';

export default function ReportingCard2(props) {
  const { startDate, endDate, disableSeeMore, rows } = props;

  const data = useLoadData(
    startDate,
    endDate,
    'captures',
    'captures',
    undefined,
    rows,
  );

  return (
    <ReportingCard
      text={{
        title: 'Captures',
        text1: 'total',
      }}
      icon={PhotoCameraIcon}
      color="#76bb23"
      data={data}
      disableSeeMore={disableSeeMore}
    />
  );
}
