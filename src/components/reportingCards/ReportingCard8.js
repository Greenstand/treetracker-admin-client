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
    (data) =>
      data.gender_details.reduce((acc, cur) => acc + Number(cur.number), 0),
    rows
  );

  const formatData = (data) => {
    const result = data.top.map((item) => {
      return {
        name:
          item.name && item.name.match(/f/i)
            ? 'Female'
            : item.name
            ? 'Male'
            : 'Unknown',
        num: `${item.percentage}%`,
      };
    });
    return { ...data, top: result };
  };

  return (
    <ReportingCard
      text={{
        title: 'Grower Gender Count',
        text1: 'Total growers',
      }}
      icon={PeopleIcon}
      color="#e95839"
      data={data && formatData(data)}
      disableSeeMore={disableSeeMore}
    />
  );
}
