import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from '@material-ui/styles';
import theme from '../components/common/theme';
import { Provider } from 'react-redux';
import { init } from '@rematch/core';
import * as models from '../models';
import Planters from '../components/Planters';

const store = init({ models });

storiesOf('planter', module).add('planter', () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Planters />
    </ThemeProvider>
  </Provider>
));
