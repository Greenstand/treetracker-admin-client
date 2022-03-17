import React, { useState } from 'react';
import PropTypes from 'prop-types';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import CloseIcon from '@material-ui/icons/Close';
import {
  Button,
  Divider,
  Drawer,
  FormControl,
  Grid,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import earningsAPI from 'api/earnings';
import useStyles from './CustomTableItemDetails.styles';
import treeTrackerApi from 'api/treeTrackerApi';

/**
 * @function
 * @name LogPaymentForm
 * @description render form to log payment
 * @param {object} props - properties  passed to the component
 * @param {object} props.selectedItem - item
 * @param {function} props.closeForm - function used to close form
 * @param {function} props.refreshData - function refresh table data when item is updated
 * @returns {React.Component} - form to log payment
 */
function LogPaymentForm(props) {
  const { selectedItem, closeForm, refreshData } = props;
  const [payload, setPayload] = useState({});
  const classes = useStyles();

  const handleOnInputChange = (e) => {
    e.preventDefault();
    const { value, name } = e.target;
    const updatedPayload = { ...payload, [name]: value };
    setPayload(updatedPayload);
  };

  const handleOnFormSubmit = () => {
    const { id, worker_id, amount, currency } = selectedItem;
    const paid_at = new Date();
    earningsAPI
      .patchEarning({ id, worker_id, amount, currency, paid_at, ...payload })
      .then(() => refreshData())
      .catch((e) => console.log('error logging payment', e));
    closeForm();
  };

  return (
    <form onSubmit={handleOnFormSubmit}>
      <Grid container direction="column" justify="space-around">
        <Grid item className={classes.itemGrowerDetail}>
          <Typography variant="h6">Payment</Typography>
        </Grid>

        <Grid container direction="column" justify="space-between">
          <FormControl
            variant="outlined"
            className={classes.itemLogPaymentFormSelectFormControl}
          >
            <TextField
              id="payment_confirmation_id"
              name="payment_confirmation_id"
              label="Payment Confirmation Id"
              variant="outlined"
              required={true}
              onChange={handleOnInputChange}
            />
          </FormControl>

          <FormControl
            variant="outlined"
            className={classes.itemLogPaymentFormSelectFormControl}
          >
            <TextField
              id="payment_method"
              name="payment_method"
              label="Payment Method"
              variant="outlined"
              required={true}
              onChange={handleOnInputChange}
            />
          </FormControl>
        </Grid>
      </Grid>

      <Divider className={classes.itemDetailsContentsDivider} />

      <Grid
        container
        direction="column"
        className={classes.itemTableFilterActions}
      >
        <Button
          variant="contained"
          color="primary"
          disableElevation
          type="submit"
          className={classes.itemTableFilterSubmitButton}
        >
          LOG PAYMENT
        </Button>
        <Button
          color="primary"
          variant="text"
          className={classes.itemTableFilterResetButton}
          onClick={closeForm}
        >
          CANCEL
        </Button>
      </Grid>
    </form>
  );
}

LogPaymentForm.propTypes = {
  selectedItem: PropTypes.object.isRequired,
  closeForm: PropTypes.func.isRequired,
  refreshData: PropTypes.func.isRequired,
};

/**
 * @function
 * @name CustomTableItemDetails
 * @description render details of table item
 * @param {object} props - properties  passed to the component
 * @param {boolean} props.isDetailsDrawerOpen - flag that decides wheather details drawer should open/close
 * @param {object} props.selectedItem - custom table item
 * @param {Function} props.setSelectedItem - sets/resets selected item
 * @param {Function} props.refreshData - refresh table data after updating an item
 *
 * @returns {React.Component}
 */
function CustomTableItemDetails(props) {
  const { selectedItem, closeDetails, refreshData } = props;
  const [userName, setUserName] = useState('');
  const classes = useStyles();

  React.useEffect(() => {
    if (selectedItem?.status === 'paid') {
      treeTrackerApi
        .getAdminUserById(selectedItem.payment_confirmed_by)
        .then((data) => {
          setUserName(data.userName);
        });
    }
  }, [selectedItem]);

  return (
    <Drawer
      anchor="right"
      BackdropProps={{ invisible: true }}
      open={!!selectedItem}
    >
      <Grid container direction="column" className={classes.itemDrawerDetails}>
        {/* start  details header */}
        <Grid item>
          <Grid container direction="row" justify="space-between">
            <Grid item>
              <Grid
                container
                direction="row"
                alignContent="flex-end"
                justify="flex-start"
              >
                <Typography variant="h4">Details</Typography>
              </Grid>
            </Grid>
            <CloseIcon
              onClick={closeDetails}
              className={classes.itemDetailsCloseIcon}
            />
          </Grid>
        </Grid>
        {/* end detail header */}
        <Grid item className={classes.itemDetailsContents}>
          <Grid container direction="column" justify="space-around">
            <Grid item className={classes.itemGrowerDetail}>
              <Typography>Grower</Typography>
              <Typography variant="h6">{selectedItem.grower}</Typography>
            </Grid>
            <Grid item className={classes.itemGrowerDetail}>
              <Typography>Funder</Typography>
              <Typography variant="h6">{selectedItem.funder}</Typography>
            </Grid>
            <Grid item className={classes.itemGrowerDetail}>
              <Typography>ID</Typography>
              <Typography variant="body2">{selectedItem.id}</Typography>
            </Grid>
          </Grid>

          <Divider className={classes.itemDetailsContentsDivider} />

          <Grid container direction="row">
            <Grid item sm={5}>
              <Typography>Amount</Typography>
              <Typography variant="h6">
                {selectedItem.amount} {selectedItem.currency}{' '}
              </Typography>
            </Grid>

            <Grid item>
              <Typography>Captures Count</Typography>
              <Typography variant="h6">
                {selectedItem.captures_count}
              </Typography>
            </Grid>
          </Grid>

          <Divider className={classes.itemDetailsContentsDivider} />

          <Grid container direction="column" justify="space-around">
            <Grid item className={classes.itemGrowerDetail}>
              <Typography>Status</Typography>
              <Typography variant="h6">{selectedItem.status}</Typography>
            </Grid>

            <Grid item className={classes.itemGrowerDetail}>
              <Typography>
                Effective Date
                <Tooltip
                  title="Date amount was calculated"
                  placement="right-start"
                >
                  <InfoOutlinedIcon
                    fontSize="large"
                    className={classes.infoIconOutlined}
                  />
                </Tooltip>
              </Typography>
              <Typography variant="h6">{selectedItem.calculated_at}</Typography>
            </Grid>

            <Grid item className={classes.itemGrowerDetail}>
              <Typography>
                Payment Date
                <Tooltip title="Date amount was paid" placement="right-start">
                  <InfoOutlinedIcon
                    fontSize="large"
                    className={classes.infoIconOutlined}
                  />
                </Tooltip>
              </Typography>
              <Typography variant="h6">{selectedItem.paid_at}</Typography>
            </Grid>
          </Grid>

          <Divider className={classes.itemDetailsContentsDivider} />

          <Grid container direction="column" justify="space-around">
            <Grid item className={classes.itemGrowerDetail}>
              <Typography variant="h6">Consolidation</Typography>
            </Grid>

            <Grid item className={classes.itemGrowerDetail}>
              <Typography>Consolidation Type</Typography>
              <Typography variant="h6">FCC Tiered</Typography>
            </Grid>

            <Grid item className={classes.itemGrowerDetail}>
              <Grid container direction="row">
                <Grid item sm={5}>
                  <Typography>Start Date</Typography>
                  <Typography variant="h6">
                    {selectedItem.consolidation_period_start}
                  </Typography>
                </Grid>

                <Grid item>
                  <Typography>End Date</Typography>
                  <Typography variant="h6">
                    {selectedItem.consolidation_period_end}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {selectedItem?.status !== 'paid' && (
            <LogPaymentForm
              selectedItem={selectedItem}
              closeForm={closeDetails}
              refreshData={refreshData}
            />
          )}

          {selectedItem?.status === 'paid' && (
            <Grid item className={classes.itemGrowerDetail}>
              <Grid item>
                <Typography>Payment Confirmed by</Typography>
                <Typography variant="h6">
                  {userName || selectedItem.payment_confirmed_by}
                </Typography>
              </Grid>

              <Grid item className={classes.itemGrowerDetail}>
                <Typography>Payment confirmation method</Typography>
                <Typography variant="h6">
                  {selectedItem.payment_confirmation_method}
                </Typography>
              </Grid>

              <Grid item>
                <Typography>Payment confirmation id</Typography>
                <Typography variant="h6">
                  {selectedItem.payment_confirmation_id}
                </Typography>
              </Grid>

              <Grid item>
                <Typography>Payment method</Typography>
                <Typography variant="h6">
                  {selectedItem.payment_method}
                </Typography>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Drawer>
  );
}

export default CustomTableItemDetails;

CustomTableItemDetails.propTypes = {
  selectedItem: PropTypes.object.isRequired,
  closeDetails: PropTypes.func.isRequired,
  refreshData: PropTypes.func,
};

CustomTableItemDetails.defaultProps = {
  refreshData: () => {},
};
