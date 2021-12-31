import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { useKeycloak } from '@react-keycloak/web';

export default function PrivateRoute({ component: Component, ...rest }) {
  // const appContext = useContext(AppContext);
  // const { keycloak } = useKeycloak();
  // console.log(keycloak);
  return <Route {...rest} render={(props) => <Component {...props} />} />;
  // return (
  //   <Route
  //     {...rest}
  //     render={(props) =>
  //         keycloak.authenticated ? (
  //         <Component {...props} />
  //       ) : (
  //         <Redirect
  //           to={{
  //             pathname: '/',
  //             state: { from: props.location },
  //           }}
  //         />
  //       )
  //     }
  //   />
  // )
}
