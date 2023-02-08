/*
 * Grower page
 */
import React, { useState, useContext } from 'react';
import { TablePagination, Typography, Tooltip, Box } from '@material-ui/core';
import Grower from './Grower';
import GrowerDetail from '../GrowerDetail';
import GrowerTooltip from './GrowerTooltip';
import { GrowerContext } from 'context/GrowerContext';
import { useStyle } from './Growers.styles.js';

const log = require('loglevel').getLogger('../components/Growers');

const Growers = (props) => {
  log.debug('render: Growers...');
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
    if (grower.placeholder) {
      return;
    }
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

  const enableTooltips = process.env.REACT_APP_ENABLE_TOOLTIPS === 'true';

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
        enterDelay={500}
        enterNextDelay={500}
        interactive
        title={
          enableTooltips && !grower.placeholder ? (
            <GrowerTooltip grower={grower} growerClick={handleGrowerClick} />
          ) : (
            ''
          )
        }
      >
        <Box>
          <Grower grower={grower} growerClick={handleGrowerClick} />
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
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleChangePageSize}
      labelRowsPerPage="Growers per page:"
    />
  );

  return (
    <Box className={classes.body}>
      <Box className={classes.title}>
        <Typography variant="h5">Growers</Typography>
        <Box>{pagination}</Box>
      </Box>

      <Box className={classes.items}>{growersItems}</Box>

      <Box className={classes.pagination}>{pagination}</Box>

      <GrowerDetail
        open={isDetailShown}
        growerId={growerDetail.id}
        onClose={() => setDetailShown(false)}
      />
    </Box>
  );
};

export default Growers;
