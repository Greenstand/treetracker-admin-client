import React from 'react';
import isEqual from 'react-fast-compare';

import Verify from './Verify';
import Planters from './Planters';
import Captures from './Captures';
import Account from './Account';
import Home from './Home';
import Users from './Users';
import SpeciesMgt from './SpeciesMgt';
import CaptureMatchingFrame from './CaptureMatching/CaptureMatchingFrame';

import IconSettings from '@material-ui/icons/Settings';
import IconShowChart from '@material-ui/icons/ShowChart';
import IconThumbsUpDown from '@material-ui/icons/ThumbsUpDown';
import IconNature from '@material-ui/icons/Nature';
import IconNaturePeople from '@material-ui/icons/NaturePeople';
import IconGroup from '@material-ui/icons/Group';
import IconCompareArrows from '@material-ui/icons/CompareArrows';
import IconPermIdentity from '@material-ui/icons/PermIdentity';
import CategoryIcon from '@material-ui/icons/Category';
import HomeIcon from '@material-ui/icons/Home';
import CompareIcon from '@material-ui/icons/Compare';

import { session, hasPermission, POLICIES } from '../models/auth';
import axios from 'axios';
import Unauthorized from './Unauthorized';

export const AppContext = React.createContext({});

function getRoutes(user) {
  return [
    {
      name: 'Home',
      linkTo: '/',
      exact: true,
      component: Home,
      icon: HomeIcon,
      disabled: false,
    },
    {
      name: 'Monitor',
      linkTo: '/monitor',
      icon: IconShowChart,
      disabled: true,
    },
    {
      name: 'Verify',
      linkTo: '/verify',
      component: Verify,
      icon: IconThumbsUpDown,
      disabled: !hasPermission(user, [
        POLICIES.SUPER_PERMISSION,
        POLICIES.LIST_TREE,
        POLICIES.APPROVE_TREE,
      ]),
    },
    {
      name: 'Captures',
      linkTo: '/captures',
      component: Captures,
      icon: IconNature,
      disabled: !hasPermission(user, [
        POLICIES.SUPER_PERMISSION,
        POLICIES.LIST_TREE,
      ]),
    },
    {
      name: 'Capture Matching',
      linkTo: '/capture-matching',
      component: CaptureMatchingFrame,
      icon: CompareIcon,
      disabled:
        process.env.REACT_APP_ENABLE_CAPTURE_MATCHING !== 'true' ||
        !hasPermission(user, [
          POLICIES.SUPER_PERMISSION,
          POLICIES.APPROVE_TREE,
        ]),
    },
    {
      name: 'Planters',
      linkTo: '/planters',
      component: Planters,
      icon: IconNaturePeople,
      disabled: !hasPermission(user, [
        POLICIES.SUPER_PERMISSION,
        POLICIES.LIST_PLANTER,
      ]),
    },
    {
      name: 'Payments',
      linkTo: '/payments',
      icon: IconCompareArrows,
      disabled: true,
    },
    {
      name: 'Species',
      linkTo: '/species',
      component: SpeciesMgt,
      icon: CategoryIcon,
      //TODO this is temporary, need to add species policy
      disabled:
        !hasPermission(user, [POLICIES.SUPER_PERMISSION, POLICIES.LIST_TREE]) ||
        !user ||
        user.policy.organization !== undefined,
    },
    {
      name: 'Settings',
      linkTo: '/settings',
      component: Unauthorized,
      icon: IconSettings,
      disabled: true,
    },
    {
      name: 'User Manager',
      linkTo: '/user-manager',
      component: Users,
      icon: IconGroup,
      disabled: !hasPermission(user, [POLICIES.SUPER_PERMISSION]),
    },
    {
      name: 'Account',
      linkTo: '/account',
      component: Account,
      icon: IconPermIdentity,
      disabled: false,
    },
  ];
}

export const AppProvider = (props) => {
  const localUser = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = React.useState(undefined);
  const [token, setToken] = React.useState(undefined);
  const [routes, setRoutes] = React.useState(getRoutes(localUser));

  function checkSession() {
    const localToken = JSON.parse(localStorage.getItem('token'));
    const localUser = JSON.parse(localStorage.getItem('user'));
    if (localToken && localUser) {
      // Temporarily log in with the localStorage credentials while
      // we check that the session is still valid
      context.login(localUser, localToken);

      axios
        .get(
          `${process.env.REACT_APP_API_ROOT}/auth/check_session?id=${localUser.id}`,
          {
            headers: { Authorization: localToken },
          },
        )
        .then((response) => {
          // console.log('CONTEXT CHECK SESSION', response.data, 'USER', localUser, 'TOKEN', localToken);
          if (response.status === 200) {
            if (response.data.token === undefined) {
              //the role has not changed
              context.login(localUser, localToken, true);
            } else {
              //role has changed, update the token
              context.login(localUser, response.data.token, true);
            }
          } else {
            context.logout();
          }
        });
      return true;
    }
    return false;
  }

  const context = {
    login: (newUser, newToken, rememberDetails) => {
      // This api gets hit with identical users from multiple login calls
      if (!isEqual(session.user, newUser)) {
        setUser(newUser);
        session.user = newUser;
        if (rememberDetails) {
          localStorage.setItem('user', JSON.stringify(newUser));
        }

        // By not updating routes object, we can memoize the menu and routes better
        setRoutes(getRoutes(newUser));
      }

      if (session.token !== newToken) {
        session.token = newToken;
        setToken(newToken);

        if (rememberDetails) {
          localStorage.setItem('token', JSON.stringify(newToken));
        }
      }
    },
    logout: () => {
      setUser(undefined);
      setToken(undefined);
      setRoutes(getRoutes(undefined));
      session.token = undefined;
      session.user = undefined;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    user,
    token,
    routes,
  };

  if (!user || !token) {
    checkSession();
  }

  return (
    <AppContext.Provider value={context}>{props.children}</AppContext.Provider>
  );
};
