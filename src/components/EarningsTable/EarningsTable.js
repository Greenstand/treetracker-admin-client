import React, { useEffect, useState } from 'react';
import earningsAPI from '../../api/earnings';
import CustomTable from '../common/CustomTable/CustomTable';
import { covertDateStringToHumanReadableFormat } from 'utilities';
import EarningsTableDateFilter from './EarningsTableDateFilter/EarningsTableDateFilter';
import EarningsTableMainFilter from './EarningsTableMainFilter/EarningsTableMainFilter';
import EarningDetails from './EarningDetails/EarningDetails';

/**
 * @function
 * @name generateActiveDateRangeFilterString
 * @description generate active date rage filter string e.g. 'Oct 1 - Oct 31'
 * @param {string} startDate - start date
 * @param {string} endDate - end date
 *
 * @returns {string} - active date range filter string
 */
const generateActiveDateRangeFilterString = (startDate, endDate) => {
  const format = 'mmm d';

  const startDateString = covertDateStringToHumanReadableFormat(
    startDate,
    format,
  );
  const endDateString = covertDateStringToHumanReadableFormat(endDate, format);

  return `${startDateString} - ${endDateString}`;
};

/**
 * @constant
 * @name earningTableMetaData
 * @description contains table meta data
 * @type {Object[]}
 * @param {string} earningTableMetaData[].name - earning property used to get earning property value from earning object to display in table
 * @param {string} earningTableMetaData[].description - column description/label to be displayed in table
 * @param {boolean} earningTableMetaData[].sortable - determines if column is sortable
 * @param {boolean} earningTableMetaData[].showInfoIcon - determines if column has info icon
 */
const earningTableMetaData = [
  {
    description: 'Grower',
    name: 'grower',
    sortable: true,
    showInfoIcon: false,
  },
  {
    description: 'Funder',
    name: 'funder',
    sortable: true,
    showInfoIcon: false,
  },
  {
    description: 'Amount',
    name: 'amount',
    sortable: true,
    showInfoIcon: false,
  },
  {
    description: 'Effective Date',
    name: 'calculated_at',
    sortable: false,
    showInfoIcon: true,
  },
  {
    description: 'Payment Date',
    name: 'paid_at',
    sortable: false,
    showInfoIcon: false,
  },
];

/**
 * @function
 * @name prepareRows
 * @description transform rows such that are well formated compatible with the table meta data
 * @param {object} rows - rows to be transformed
 * @returns {Array} - transformed rows
 */
const prepareRows = (rows) =>
  rows.map((row) => {
    const {
      id,
      grower,
      currency,
      funder,
      amount,
      payment_system,
      paid_at,
      calculated_at,
    } = row;
    return {
      id,
      grower,
      currency,
      funder,
      amount,
      payment_system,
      paid_at,
      calculated_at: covertDateStringToHumanReadableFormat(calculated_at),
    };
  });

export default function EarningsTable() {
  // state for earnings table
  const [earnings, setEarnings] = useState([]);
  const [activeDateRageString, setActiveDateRageString] = useState('');
  const [filter, setFilter] = useState({});
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [earningsPerPage, setEarningsPerPage] = useState(20);
  const [sortBy, setSortBy] = useState(null);
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [isMainFilterOpen, setIsMainFilterOpen] = useState(false);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [selectedEarning, setSelectedEarning] = useState(null);

  async function getEarnings() {
    setIsLoading(true); // show loading indicator when fetching data

    const queryParams = {
      offset: page * earningsPerPage,
      sort_by: sortBy?.field,
      order: sortBy?.order,
      limit: earningsPerPage,
      ...filter,
    };

    const response = await earningsAPI.getEarnings(queryParams);
    const result = prepareRows(response.earnings);
    setEarnings(result);
    setTotalEarnings(response.totalCount);

    setIsLoading(false); // hide loading indicator when data is fetched
  }

  const handleOpenMainFilter = () => setIsMainFilterOpen(true);
  const handleOpenDateFilter = () => setIsDateFilterOpen(true);

  useEffect(() => {
    if (filter?.start_date && filter?.end_date) {
      const dateRangeString = generateActiveDateRangeFilterString(
        filter?.start_date,
        filter?.end_date,
      );
      setActiveDateRageString(dateRangeString);
    } else {
      setActiveDateRageString('');
    }

    getEarnings();
  }, [page, earningsPerPage, sortBy, filter]);

  return (
    <CustomTable
      data={earnings}
      setPage={setPage}
      page={page}
      sortBy={sortBy}
      rows={earnings}
      isLoading={isLoading}
      activeDateRage={activeDateRageString}
      setRowsPerPage={setEarningsPerPage}
      rowsPerPage={earningsPerPage}
      setSortBy={setSortBy}
      totalCount={totalEarnings}
      openMainFilter={handleOpenMainFilter}
      openDateFilter={handleOpenDateFilter}
      handleGetData={getEarnings}
      setSelectedRow={setSelectedEarning}
      selectedRow={selectedEarning}
      tableMetaData={earningTableMetaData}
      headerTitle="Earnings"
      mainFilterComponent={
        <EarningsTableMainFilter
          isMainFilterOpen={isMainFilterOpen}
          filter={filter}
          setFilter={setFilter}
          setIsMainFilterOpen={setIsMainFilterOpen}
        />
      }
      dateFilterComponent={
        <EarningsTableDateFilter
          isDateFilterOpen={isDateFilterOpen}
          filter={filter}
          setFilter={setFilter}
          setIsDateFilterOpen={setIsDateFilterOpen}
        />
      }
      rowDetails={<EarningDetails selectedEarning={selectedEarning} />}
      actionButtonType="export"
    />
  );
}
