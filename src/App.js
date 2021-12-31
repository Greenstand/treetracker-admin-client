import React, { Component } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './components/common/theme';
import Routers from './components/Routers';
import { AppProvider } from './context/AppContext';
import { BrowserRouter } from 'react-router-dom';
import { setLocaleLanguage } from './common/locale';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './Keycloak';
import IconLogo from './components/IconLogo';

class App extends Component {
  componentDidMount() {
    // in the future we want to maybe restore the users last filter set from the server
    // as well as deal with all the login state stuff.
    setLocaleLanguage(navigator.language);
  }

  render() {
    return (
      <ReactKeycloakProvider
        authClient={keycloak}
        initOptions={{ onLoad: 'login-required', checkLoginIframe: false }}
        LoadingComponent={IconLogo}
      >
        <ThemeProvider theme={theme}>
          <>
            <BrowserRouter>
              <AppProvider>
                <Routers />
              </AppProvider>
            </BrowserRouter>
          </>
        </ThemeProvider>
      </ReactKeycloakProvider>
    );
  }
}

export default App;
