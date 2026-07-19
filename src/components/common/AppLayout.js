import React from 'react';
import { Grid, Paper, useMediaQuery } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import Menu from 'components/common/Menu';
import Navbar from 'components/Navbar';

const useStyles = makeStyles((theme) => ({
  page: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    [theme.breakpoints.down('sm')]: { flexDirection: 'column' },
  },
  sidebar: { height: '100%' },
  mobileNav: { width: '100%' },
}));

/**
 * Standard app page layout: renders the primary navigation responsively —
 * the sidebar `Menu` on desktop, the `Navbar` on mobile (below the `sm`
 * breakpoint) — and lays the page content beside/below it. Wrap a view's
 * content with it; the content is rendered as children after the nav.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children  Page content (rendered after the nav).
 * @param {string} [props.className]        Extra class merged onto the page grid
 *   (e.g. a page background/min-height override).
 */
export default function AppLayout({ children, className }) {
  const classes = useStyles();
  const theme = useTheme();
  const isCompactLayout = useMediaQuery(theme.breakpoints.down('sm'), {
    noSsr: true,
  });

  const pageClassName = [classes.page, className].filter(Boolean).join(' ');

  return (
    <Grid className={pageClassName}>
      {isCompactLayout ? (
        <Grid item className={classes.mobileNav}>
          <Navbar />
        </Grid>
      ) : (
        <Paper elevation={3} className={classes.sidebar}>
          <Menu variant="plain" />
        </Paper>
      )}
      {children}
    </Grid>
  );
}
