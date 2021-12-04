import React, { useContext, useRef, useMemo } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Login from './Login';
import { AppContext } from '../context/AppContext';
import PrivateRoute from './PrivateRoute';
import Unauthorized from './Unauthorized';
import Page404 from './Page404';

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
