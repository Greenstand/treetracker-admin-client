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

  // Hide logo if the logo URL hasn't been loaded or if the Greenstand logo is loaded
  // and the user has an organization
  function isVisible() {
    if (!user) {
      return 'visible';
    }
    if (logoPath === '') {
      return 'hidden';
    } else return 'visible';
  }

  // Logo styling objects for both org and Greenstand logos to be applied to img
  const greenstandLogoStyle = {
    maxWidth: 149,
    maxHeight: 32,
    marginBottom: '-6px',
    visibility: isVisible(),
  };

  const orgLogoStyle = {
    maxHeight: 50,
    marginBottom: '-15px',
    visibility: isVisible(),
  };

  return (
    <Link to="/">
      <img
        style={logoPath === logo ? greenstandLogoStyle : orgLogoStyle}
        src={logoPath}
        alt={logoPath === logo ? 'greenstand logo' : 'organization logo'}
      />
    </Link>
  );
}
