import React from 'react';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import earningsAPI from '../../api/earnings';
import CustomTable from '../common/CustomTable/CustomTable';
import useStyles from './EarningsTable.styles';

/**
 * @function
 * @name EarningsTableFilter
 * @description render filter UI for earnings table
 * @returns {React.Component}
 */
function EarningsTableFilter() {
  const classes = useStyles();

  return (
    <Grid item>
      <Grid container direction="column" justify="space-between">
        <FormControl
          variant="outlined"
          className={classes.earningsFIlterSelectFormControl}
        >
          <InputLabel id="demo-simple-select-outlined-label">Funder</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            label="Funder"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>Environment For Africa</MenuItem>
          </Select>
        </FormControl>

        <FormControl
          variant="outlined"
          className={classes.earningsFIlterSelectFormControl}
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

      <Divider style={{ margin: '100px 0 20px 0' }} />

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
          APPLY
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
  );
}

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

export default function EarningsTable() {
  const getEarnings = (...args) => {
    return earningsAPI.getEarnings(...args);
  };
  return (
    <CustomTable
      handleGetData={getEarnings}
      tableMetaData={earningTableMetaData}
      filter={<EarningsTableFilter />}
    />
  );
}
