import { Link } from 'react-router-dom';
import logo from './images/logo.svg';
import { AppContext } from '../context/AppContext';
import { React, useContext } from 'react';

/*
 * Just a logo icon
 */

export default function IconLogo() {
  const appContext = useContext(AppContext);
  const { logoURL } = appContext;

  return (
    <Link to="/">
      <img
        style={{
          maxWidth: 149,
          maxHeight: 32,
          marginBottom: '-6px',
        }}
        src={logoURL}
        alt={logoURL === logo ? 'greenstand logo' : 'organization logo'}
      />
    </Link>
  );
}
