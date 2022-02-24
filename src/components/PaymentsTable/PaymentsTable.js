import React, { useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import paymentsAPI from '../../api/earnings';
import CustomTable from '../common/CustomTable/CustomTable';
import {
  covertDateStringToHumanReadableFormat,
  generateActiveDateRangeFilterString,
} from 'utilities';
import CustomTableFilter from 'components/common/CustomTableFilter/CustomTableFilter';
import CustomTableItemDetails from 'components/common/CustomTableItemDetails/CustomTableItemDetails';

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
    sortable: true,
    showInfoIcon: true,
  },
  {
    description: 'Payment System',
    name: 'payment_system',
    sortable: true,
    showInfoIcon: false,
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
      consolidation_period_start: covertDateStringToHumanReadableFormat(
        row.consolidation_period_start,
        'mmm d, yyyy'
      ),
      consolidation_period_end: covertDateStringToHumanReadableFormat(
        row.consolidation_period_end,
        'mmm d, yyyy'
      ),
      calculated_at: covertDateStringToHumanReadableFormat(row.calculated_at),
      paid_at: covertDateStringToHumanReadableFormat(row.paid_at),
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
  const [paymentsUploadError, setPaymentsUploadError] = useState(null);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [activeDateRageString, setActiveDateRageString] = useState('');
  const [filter, setFilter] = useState({});
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowUploadSnack, setIsShowUploadSnack] = useState(false);
  const [paymentsPerPage, setPaymentsPerPage] = useState(20);
  const [sortBy, setSortBy] = useState({
    field: 'effective_payment_date',
    order: 'desc',
  });
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [isMainFilterOpen, setIsMainFilterOpen] = useState(false);
  const [totalPayments, setTotalPayments] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [snackBarMessage, setSnackBarMessage] = useState('');

  async function getPayments() {
    setIsLoading(true); // show loading indicator when fetching data

    const queryParams = {
      offset: page * paymentsPerPage,
      sort_by: sortBy?.field,
      order: sortBy?.order,
      limit: paymentsPerPage,
      earnings_status: 'paid', // display paid earnings only
      ...filter,
    };

    const response = await paymentsAPI.getEarnings(queryParams);
    const result = prepareRows(response.earnings);
    setPayments(result);
    setTotalPayments(response.totalCount);

    setIsLoading(false); // hide loading indicator when data is fetched
  }

  const uploadCsvFile = (file) => {
    setIsShowUploadSnack(true);
    setSnackBarMessage('Uploading Payments In background...');
    paymentsAPI
      .batchPatchEarnings(file)
      .then(() => {
        setIsShowUploadSnack(true);
        setSnackBarMessage('Payments Uploaded Successfully');
        setPaymentsUploadError(null);
        setIsErrorDialogOpen(false);
        getPayments();
      })
      .catch((error) => {
        setIsLoading(false);
        setIsShowUploadSnack(false);
        setIsErrorDialogOpen(true);
        setPaymentsUploadError(error);
      });
  };

  const handleOpenMainFilter = () => setIsMainFilterOpen(true);
  const handleOpenDateFilter = () => setIsDateFilterOpen(true);
  const handleClose = () => setIsErrorDialogOpen(false);

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
    <>
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
          <CustomTableFilter
            isMainFilterOpen={isMainFilterOpen}
            filter={filter}
            filterType="main"
            setFilter={setFilter}
            setIsMainFilterOpen={setIsMainFilterOpen}
          />
        }
        dateFilterComponent={
          <CustomTableFilter
            isMainFilterOpen={isDateFilterOpen}
            filter={filter}
            filterType="date"
            setFilter={setFilter}
            setIsMainFilterOpen={setIsDateFilterOpen}
          />
        }
        rowDetails={
          selectedPayment ? (
            <CustomTableItemDetails
              selectedItem={selectedPayment}
              closeDetails={() => setSelectedPayment(null)}
            />
          ) : null
        }
        actionButtonType="upload"
      />
      <Dialog
        open={isErrorDialogOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {paymentsUploadError?.message}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {paymentsUploadError?.cause.response.data.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isShowUploadSnack}
        autoHideDuration={5000}
        onClose={() => setIsShowUploadSnack(false)}
        message={snackBarMessage}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="primary"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </>
  );
}

export default PaymentsTable;
