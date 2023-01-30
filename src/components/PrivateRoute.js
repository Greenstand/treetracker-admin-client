import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function PrivateRoute({
  component: Component,
  search,
  ...rest
}) {
  const appContext = useContext(AppContext);

  return (
    <Route
      {...rest}
      render={(props) =>
        appContext.user ? (
          <Component search={search} {...props} />
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
