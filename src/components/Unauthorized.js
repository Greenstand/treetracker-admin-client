import React from 'react';

import GenericMessagePage from './GenericMessagePage';

export default function Unauthorized() {
  return <GenericMessagePage text="You are not authorized to view this page" />;
}
