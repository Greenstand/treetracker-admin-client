import React from 'react';
import ReportingCard from './ReportingCard';
import useLoadData from './ReportingCard.hook';
import PeopleIcon from '@material-ui/icons/People';

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
        title: 'Growers',
        text1: 'Total',
      }}
      icon={PeopleIcon}
      color="#e95839"
      data={data && formatData(data)}
      disableSeeMore={disableSeeMore}
    />
  );
}
