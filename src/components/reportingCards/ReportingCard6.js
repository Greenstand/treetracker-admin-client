import React from 'react';
import ReportingCard from './ReportingCard';
import useLoadData from './ReportingCard.hook';
import Icon from '@material-ui/icons/PhotoCamera';

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
        title: 'Average Captures per Grower',
        text1: 'Average',
      }}
      icon={Icon}
      color="#76bb23"
      data={data && formatData(data)}
      disableSeeMore={disableSeeMore}
    />
  );
}
