import { Link } from 'react-router-dom';
import logo from './images/logo.svg';

/*
 * Just a logo icon
 */
import React from 'react';

export default function IconLogo() {
  return (
    <Link to="/">
      <img
        style={{
          maxWidth: 149,
          maxHeight: 32,
          marginBottom: '-6px',
        }}
        src={logo}
        alt="Greenstand logo"
      />
    </Link>
  );
}
