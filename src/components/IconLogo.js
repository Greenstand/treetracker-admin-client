import { Link } from 'react-router-dom';
import logo from './images/logo.svg';
import { AppContext } from '../context/AppContext';
import { React, useContext, useState } from 'react';

/*
 * Just a logo icon
 */

export default function IconLogo() {
  const appContext = useContext(AppContext);
  const { user } = appContext;
  const [logoURL, setLogoURL] = useState();

  if (user) {
    const STAKEHOLDER_API = process.env.REACT_APP_STAKEHOLDER_API_ROOT;
    const orgID = user.policy.organization.id;
    fetch(`${STAKEHOLDER_API}/stakeholders/${orgID}`)
      .then((response) => response.json())
      .then((data) => console.log(data.stakeholders[0].logo_url));
  }

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
