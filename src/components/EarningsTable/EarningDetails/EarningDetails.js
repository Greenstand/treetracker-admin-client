import React from 'react';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import useStyles from './EarningDetails.styles';

/**
 * @function
 * @name EarningDetails
 * @description render details of an earning
 * @param {object} props - properties  passed to the component
 * @param {boolean} props.isDetailsDrawerOpen - flag that decides wheather details drawer should open/close
 * @param {Function} setIsDetailsDrawerOpen - closes earning details drawer when executed
 * @param {object} props.selectedEarning - earning object
 * @param {Function} props.setSelectedEarning - sets/resets selected earning object
 *
 * @returns {React.Component}
 */
function EarningDetails(props) {
  const { selectedEarning } = props;
  const classes = useStyles();

  return selectedEarning ? (
    <Grid item className={classes.earningDetailsContents}>
      <Grid container direction="column" justify="space-around">
        <Grid item className={classes.earningGrowerDetail}>
          <Typography>Grower</Typography>
          <Typography variant="b">{selectedEarning.grower}</Typography>
        </Grid>
        <Grid item className={classes.earningGrowerDetail}>
          <Typography>Funder</Typography>
          <Typography variant="b">{selectedEarning.funder}</Typography>
        </Grid>
      </Grid>

      <Divider className={classes.earningDetailsContentsDivider} />

      <Grid container direction="row">
        <Grid item sm={5}>
          <Typography>Amount</Typography>
          <Typography variant="b">{selectedEarning.amount} </Typography>
        </Grid>

        <Grid item>
          <Typography>Currency</Typography>
          <Typography variant="b">{selectedEarning.currency}</Typography>
        </Grid>
      </Grid>

      <Divider className={classes.earningDetailsContentsDivider} />

      <Grid container direction="column" justify="space-around">
        <Grid item className={classes.earningGrowerDetail}>
          <Typography>Status</Typography>
          <Typography variant="b">{selectedEarning.status}</Typography>
        </Grid>

        <Grid item className={classes.earningGrowerDetail}>
          <Typography>
            Effective Payment Date
            <InfoOutlinedIcon
              fontSize="large"
              className={classes.infoIconOutlined}
            />
          </Typography>
          <Typography variant="b">{selectedEarning.paid_at}</Typography>
        </Grid>
      </Grid>

      <Divider className={classes.earningDetailsContentsDivider} />

      <Grid container direction="column" justify="space-around">
        <Grid item className={classes.earningGrowerDetail}>
          <Typography variant="h6">Consolidation</Typography>
        </Grid>

        <Grid item className={classes.earningGrowerDetail}>
          <Typography>Consolidation Type</Typography>
          <Typography variant="b">Default</Typography>
        </Grid>

        <Grid item className={classes.earningGrowerDetail}>
          <Grid container direction="row">
            <Grid item sm={5}>
              <Typography>Start Date</Typography>
              <Typography variant="b">
                {selectedEarning.consolidation_period_start}
              </Typography>
            </Grid>

            <Grid item>
              <Typography>End Date</Typography>
              <Typography variant="b">
                {selectedEarning.consolidation_period_end}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Divider className={classes.earningDetailsContentsDivider} />

      <Grid container direction="column" justify="space-around">
        <Grid item className={classes.earningGrowerDetail}>
          <Typography variant="h6">Payment</Typography>
        </Grid>

        <Grid container direction="column" justify="space-between">
          <FormControl
            variant="outlined"
            className={classes.earningsFilterSelectFormControl}
          >
            <TextField
              id="outlined-basic"
              label="Payment Confirmation Id"
              variant="outlined"
            />
          </FormControl>

          <FormControl
            variant="outlined"
            className={classes.earningsFilterSelectFormControl}
          >
            <InputLabel id="demo-simple-select-outlined-label">
              Payment System
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              label="Payment System"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Visa</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item className={classes.earningGrowerDetail}>
          <Grid item>
            <Typography>Payment Confirmed by</Typography>
            <Typography variant="b">
              {selectedEarning.payment_confirmed_by}
            </Typography>
          </Grid>

          <Grid item className={classes.earningGrowerDetail}>
            <Typography>Payment confirmation method</Typography>
            <Typography variant="b">
              {selectedEarning.payment_confirmation_method}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Divider className={classes.earningDetailsContentsDivider} />

      <Grid
        container
        direction="column"
        className={classes.earningTableFilterActions}
      >
        <Button
          variant="contained"
          color="primary"
          disableElevation
          className={classes.earningTableFilterSubmitButton}
        >
          LOG PAYMENT
        </Button>
        <Button
          color="primary"
          variant="text"
          className={classes.earningTableFilterCancelButton}
        >
          CANCEL
        </Button>
      </Grid>
    </Grid>
  ) : (
    ''
  );
}

export default EarningDetails;
