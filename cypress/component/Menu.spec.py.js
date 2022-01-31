import Menu from '../../src/components/common/Menu';
import { mount } from 'cypress-react-unit-test';
import React from 'react';

describe('Menu', () => {
  it('Menu', () => {
    mount(<Menu />);
  });

  it('Menu plain', () => {
    mount(<Menu variant="plain" />);
  });
});
