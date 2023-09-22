import React, { Component } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './components/common/theme';
import Routers from './components/Routers';
import { AppProvider } from './context/AppContext';
import { BrowserRouter } from 'react-router-dom';
import { setLocaleLanguage } from './common/locale';
import { AuthProvider } from 'react-oidc-context';

class App extends Component {
  componentDidMount() {
    // in the future we want to maybe restore the users last filter set from the server
    // as well as deal with all the login state stuff.
    setLocaleLanguage(navigator.language);
  }

  oidcConfig = {
    authority: 'https://dev-k8s.treetracker.org/auth/realms/treetracker/',
    client_id: 'admin-panel',
    // redirect_uri: 'https://dev-k8s.treetracker.org/auth',
    redirect_uri: 'http://localhost:3001',
    realm: 'treetracker',
    onSigninCallback: (res) => {
      console.log('onSigninCallback', res);
      // localStorage.setItem('res', JSON.stringify(res));
      window.history.replaceState({}, document.title, window.location.pathname);
      // console.log('onSigninCallback', window.history);
    },
    // required to remove the payload from the URL upon successful login so that silentLogin will work
  };

  render() {
    return (
      <ThemeProvider theme={theme}>
        <>
          <AuthProvider {...this.oidcConfig}>
            <BrowserRouter>
              <AppProvider>
                <Routers />
              </AppProvider>
            </BrowserRouter>
          </AuthProvider>
        </>
      </ThemeProvider>
    );
  }
}

export default App;
