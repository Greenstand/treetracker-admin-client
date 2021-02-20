import React from "react";
import { storiesOf } from "@storybook/react";
import LinearProgress from "@material-ui/core/LinearProgress";
import AppBar from "@material-ui/core/AppBar";
import Modal from "@material-ui/core/Modal";
import TreeImageScrubber from "../components/TreeImageScrubber";
import verity from "../models/verity";
import { ThemeProvider, useTheme } from "@material-ui/styles";
import theme from "../components/common/theme";
import { Provider } from "react-redux";
import { init } from "@rematch/core";
import * as models from "../models";
import Planters from "../components/Planters";

const store = init({ models });

storiesOf("planter", module).add("planter", () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Planters />
    </ThemeProvider>
  </Provider>
));
