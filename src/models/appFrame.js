
const appFrame = {
  state: {
    currentView: "imageScrubber",
    appDrawer: {
      isOpen: false
    }
  },
  reducers: {
    toggleAppDrawer(state) {
      return {
        currentView: state.currentView,
        appDrawer: { isOpen: !state.isOpen }
      };
    },
    openAppDrawer(state) {
      return { currentView: state.currentView, appDrawer: { isOpen: true } };
    },
    closeAppDrawer(state) {
      return { currentView: state.currentView, appDrawer: { isOpen: false } };
    },
    changeCurrentView(state, payload) {
      return {
        currentView: payload.newView,
        appDrawer: { isOpen: state.isOpen }
      };
    }
  }
};

export default appFrame;
