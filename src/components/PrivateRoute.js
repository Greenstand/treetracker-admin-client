import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function PrivateRoute({ component: Component, ...rest }) {
  const appContext = useContext(AppContext);

  return (
    <Route
      {...rest}
      render={(props) =>
        appContext.user ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
}
