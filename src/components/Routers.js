import React, { useContext, useRef, useMemo } from 'react';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Login from './Login';
import { AppContext } from '../context/AppContext';
import PrivateRoute from './PrivateRoute';
import Unauthorized from './Unauthorized';
import Page404 from './Page404';
import ReportingCard1 from './reportingCards/ReportingCard1';
import ReportingCard2 from './reportingCards/ReportingCard2';
import ReportingCard3 from './reportingCards/ReportingCard3';
import ReportingCard4 from './reportingCards/ReportingCard4';
import ReportingCard5 from './reportingCards/ReportingCard5';
import ReportingCard6 from './reportingCards/ReportingCard6';

export default function Routers() {
  const refContainer = useRef();
  const appContext = useContext(AppContext);

  return useMemo(() => {
    return (
      <Grid container wrap="nowrap">
        <Grid
          item
          style={{
            width: '100%',
          }}
        >
          <Grid
            container
            ref={refContainer}
            style={{
              height: '100vh',
              overflow: 'auto',
            }}
          >
            <Switch>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/planters">
                {' '}
                {/* cater for legacy naming */}
                <Redirect
                  to={{
                    pathname: '/growers',
                  }}
                />
              </Route>
              {appContext.routes.map((route, idx) =>
                route?.children ? (
                  route.children.map((child, i) => (
                    <PrivateRoute
                      path={child?.linkTo}
                      component={
                        child?.disabled ? Unauthorized : child?.component
                      }
                      exact={child?.exact}
                      getScrollContainerRef={
                        child?.linkTo === '/verify'
                          ? () => refContainer.current
                          : undefined
                      }
                      key={`route_${i}`}
                    />
                  ))
                ) : (
                  <PrivateRoute
                    path={route?.linkTo}
                    component={
                      route?.disabled ? Unauthorized : route?.component
                    }
                    exact={route?.exact}
                    getScrollContainerRef={
                      route?.linkTo === '/verify'
                        ? () => refContainer.current
                        : undefined
                    }
                    key={`route_${idx}`}
                  />
                ),
              )}
              <Route path="/reporting">
                {(() => {
                  const { search } = useLocation();
                  const queryParams = new URLSearchParams(search);
                  const props = {
                    startDate: queryParams.get('start-date'),
                    endDate: queryParams.get('end-date'),
                    rows: queryParams.get('rows'),
                    disableSeeMore: true,
                  };
                  return (
                    <Switch>
                      <Route path="/reporting/card1">
                        <ReportingCard1 {...props} />
                      </Route>
                      <Route path="/reporting/card2">
                        <ReportingCard2 {...props} />
                      </Route>
                      <Route path="/reporting/card3">
                        <ReportingCard3 {...props} />
                      </Route>
                      <Route path="/reporting/card4">
                        <ReportingCard4 {...props} />
                      </Route>
                      <Route path="/reporting/card5">
                        <ReportingCard5 {...props} />
                      </Route>
                      <Route path="/reporting/card6">
                        <ReportingCard6 {...props} />
                      </Route>
                    </Switch>
                  );
                })()}
              </Route>
              <Route
                render={
                  appContext.user
                    ? Page404
                    : ({ location }) => (
                        <Redirect
                          to={{
                            pathname: '/login',
                            state: { from: location },
                          }}
                        />
                      )
                }
              />
            </Switch>
          </Grid>
        </Grid>
      </Grid>
    );
  }, [appContext.routes, appContext.user]);
}
