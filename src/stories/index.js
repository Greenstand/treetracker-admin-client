import "../init";
import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
import IconLogo from "../components/IconLogo";
import Filter from "../components/Filter";
import {
  MuiThemeProvider,
  MuiThemeProvider as Theme,
  createMuiTheme,
} from "@material-ui/core/styles";
import { theme } from "../App";
import themeNew from "../components/common/theme";
import Typography from "@material-ui/core/Typography";
import { withTheme } from "@material-ui/core/styles";
import FilterModel from "../models/Filter";

/*
 * Import other stories
 */
import "./common";
import "./components";
import "./verity";
import "./tests";
import "./planter";
