import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ThemeProvider } from '@material-ui/core/styles'
import Routers from './components/Routers'
import theme from './components/common/theme'
import { AppProvider } from './components/Context'
import { BrowserRouter } from 'react-router-dom'
import {setLocaleLanguage} from './common/locale'

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
            <AppProvider>
              <Routers />
            </AppProvider>
          </BrowserRouter>
        </>
      </ThemeProvider>
    )
  }
}

const mapState = (state) => {
  return state
}

const mapDispatch = (dispatch) => ({})

export default connect(mapState, mapDispatch)(App)
