import React, { useState, useContext } from 'react';
import PublishIcon from '@material-ui/icons/Publish';
import GetAppIcon from '@material-ui/icons/GetApp';
import { CSVLink } from 'react-csv';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import IconFilter from '@material-ui/icons/FilterList';
import { Avatar, Button, Grid, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import useStyles from './CustomTable.styles';
import { AppContext } from '../../../context/AppContext';
import dateFormat from 'dateformat';

/**
 * @function
 * @name ImportAction
 * @description component that renders the import action button & import csv file logic
 * @param {object} props - properties passed to component
 * @param {function} props.onSelectFile - callback function to be called when file is selected
 *
 * @returns {React.Component}
 * */
function ImportAction(props) {
  const { onSelectFile } = props;

  const handleOnSelectFile = (e) => {
    onSelectFile(e.target.files[0]);
    document.getElementById('file-upload-button').value = '';
  };

  const classes = useStyles();

  return (
    <Grid item lg={2}>
      <Grid container direction="row" justify="flex-end">
        <input
          accept=".csv,multipart/form-data"
          className={classes.uploadFileInput}
          onChange={handleOnSelectFile}
          id="file-upload-button"
          type="file"
        />
        <label htmlFor="file-upload-button">
          <Button variant="text" color="primary" component="span">
            <PublishIcon />
            <Typography variant="h6">UPLOAD</Typography>
          </Button>
        </label>
      </Grid>
    </Grid>
  );
}

ImportAction.propTypes = {
  onSelectFile: PropTypes.func,
};

ImportAction.defaultProps = {
  onSelectFile: () => {},
};

/**
 * @function
 * @name CustomTableHeader
 * @description renders custom table top bar which contains table actions(i.e. filter, export, etc)
 * @param {Object} props - properties passed to component
 * @param {React.Component} props.actionButtonType - determines which action button to render(value can either be 'export' or 'upload')
 * @param {function} props.openDateFilter - opens date filter when called
 * @param {function} props.openMainFilter - opens main filter when called
 * @param {function} props.onSelectFile - callback function to be called when file is selected
 * @param {string} props.headerTitle - title of the table
 * @param {number} props.activeFiltersCount - number of active filters
 * @param {string} props.activeDateRange - string representing the active date range (i.e. 'Oct 1 - Oct 5') in the date filter button
 * @param {Array} props.data - data to be exported
 *
 * @returns {React.Component}
 */
function CustomTableHeader({
  actionButtonType,
  headerTitle,
  openDateFilter,
  openMainFilter,
  activeDateRange,
  onSelectFile,
  activeFiltersCount,
  exportDataFetch,
}) {
  const classes = useStyles();
  const [csvFileNameSuffix, setCsvFileNameSuffix] = useState('');
  const [csvFileNamePrefix, setCsvFileNamePrefix] = useState('');

  const { orgList, selectedFilters } = useContext(AppContext);

  // const [data, setData] = useState([]);
  const [dataToExport, setDataToExport] = useState([]);

  async function fetchData() {
    // If organisation is used to filter data, use that as prefix for the csv filename
    if (selectedFilters.organisation_id) {
      const selectedOrg = orgList.filter(
        (org) => org.id == selectedFilters.organisation_id
      )[0];
      setCsvFileNamePrefix(`${selectedOrg.name}_`);
    }

    const { results: dataTemp } = await exportDataFetch(true);

    //if activeDateRange is set then use that for csv filename suffix
    if (activeDateRange.trim().length > 1) {
      setCsvFileNameSuffix(activeDateRange);
    } else {
      if (!dataTemp || dataTemp.length == 0) return;
      const consolidationPeriodStarts = dataTemp.map(
        (row) => new Date(row.csv_start_date)
      );
      const consolidationPeriodEnds = dataTemp.map(
        (row) => new Date(row.csv_end_date)
      );
      const minPeriodStart = consolidationPeriodStarts.reduce(
        (pStart1, pStart2) => {
          return pStart1 > pStart2 ? pStart2 : pStart1;
        }
      );
      const maxPeriodEnd = consolidationPeriodEnds.reduce((pEnd1, pEnd2) => {
        return pEnd1 > pEnd2 ? pEnd1 : pEnd2;
      });
      const minCsvStartDate = dateFormat(
        new Date(minPeriodStart),
        'yyyy-mm-dd'
      );
      const maxCsvEndDate = dateFormat(new Date(maxPeriodEnd), 'yyyy-mm-dd');
      setCsvFileNameSuffix(`${minCsvStartDate}_to_${maxCsvEndDate}`);
    }

    const dataToExportTemp = dataTemp.map(
      ({
        id: earnings_id,
        worker_id,
        phone,
        currency,
        captures_count,
        amount,
        payment_confirmation_id,
        payment_method,
        paid_at,
      }) => ({
        earnings_id,
        worker_id,
        phone,
        currency,
        amount,
        captures_count,
        payment_confirmation_id,
        payment_method,
        paid_at,
      })
    );

    setDataToExport(dataToExportTemp);
    // setData(dataTemp);
  }

  return (
    <Grid container className={classes.customTableTopBar}>
      <Grid item xs={4}>
        <Typography className={classes.customTableTopTitle} variant="h4">
          {headerTitle}
        </Typography>
      </Grid>

      {/*  start custom table actions */}
      <Grid item xs={8}>
        <Grid container direction="row" justify="flex-end" alignItems="center">
          {/*  show export button if actionButtonType is 'export' */}
          {actionButtonType === 'export' && (
            <Grid item lg={2}>
              <Grid container direction="row" justify="flex-end">
                <CSVLink
                  data={dataToExport}
                  filename={`${csvFileNamePrefix}${csvFileNameSuffix}.csv`}
                  className={classes.csvLink}
                  id="csv-link"
                  target="_blank"
                  style={{ display: 'none' }}
                ></CSVLink>
                <Button
                  color="primary"
                  variant="text"
                  onClick={async () => {
                    console.warn('CSV Link Clicked');
                    console.warn('fetched');
                    await fetchData();
                    console.warn('done...');
                    document.getElementById('csv-link').click();
                  }}
                >
                  <GetAppIcon />
                  <Typography variant="h6">EXPORT</Typography>
                </Button>
              </Grid>
            </Grid>
          )}

          {actionButtonType === 'upload' && (
            <ImportAction onSelectFile={onSelectFile} />
          )}

          {/* start Date Range button */}
          <Grid item lg={3}>
            <Grid container direction="row" justify="flex-end">
              <Button
                className={classes.customTableDateFilterButton}
                onClick={() => openDateFilter()}
              >
                <Grid container direction="row" justify="center">
                  <div>
                    <Typography className={classes.dateFiterButonSmallText}>
                      Date Range
                    </Typography>
                    {activeDateRange ? (
                      <Typography className={classes.dateFiterButonMediumText}>
                        {activeDateRange}
                      </Typography>
                    ) : (
                      <Typography className={classes.dateFiterButonSmallText}>
                        All
                      </Typography>
                    )}
                  </div>
                  <ArrowDropDownIcon
                    className={classes.arrowDropDownIcon}
                    fontSize="large"
                  />
                </Grid>
              </Button>
            </Grid>
          </Grid>
          {/* end Date Range button */}

          {/* start Filter button */}
          <Grid item lg={3}>
            <Grid container direction="row" justify="flex-end">
              <Button
                onClick={openMainFilter}
                className={classes.filterButton}
                startIcon={<IconFilter className={classes.iconFilter} />}
              >
                <Typography className={classes.filterButtonText}>
                  Filter
                </Typography>
                {activeFiltersCount > 0 && (
                  <Avatar className={classes.filterAvatar}>
                    {activeFiltersCount}
                  </Avatar>
                )}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* end custom table actions */}
    </Grid>
  );
}

CustomTableHeader.propTypes = {
  // setIsFilterOpen: PropTypes.func.isRequired,
  openDateFilter: PropTypes.func,
  openMainFilter: PropTypes.func,
  onSelectFile: PropTypes.func,
  activeFiltersCount: PropTypes.number,
  data: PropTypes.array.isRequired,
  headerTitle: PropTypes.string.isRequired,
  activeDateRange: PropTypes.string.isRequired,
  actionButtonType: PropTypes.string.isRequired,
};

CustomTableHeader.defaultProps = {
  openDateFilter: () => {},
  openMainFilter: () => {},
  onSelectFile: () => {},
  activeFiltersCount: 0,
};

export default CustomTableHeader;
