import React, { Component, useContext } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './components/common/theme';
import Routers from './components/Routers';
import { AppProvider, AppContext } from './context/AppContext';
import { DomainProvider } from './features/domain/DomainContext';
import { BrowserRouter } from 'react-router-dom';
import { setLocaleLanguage } from './common/locale';

function DomainRoutes() {
  const { user } = useContext(AppContext);
  return (
    <DomainProvider user={user}>
      <Routers />
    </DomainProvider>
  );
}

class App extends Component {
  componentDidMount() {
    // in the future we want to maybe restore the users last filter set from the server
    // as well as deal with all the login state stuff.
    setLocaleLanguage(navigator.language);
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <>
          <BrowserRouter>
            <AppProvider initialAuth={this.props.initialAuth}>
              <DomainRoutes />
            </AppProvider>
          </BrowserRouter>
        </>
      </ThemeProvider>
    );
  }
}

export default App;
