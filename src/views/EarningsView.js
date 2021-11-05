import React, { useEffect } from 'react';
import EarningsTable from '../components/EarningsTable/EarningsTable';
import { documentTitle } from '../common/variables';

/**
 * @function
 * @name EarningsView
 * @description View for the earnings page
 *
 * @returns {React.Component}
 */
function EarningsView() {
  useEffect(() => {
    document.title = `Earnings - ${documentTitle}`;
  }, []);
  return <EarningsTable />;
}

export default EarningsView;
