/*
 * Grower page
 */
import React, { useState, useContext } from 'react';

import Grid from '@material-ui/core/Grid';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import Grower from './Grower';
import GrowerDetail from '../GrowerDetail';
import GrowerTooltip from './GrowerTooltip';
import { GrowerContext } from '../../context/GrowerContext';
import { useStyle } from './Growers.styles.js';
import { Tooltip, Box } from '@material-ui/core';

// const log = require('loglevel').getLogger('../components/Growers');

const Growers = (props) => {
  // log.debug('render: Growers...');
  const classes = useStyle(props);
  const growerContext = useContext(GrowerContext);
  const [isDetailShown, setDetailShown] = useState(false);
  const [growerDetail, setGrowerDetail] = useState({});

  function handlePageChange(e, page) {
    growerContext.changeCurrentPage(page);
  }

  function handleChangePageSize(e, option) {
    growerContext.changePageSize(option.props.value);
  }

  function handleGrowerClick(grower) {
    setDetailShown(true);
    setGrowerDetail(grower);
  }

  const placeholderGrowers = Array(growerContext.pageSize)
    .fill()
    .map((_, index) => {
      return {
        id: index,
        placeholder: true,
      };
    });

  let growersItems = (growerContext.isLoading
    ? placeholderGrowers
    : growerContext.growers
  ).map((grower, i) => {
    //combine i + grower.id to create unique keys even when there are duplicate grower.ids
    return (
      <Tooltip
        key={`${i} + ${grower.id}`}
        placement="top"
        classes={{
          tooltipPlacementTop: classes.tooltipTop,
          tooltipPlacementBottom: classes.tooltipBottom,
        }}
        arrow={true}
        interactive
        title={
          <GrowerTooltip grower={grower} growerClick={handleGrowerClick} />
        }
      >
        <Box>
          <Grower
            onClick={() => handleGrowerClick(grower)}
            key={`${i} + ${grower.id}`}
            grower={grower}
            placeholder={grower.placeholder}
          />
        </Box>
      </Tooltip>
    );
  });

  const pagination = (
    <TablePagination
      rowsPerPageOptions={[24, 48, 96]}
      component="div"
      count={growerContext.count || 0}
      rowsPerPage={growerContext.pageSize}
      page={growerContext.currentPage}
      onChangePage={handlePageChange}
      onChangeRowsPerPage={handleChangePageSize}
      labelRowsPerPage="Growers per page:"
    />
  );

  return (
    <Grid item container style={{ height: '100%', overflow: 'auto' }}>
      <Grid item className={classes.body}>
        <Grid container>
          <Grid
            item
            style={{
              width: '100%',
            }}
          >
            <Grid
              container
              justify="space-between"
              alignItems="center"
              className={classes.title}
            >
              <Grid item>
                <Typography variant="h5">Growers</Typography>
              </Grid>
              <Grid item>{pagination}</Grid>
            </Grid>
          </Grid>
          <Grid item container direction="row" justify="center">
            {growersItems}
          </Grid>
        </Grid>
        <Grid container className={classes.page} justify="flex-end">
          {pagination}
        </Grid>
      </Grid>
      <GrowerDetail
        open={isDetailShown}
        growerId={growerDetail.id}
        onClose={() => setDetailShown(false)}
      />
    </Grid>
  );
};

export default Growers;
