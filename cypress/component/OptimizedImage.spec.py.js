/* eslint-disable */
import { mount } from 'cypress-react-unit-test';
import React from 'react';
import theme from './common/theme';
import { ThemeProvider } from '@material-ui/core/styles';

import OptimizedImage from './OptimizedImage';

describe('OptimizedImage', () => {
  it('works', () => {
    mount(
      <ThemeProvider theme={theme}>
        <OptimizedImage />
      </ThemeProvider>,
    );
    cy.get('img').should('not.exist');
  });

  describe('with simple url', () => {
    beforeEach(() => {
      const imageUrl =
        'https://treetracker-dev-images.s3.eu-central-1.amazonaws.com/2021.06.23.15.23.51_47.48273455542277_-122.00591739278472_31DD93F7-9065-49F8-9087-318BDD157257_39189BAB-CCD2-4C47-B139-0E37013792FF.jpg';

      mount(
        <ThemeProvider theme={theme}>
          <OptimizedImage src={imageUrl} />
        </ThemeProvider>,
      );
    });

    it('should display the image', () => {
      cy.get(`img`)
        .should('be.visible')
        .and(($img) => {
          // "naturalWidth" and "naturalHeight" are set when the image loads
          expect($img[0].naturalWidth).to.be.greaterThan(0);
          expect($img[0].src).to.contain('cdn.statically.io');
        });
    });

    it('should display the image served by statically', () => {
      cy.get(`img`).and(($img) => {
        expect($img[0].src).to.contain('cdn.statically.io');
      });
    });
  });

  describe('with complex url', () => {
    beforeEach(() => {
      const imageUrl =
        'https://greenstand.org/fileadmin/_processed_/d/4/csm_little_Jony_ca31f27bd1.jpg';

      mount(
        <ThemeProvider theme={theme}>
          <OptimizedImage src={imageUrl} />
        </ThemeProvider>,
      );
    });

    it('should display the image', () => {
      cy.get(`img`)
        .should('be.visible')
        .and(($img) => {
          // "naturalWidth" and "naturalHeight" are set when the image loads
          expect($img[0].naturalWidth).to.be.greaterThan(0);
        });
    });

    it('should display the image served by statically', () => {
      cy.get(`img`).and(($img) => {
        expect($img[0].src).to.contain('cdn.statically.io');
      });
    });
  });
});
