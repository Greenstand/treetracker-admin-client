import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import { format } from 'date-fns';
import contractsAPI from '../../api/contracts';
import CustomTable from '../common/CustomTable/CustomTable';
import {
  convertDateStringToHumanReadableFormat,
  generateActiveDateRangeFilterString,
} from 'utilities';
import CustomTableFilter from 'components/common/CustomTableFilter/CustomTableFilter';
import CustomTableItemDetails from 'components/common/CustomTableItemDetails/CustomTableItemDetails';
import CreateContractAgreement from './CreateContractAgreement';

const useStyles = makeStyles({
  flex: {
    display: 'flex',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  margin: {
    marginTop: '3rem',
    marginBottom: '2rem',
  },
});

/**
 * @constant
 * @name contractsTableMetaData
 * @description contains table meta data
 * @type {Object[]}
 * @param {string} contractsTableMetaData[].name - earning property used to get earning property value from earning object to display in table
 * @param {string} contractsTableMetaData[].description - column description/label to be displayed in table
 * @param {boolean} contractsTableMetaData[].sortable - determines if column is sortable
 * @param {boolean} contractsTableMetaData[].showInfoIcon - determines if column has info icon
 */
const contractsTableMetaData = [
  {
    description: 'Name',
    name: 'name',
    sortable: true,
    showInfoIcon: false,
  },
  {
    description: 'ID',
    name: 'id',
    sortable: true,
    showInfoIcon: false,
  },
  {
    description: 'Type',
    name: 'type',
    sortable: true,
    showInfoIcon: false,
  },
  {
    description: 'Funder ID',
    name: 'funder_id',
    sortable: true,
    showInfoIcon: false,
  },
  {
    description: 'Owner ID',
    name: 'owner_id',
    sortable: true,
    showInfoIcon: false,
  },
  {
    description: 'Organization',
    name: 'growing_organization_id',
    sortable: true,
    showInfoIcon: false,
  },
  {
    description: 'Species Agreement ID',
    name: 'species_agreement_id',
    sortable: false,
    showInfoIcon: false,
  },
  {
    description: 'Consolidation Rule ID',
    name: 'consolidation_rule_id',
    sortable: false,
    showInfoIcon: false,
  },
  // {
  //   description: 'Total Trees',
  //   name: 'total',
  //   sortable: true,
  //   showInfoIcon: false,
  //   // showInfoIcon:
  //   //   'The effective data is the date on which captures were consolidated and the contracts record was created',
  //   align: 'right',
  // },
  {
    description: 'Status',
    name: 'status',
    sortable: true,
    showInfoIcon: false,
  },
  {
    description: 'Last Modified',
    name: 'updated_at',
    sortable: true,
    showInfoIcon: false,
  },
  {
    description: 'Created At',
    name: 'created_at',
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
      created_at: convertDateStringToHumanReadableFormat(
        row.created_at,
        'yyyy-MM-dd'
      ),
      updated_at: convertDateStringToHumanReadableFormat(
        row.updated_at,
        'yyyy-MM-dd'
      ),
      // csv_start_date: row.consolidation_period_start,
      // csv_end_date: row.consolidation_period_end,
      // consolidation_period_start: convertDateStringToHumanReadableFormat(
      //   row.consolidation_period_start,
      //   'yyyy-MM-dd'
      // ),
      // consolidation_period_end: convertDateStringToHumanReadableFormat(
      //   row.consolidation_period_end,
      //   'yyyy-MM-dd'
      // ),
      // calculated_at: convertDateStringToHumanReadableFormat(
      //   row.calculated_at,
      //   'yyyy-MM-dd'
      // ),
      // payment_confirmed_at: convertDateStringToHumanReadableFormat(
      //   row.payment_confirmed_at
      // ),
      // paid_at: row.paid_at ? format(new Date(row.paid_at), 'yyyy-MM-dd') : '',
    };
  });

/**
 * @function
 * @name ContractAgreementsTable
 * @description renders the contracts table
 *
 * @returns {React.Component} - contracts table component
 * */
function ContractAgreementsTable() {
  const classes = useStyles();
  // state for contracts table
  const [contracts, setContracts] = useState([]);
  const [activeDateRangeString, setActiveDateRangeString] = useState('');
  const [filter, setFilter] = useState({});
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [contractsPerPage, setContractsPerPage] = useState(20);
  const [sortBy, setSortBy] = useState({
    field: 'status',
    order: 'desc',
  });
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [isMainFilterOpen, setIsMainFilterOpen] = useState(false);
  const [totalContracts, setTotalContracts] = useState(0);
  const [selectedContractAgreement, setSelectedContractAgreement] = useState(
    null
  );
  const [isDetailShown, setDetailShown] = useState(false);

  async function getContracts(fetchAll = false) {
    // console.warn('getContracts with fetchAll: ', fetchAll);
    setIsLoading(true); // show loading indicator when fetching data

    const { results, totalCount = 0 } = await getContractAgreements(fetchAll);
    console.log('results:', results, 'totalCount:', totalCount);
    setContracts(results);
    setTotalContracts(totalCount);

    setIsLoading(false); // hide loading indicator when data is fetched
  }

  async function getContractAgreements(fetchAll = false) {
    const filtersToSubmit = { ...filter };

    console.log('getContractAgreements before ', filtersToSubmit);
    // filter out keys we don't want to submit
    Object.keys(filtersToSubmit).forEach((k) => {
      if (k === 'organization_id' && filtersToSubmit[k].length) {
        filtersToSubmit['growing_organization_id'] = filtersToSubmit[k];
        delete filtersToSubmit[k];
        delete filtersToSubmit['sub_organization'];
      }
      if (
        filtersToSubmit[k] === 'all' ||
        filtersToSubmit[k] === '' ||
        filtersToSubmit[k] === undefined
      ) {
        delete filtersToSubmit[k];
      }
    });

    const queryParams = {
      offset: fetchAll ? 0 : page * contractsPerPage,
      limit: fetchAll ? 90000 : contractsPerPage,
      // sort_by: sortBy?.field,
      // order: sortBy?.order,
      ...filtersToSubmit,
    };

    console.log('getContractAgreements after', queryParams);

    // log.debug('queryParams', queryParams);

    const response = await contractsAPI.getContractAgreements(queryParams);
    console.log('getContractAgreements response: ', response);

    const results = prepareRows(response.agreements);
    return {
      results,
      totalCount: response.query.count,
    };
  }

  const handleOpenMainFilter = () => setIsMainFilterOpen(true);
  const handleOpenDateFilter = () => setIsDateFilterOpen(true);

  useEffect(() => {
    // console.log('contractAgreementsTable usEffect filter', filter);
    if (filter?.start_date && filter?.end_date) {
      const dateRangeString = generateActiveDateRangeFilterString(
        filter?.start_date,
        filter?.end_date
      );
      setActiveDateRangeString(dateRangeString);
    } else {
      setActiveDateRangeString('');
    }

    getContracts();
  }, [page, contractsPerPage, /*sortBy,*/ filter]);

  return (
    <>
      <div className={classes.flex}>
        <CreateContractAgreement />
      </div>

      <CustomTable
        setPage={setPage}
        page={page}
        sortBy={sortBy}
        rows={contracts}
        isLoading={isLoading}
        activeDateRange={activeDateRangeString}
        setRowsPerPage={setContractsPerPage}
        rowsPerPage={contractsPerPage}
        setSortBy={setSortBy}
        totalCount={totalContracts}
        openMainFilter={handleOpenMainFilter}
        openDateFilter={handleOpenDateFilter}
        handleGetData={getContracts}
        setSelectedRow={(value) => {
          setSelectedContractAgreement(value);
          setDetailShown(true);
        }}
        selectedRow={selectedContractAgreement}
        tableMetaData={contractsTableMetaData}
        activeFiltersCount={
          Object.keys(filter).filter(
            (k) =>
              filter[k] !== 'all' && filter[k] !== '' && filter[k] !== undefined
          ).length
        }
        headerTitle="Contract Agreements"
        mainFilterComponent={
          <CustomTableFilter
            isFilterOpen={isMainFilterOpen}
            filter={filter}
            filterType="agreement"
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
          selectedContractAgreement ? (
            <CustomTableItemDetails
              open={isDetailShown}
              selectedItem={selectedContractAgreement}
              refreshData={getContracts}
              onClose={() => {
                setDetailShown(false);
                setSelectedContractAgreement(null);
              }}
              showLogPaymentForm={false}
            />
          ) : null
        }
        actionButtonType="export"
        exportDataFetch={getContractAgreements}
      />
    </>
  );
}

export default ContractAgreementsTable;
