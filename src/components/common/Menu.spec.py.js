import Menu from './Menu';
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
