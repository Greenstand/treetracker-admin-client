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
    rows
  );

  const formatData = (data) => {
    let formattedData = { ...data };
    if (data?.moreData) {
      const moreData = data.moreData.map((item) => ({
        ...item,
        name: item.name || 'No organization',
      }));
      formattedData = { ...formattedData, moreData };
    }
    if (data?.top) {
      const top = data.top.map((item) => ({
        ...item,
        name: item.name || 'No organization',
      }));
      formattedData = { ...formattedData, top };
    }
    return formattedData;
  };

  return (
    <ReportingCard
      text={{
        title: 'Captures',
        text1: 'Total',
      }}
      icon={PhotoCameraIcon}
      color="#76bb23"
      data={data && formatData(data)}
      disableSeeMore={disableSeeMore}
    />
  );
}
