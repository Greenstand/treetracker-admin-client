import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import earningsAPI from '../../api/earnings';
import CustomTable from '../common/CustomTable/CustomTable';
import {
  convertDateStringToHumanReadableFormat,
  generateActiveDateRangeFilterString,
} from 'utilities';
import CustomTableFilter from 'components/common/CustomTableFilter/CustomTableFilter';
import CustomTableItemDetails from 'components/common/CustomTableItemDetails/CustomTableItemDetails';
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
    align: 'right',
  },
  {
    description: 'Capture Count',
    name: 'captures_count',
    sortable: false,
    showInfoIcon: false,
    align: 'right',
  },
  {
    description: 'Effective Date',
    name: 'calculated_at',
    sortable: true,
    showInfoIcon:
      'The effective data is the date on which captures were consolidated and the earnings record was created',
  },
  {
    description: 'Status',
    name: 'status',
    sortable: true,
    showInfoIcon: false,
  },
  {
    description: 'Payment Date',
    name: 'paid_at',
    sortable: true,
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
    return {
      ...row,
      csv_start_date: row.consolidation_period_start,
      csv_end_date: row.consolidation_period_end,
      consolidation_period_start: convertDateStringToHumanReadableFormat(
        row.consolidation_period_start,
        'yyyy-MM-dd'
      ),
      consolidation_period_end: convertDateStringToHumanReadableFormat(
        row.consolidation_period_end,
        'yyyy-MM-dd'
      ),
      calculated_at: convertDateStringToHumanReadableFormat(
        row.calculated_at,
        'yyyy-MM-dd'
      ),
      payment_confirmed_at: convertDateStringToHumanReadableFormat(
        row.payment_confirmed_at
      ),
      paid_at: row.paid_at ? format(new Date(row.paid_at), 'yyyy-MM-dd') : '',
    };
  });

/**
 * @function
 * @name EarningsTable
 * @description renders the earnings table
 *
 * @returns {React.Component} - earnings table component
 * */
function EarningsTable() {
  // state for earnings table
  const [earnings, setEarnings] = useState([]);
  const [activeDateRangeString, setActiveDateRangeString] = useState('');
  const [filter, setFilter] = useState({});
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [earningsPerPage, setEarningsPerPage] = useState(20);
  const [sortBy, setSortBy] = useState({
    field: 'paid_at',
    order: 'desc',
  });
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [isMainFilterOpen, setIsMainFilterOpen] = useState(false);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [selectedEarning, setSelectedEarning] = useState(null);
  const [isDetailShown, setDetailShown] = useState(false);

  async function getEarnings(fetchAll = false) {
    // console.warn('getEarnings with fetchAll: ', fetchAll);
    setIsLoading(true); // show loading indicator when fetching data

    const { results, totalCount } = await getEarningsReal(fetchAll);
    setEarnings(results);
    setTotalEarnings(totalCount);

    setIsLoading(false); // hide loading indicator when data is fetched
  }

  async function getEarningsReal(fetchAll = false) {
    // console.warn('fetchAll:', fetchAll);
    const filtersToSubmit = { ...filter };
    // filter out keys we don't want to submit
    Object.keys(filtersToSubmit).forEach((k) => {
      if (k === 'grower') {
        return;
      } else {
        if (
          filtersToSubmit[k] === 'all' ||
          filtersToSubmit[k] === '' ||
          k === 'organization_id'
        ) {
          delete filtersToSubmit[k];
        }
      }
    });

    const queryParams = {
      offset: fetchAll ? 0 : page * earningsPerPage,
      limit: fetchAll ? 90000 : earningsPerPage,
      sort_by: sortBy?.field,
      order: sortBy?.order,
      ...filtersToSubmit,
    };

    // log.debug('queryParams', queryParams);

    const response = await earningsAPI.getEarnings(queryParams);
    // log.debug('getEarnings response: ', response);

    const results = prepareRows(response.earnings);
    return {
      results,
      totalCount: response.query.count,
    };
  }

  const handleOpenMainFilter = () => setIsMainFilterOpen(true);
  const handleOpenDateFilter = () => setIsDateFilterOpen(true);

  useEffect(() => {
    if (filter?.start_date && filter?.end_date) {
      const dateRangeString = generateActiveDateRangeFilterString(
        filter?.start_date,
        filter?.end_date
      );
      setActiveDateRangeString(dateRangeString);
    } else {
      setActiveDateRangeString('');
    }

    getEarnings();
  }, [page, earningsPerPage, sortBy, filter]);

  return (
    <CustomTable
      setPage={setPage}
      page={page}
      sortBy={sortBy}
      rows={earnings}
      isLoading={isLoading}
      activeDateRange={activeDateRangeString}
      setRowsPerPage={setEarningsPerPage}
      rowsPerPage={earningsPerPage}
      setSortBy={setSortBy}
      totalCount={totalEarnings}
      openMainFilter={handleOpenMainFilter}
      openDateFilter={handleOpenDateFilter}
      handleGetData={getEarnings}
      setSelectedRow={(value) => {
        setSelectedEarning(value);
        setDetailShown(true);
      }}
      selectedRow={selectedEarning}
      tableMetaData={earningTableMetaData}
      activeFiltersCount={
        Object.keys(filter).filter((key) => {
          return key === 'start_date' ||
            key === 'end_date' ||
            key === 'organization_id' ||
            filter[key] === 'all' ||
            filter[key] === ''
            ? false
            : true;
        }).length
      }
      headerTitle="Earnings"
      mainFilterComponent={
        <CustomTableFilter
          isFilterOpen={isMainFilterOpen}
          filter={filter}
          filterType="main"
          setFilter={setFilter}
          setIsFilterOpen={setIsMainFilterOpen}
        />
      }
      dateFilterComponent={
        <CustomTableFilter
          isFilterOpen={isDateFilterOpen}
          filter={filter}
          filterType="date"
          setFilter={setFilter}
          setIsFilterOpen={setIsDateFilterOpen}
        />
      }
      rowDetails={
        selectedEarning ? (
          <CustomTableItemDetails
            open={isDetailShown}
            selectedItem={selectedEarning}
            refreshData={getEarnings}
            onClose={() => {
              setDetailShown(false);
              setSelectedEarning(null);
            }}
          />
        ) : null
      }
      actionButtonType="export"
      exportDataFetch={getEarningsReal}
    />
  );
}

export default EarningsTable;
