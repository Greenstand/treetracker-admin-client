import React, { useEffect } from 'react';
import { documentTitle } from '../common/variables';
import VerificationDashboard from '../components/VerificationDashboard/VerificationDashboard';

function VerificationDashboardView() {
  useEffect(() => {
    document.title = `Verify Captures - ${documentTitle}`;
  }, []);

  return <VerificationDashboard />;
}

export default VerificationDashboardView;
