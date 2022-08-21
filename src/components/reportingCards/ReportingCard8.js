import React from 'react';
import ReportingCard from './ReportingCard';
import useLoadData from './ReportingCard.hook';
import PeopleIcon from '@material-ui/icons/People';

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

  const formatData = (data) => {
    if (data?.moreData) {
      const moreData = data.moreData.map((item) => {
        return {
          ...item,
          name: item.name || 'Not Set',
        };
      });
      return { ...data, moreData };
    } else {
      const top = data.top.map((item) => {
        return {
          ...item,
          name: item.name || 'Not Set',
        };
      });
      return { ...data, top };
    }
  };

  return (
    <ReportingCard
      text={{
        title: 'Gender Percentage',
        text1: 'Total Growers',
      }}
      icon={PeopleIcon}
      color="#e95839"
      data={data && formatData(data)}
      disableSeeMore={disableSeeMore}
    />
  );
}
