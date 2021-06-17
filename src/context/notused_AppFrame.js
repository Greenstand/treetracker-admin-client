import React, { Component, createContext } from 'react';

export const AppFrameContext = createContext({});

export class AppFrameProvider extends Component {
  state = {
    currentView: 'imageScrubber',
    appDrawer: {
      isOpen: false,
    },
  };

  toggleAppDrawer() {
    this.setState({
      currentView: this.state.currentView,
      appDrawer: { isOpen: !this.state.isOpen },
    });
  }

  openAppDrawer() {
    this.setState({
      currentView: this.state.currentView,
      appDrawer: { isOpen: true },
    });
  }

  closeAppDrawer() {
    this.setState({
      currentView: this.state.currentView,
      appDrawer: { isOpen: false },
    });
  }

  changeCurrentView(payload) {
    this.setState({
      currentView: payload.newView,
      appDrawer: { isOpen: this.state.isOpen },
    });
  }

  render() {
    const value = {
      currentView: this.currentView,
      appDrawer: this.appDrawer,
    };
    return (
      <AppFrameContext.Provider value={value}>
        {this.props.children}
      </AppFrameContext.Provider>
    );
  }
}
