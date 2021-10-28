import React, { useEffect } from 'react';
import EarningsTable from '../components/EarningsTable/EarningsTable';
import { documentTitle } from '../common/variables';

/**
 * @function
 * @name EarningsView
 * @description View for the earnings page
 * @param {Object} props - The properties passed to the component
 * @returns {React.Component}
 */
function EarningsView(props) {
  useEffect(() => {
    document.title = `Earnings - ${documentTitle}`; // change the document title
  }, []);
  return <EarningsTable />;
}

export default EarningsView;
