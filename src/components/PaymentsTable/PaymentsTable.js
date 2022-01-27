import React, { useEffect, useState } from 'react';
import paymentsAPI from '../../api/earnings';
import CustomTable from '../common/CustomTable/CustomTable';
import {
  covertDateStringToHumanReadableFormat,
  generateActiveDateRangeFilterString,
} from 'utilities';
import PaymentsTableDateFilter from './PaymentsTableDateFilter/PaymentsTableDateFilter';
import PaymentsTableMainFilter from './PaymentsTableMainFilter/PaymentsTableMainFilter';
import PaymentDetails from './PaymentDetails/PaymentDetails';

/**
 * @constant
 * @name paymentTableMetaData
 * @description contains table meta data
 * @type {Object[]}
 * @param {string} paymentTableMetaData[].name - payment property used to get payment property value from payment object to display in table
 * @param {string} paymentTableMetaData[].description - column description/label to be displayed in table
 * @param {boolean} paymentTableMetaData[].sortable - determines if column is sortable
 * @param {boolean} paymentTableMetaData[].showInfoIcon - determines if column has info icon
 */
const paymentTableMetaData = [
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
    description: 'Payment System',
    name: 'payment_system',
    sortable: false,
    showInfoIcon: false,
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
    return {
      ...row,
      consolidation_period_start: covertDateStringToHumanReadableFormat(
        row.consolidation_period_start,
        'mmm d, yyyy'
      ),
      consolidation_period_end: covertDateStringToHumanReadableFormat(
        row.consolidation_period_end,
        'mmm d, yyyy'
      ),
      calculated_at: covertDateStringToHumanReadableFormat(row.calculated_at),
    };
  });

/**
 * @function
 * @name PaymentsTable
 * @description renders the payments table
 *
 * @returns {React.Component} - payments table component
 * */
function PaymentsTable() {
  // state for payments table
  const [payments, setPayments] = useState([]);
  const [activeDateRageString, setActiveDateRageString] = useState('');
  const [filter, setFilter] = useState({});
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentsPerPage, setPaymentsPerPage] = useState(20);
  const [sortBy, setSortBy] = useState(null);
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [isMainFilterOpen, setIsMainFilterOpen] = useState(false);
  const [totalPayments, setTotalPayments] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(null);

  async function getPayments() {
    setIsLoading(true); // show loading indicator when fetching data

    const queryParams = {
      offset: page * paymentsPerPage,
      sort_by: sortBy?.field,
      order: sortBy?.order,
      limit: paymentsPerPage,
      ...filter,
    };

    const response = await paymentsAPI.getEarnings(queryParams);
    const result = prepareRows(response.earnings);
    setPayments(result);
    setTotalPayments(response.totalCount);

    setIsLoading(false); // hide loading indicator when data is fetched
  }

  const uploadCsvFile = (file) => {
    paymentsAPI.batchPatchEarnings(file);
  };

  const handleOpenMainFilter = () => setIsMainFilterOpen(true);
  const handleOpenDateFilter = () => setIsDateFilterOpen(true);

  useEffect(() => {
    if (filter?.start_date && filter?.end_date) {
      const dateRangeString = generateActiveDateRangeFilterString(
        filter?.start_date,
        filter?.end_date
      );
      setActiveDateRageString(dateRangeString);
    } else {
      setActiveDateRageString('');
    }

    getPayments();
  }, [page, paymentsPerPage, sortBy, filter]);

  return (
    <CustomTable
      setPage={setPage}
      page={page}
      sortBy={sortBy}
      rows={payments}
      isLoading={isLoading}
      onSelectFile={uploadCsvFile}
      activeDateRage={activeDateRageString}
      setRowsPerPage={setPaymentsPerPage}
      rowsPerPage={paymentsPerPage}
      setSortBy={setSortBy}
      totalCount={totalPayments}
      openMainFilter={handleOpenMainFilter}
      openDateFilter={handleOpenDateFilter}
      handleGetData={getPayments}
      setSelectedRow={setSelectedPayment}
      selectedRow={selectedPayment}
      tableMetaData={paymentTableMetaData}
      headerTitle="Payments"
      mainFilterComponent={
        <PaymentsTableMainFilter
          isMainFilterOpen={isMainFilterOpen}
          filter={filter}
          setFilter={setFilter}
          setIsMainFilterOpen={setIsMainFilterOpen}
        />
      }
      dateFilterComponent={
        <PaymentsTableDateFilter
          isDateFilterOpen={isDateFilterOpen}
          filter={filter}
          setFilter={setFilter}
          setIsDateFilterOpen={setIsDateFilterOpen}
        />
      }
      rowDetails={
        <PaymentDetails
          selectedPayment={selectedPayment}
          closeDetails={() => setSelectedPayment(null)}
        />
      }
      actionButtonType="upload"
    />
  );
}

export default PaymentsTable;
