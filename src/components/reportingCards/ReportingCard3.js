import React from 'react';
import ReportingCard from './ReportingCard';
import useLoadData from './ReportingCard.hook';
import Icon from '@material-ui/icons/LiveHelp';

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
        title: 'Unverified Captures',
        text1: 'Total',
      }}
      icon={Icon}
      color="#ef8031"
      data={data && formatData(data)}
      disableSeeMore={disableSeeMore}
    />
  );
}
