import React from 'react';
import Icon from '@material-ui/core/Icon';
import paymentsIcon from './payments.svg';
/**
 * @function
 * @name paymentsIcon
 * @description material ui custom icon for payments menu item
 * @returns {React.Component}
 */
function PaymentsIcon() {
  return (
    <Icon>
      <img alt="Payments" width={16} src={paymentsIcon} />
    </Icon>
  );
}

export default PaymentsIcon;
