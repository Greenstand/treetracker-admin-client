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
    redirect_uri: 'http://localhost:3001',
    post_logout_redirect_uri:
      'https://dev-k8s.treetracker.org/auth/realms/treetracker/protocol/openid-connect/auth?client_id=admin-panel&redirect_uri=http%3A%2F%2Flocalhost%3A3001&response_type=code&scope=openid&state=d4a711af5c9641a7b5ec3d885a9c006f&code_challenge=u-gYCHLbwSbHBCFpU_Jrnx7dfm7BLVvVXy3S9lfyj80&code_challenge_method=S256&response_mode=query',
    realm: 'treetracker',
    onSigninCallback: (res) => {
      console.log('onSigninCallback', res);
      // localStorage.setItem('res', JSON.stringify(res));
      window.history.replaceState({}, document.title, window.location.pathname);
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
