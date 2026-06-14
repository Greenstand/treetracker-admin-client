import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
export default function PrivateRoute({ component: Component, ...rest }) {
  const appContext = useContext(AppContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (appContext.user) return <Component {...props} />;
        return (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
        );
      }}
    />
  );
}
