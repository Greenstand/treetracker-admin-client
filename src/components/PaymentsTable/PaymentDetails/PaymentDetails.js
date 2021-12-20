import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import Drawer from '@material-ui/core/Drawer';
import CloseIcon from '@material-ui/icons/Close';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import paymentsAPI from 'api/earnings';
import useStyles from './PaymentDetails.styles';

/**
 * @function
 * @name LogPaymentForm
 * @description render form to log payment
 * @param {object} props - properties  passed to the component
 * @param {object} props.selectedPayment - payment object
 * @param {function} props.closeForm - function used to close form
 * @returns {React.Component} - form to log payment
 */
function LogPaymentForm(props) {
  const { selectedPayment, closeForm } = props;
  const [payload, setPayload] = useState({});
  const classes = useStyles();

  const handleOnInputChange = (e) => {
    e.preventDefault();
    const { value, name } = e.target;
    const updatedPayload = { ...payload, [name]: value };
    setPayload(updatedPayload);
  };

  const handleOnFormSubmit = () => {
    const { id, worker_id, amount, currency } = selectedPayment;
    paymentsAPI.patchPayment({ id, worker_id, amount, currency, ...payload });
    closeForm();
  };

  return (
    <>
      <Grid container direction="column" justify="space-around">
        <Grid item className={classes.paymentGrowerDetail}>
          <Typography variant="h6">Payment</Typography>
        </Grid>

        <Grid container direction="column" justify="space-between">
          <FormControl
            variant="outlined"
            className={classes.paymentsLogPaymentFormSelectFormControl}
          >
            <TextField
              id="payment_confirmation_id"
              name="payment_confirmation_id"
              label="Payment Confirmation Id"
              variant="outlined"
              onChange={handleOnInputChange}
            />
          </FormControl>

          <FormControl
            variant="outlined"
            className={classes.paymentsLogPaymentFormSelectFormControl}
          >
            <InputLabel id="demo-simple-select-outlined-label">
              Payment System
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="payment_system"
              name="payment_system"
              label="Payment System"
              onChange={handleOnInputChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="visa">Visa</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item className={classes.paymentGrowerDetail}>
          <Grid item>
            <Typography>Payment Confirmed by</Typography>
            <Typography variant="b">
              {selectedPayment.payment_confirmed_by}
            </Typography>
          </Grid>

          <Grid item className={classes.paymentGrowerDetail}>
            <Typography>Payment confirmation method</Typography>
            <Typography variant="b">
              {selectedPayment.payment_confirmation_method}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Divider className={classes.paymentDetailsContentsDivider} />

      <Grid
        container
        direction="column"
        className={classes.paymentTableFilterActions}
      >
        <Button
          variant="contained"
          color="primary"
          disableElevation
          onClick={handleOnFormSubmit}
          className={classes.paymentTableFilterSubmitButton}
        >
          LOG PAYMENT
        </Button>
        <Button
          color="primary"
          variant="text"
          className={classes.paymentTableFilterCancelButton}
          onClick={closeForm}
        >
          CANCEL
        </Button>
      </Grid>
    </>
  );
}

LogPaymentForm.propTypes = {
  selectedPayment: PropTypes.object.isRequired,
  closeForm: PropTypes.func.isRequired,
};

/**
 * @function
 * @name PaymentDetails
 * @description render details of an payment
 * @param {object} props - properties  passed to the component
 * @param {boolean} props.isDetailsDrawerOpen - flag that decides wheather details drawer should open/close
 * @param {object} props.selectedPayment - payment object
 * @param {boolean} props.showLogPayment - flag that decides wheather log payment form should be shown
 * @param {Function} props.setSelectedPayment - sets/resets selected payment object
 *
 * @returns {React.Component}
 */
function PaymentDetails(props) {
  const { selectedPayment, showLogPaymentForm, closeDetails } = props;
  const classes = useStyles();

  return selectedPayment ? (
    <Drawer
      anchor="right"
      BackdropProps={{ invisible: true }}
      open={selectedPayment}
    >
      <Grid
        container
        direction="column"
        className={classes.paymentsDrawerDetails}
      >
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
              className={classes.paymentDetailsCloseIcon}
            />
          </Grid>
        </Grid>
        {/* end detail header */}
        <Grid item className={classes.paymentDetailsContents}>
          <Grid container direction="column" justify="space-around">
            <Grid item className={classes.paymentGrowerDetail}>
              <Typography>Grower</Typography>
              <Typography variant="b">{selectedPayment.grower}</Typography>
            </Grid>
            <Grid item className={classes.paymentGrowerDetail}>
              <Typography>Funder</Typography>
              <Typography variant="b">{selectedPayment.funder}</Typography>
            </Grid>
          </Grid>

          <Divider className={classes.paymentDetailsContentsDivider} />

          <Grid container direction="row">
            <Grid item sm={5}>
              <Typography>Amount</Typography>
              <Typography variant="b">{selectedPayment.amount} </Typography>
            </Grid>

            <Grid item>
              <Typography>Currency</Typography>
              <Typography variant="b">{selectedPayment.currency}</Typography>
            </Grid>
          </Grid>

          <Divider className={classes.paymentDetailsContentsDivider} />

          <Grid container direction="column" justify="space-around">
            <Grid item className={classes.paymentGrowerDetail}>
              <Typography>Status</Typography>
              <Typography variant="b">{selectedPayment.status}</Typography>
            </Grid>

            <Grid item className={classes.paymentGrowerDetail}>
              <Typography>
                Effective Payment Date
                <InfoOutlinedIcon
                  fontSize="large"
                  className={classes.infoIconOutlined}
                />
              </Typography>
              <Typography variant="b">{selectedPayment.paid_at}</Typography>
            </Grid>
          </Grid>

          <Divider className={classes.paymentDetailsContentsDivider} />

          <Grid container direction="column" justify="space-around">
            <Grid item className={classes.paymentGrowerDetail}>
              <Typography variant="h6">Consolidation</Typography>
            </Grid>

            <Grid item className={classes.paymentGrowerDetail}>
              <Typography>Consolidation Type</Typography>
              <Typography variant="b">Default</Typography>
            </Grid>

            <Grid item className={classes.paymentGrowerDetail}>
              <Grid container direction="row">
                <Grid item sm={5}>
                  <Typography>Start Date</Typography>
                  <Typography variant="b">
                    {selectedPayment.consolidation_period_start}
                  </Typography>
                </Grid>

                <Grid item>
                  <Typography>End Date</Typography>
                  <Typography variant="b">
                    {selectedPayment.consolidation_period_end}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {showLogPaymentForm && (
            <LogPaymentForm
              selectedPayment={selectedPayment}
              closeForm={closeDetails}
            />
          )}
        </Grid>
      </Grid>
    </Drawer>
  ) : (
    ''
  );
}

export default PaymentDetails;

PaymentDetails.propTypes = {
  selectedPayment: PropTypes.object.isRequired,
  closeDetails: PropTypes.func.isRequired,
  showLogPaymentForm: PropTypes.bool,
};

PaymentDetails.defaultProps = {
  showLogPaymentForm: false,
};
