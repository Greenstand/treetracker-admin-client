import { Link } from 'react-router-dom';
import logo from './images/logo.svg';
import { AppContext } from '../context/AppContext';
import { React, useContext } from 'react';

/*
 * Just a logo icon
 */

export default function IconLogo() {
  const appContext = useContext(AppContext);
  const { logoPath, user } = appContext;

  function isVisible() {
    if (!user) {
      return 'visible';
    }
    if (logoPath === '' || (logoPath === logo && user.policy.organization)) {
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
