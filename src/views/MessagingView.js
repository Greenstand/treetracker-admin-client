import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { documentTitle } from '../common/variables';
import Messaging from 'components/Messaging/Messaging';
import Navbar from 'components/Navbar';

const MessagingView = () => {
  // set Title
  useEffect(() => {
    document.title = `Messaging - ${documentTitle}`;
  }, []);

  return (
    <Grid container direction="column">
      <Navbar />
      <Messaging />
    </Grid>
  );
};

export default MessagingView;
