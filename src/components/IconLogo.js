import { Link } from 'react-router-dom';
import logo from './images/logo.svg';
import { AppContext } from '../context/AppContext';
import { React, useContext } from 'react';

/*
 * Just a logo icon
 */

export default function IconLogo() {
  const appContext = useContext(AppContext);
  const { logoPath } = appContext;

  function isVisible() {
    if (logoPath === '') {
      return 'hidden';
    } else return 'visible';
  }

  return (
    <Link to="/">
      <img
        style={{
          maxWidth: 149,
          maxHeight: 32,
          marginBottom: '-6px',
          visibility: isVisible(),
        }}
        src={logoPath}
        alt={logoPath === logo ? 'greenstand logo' : 'organization logo'}
      />
    </Link>
  );
}
