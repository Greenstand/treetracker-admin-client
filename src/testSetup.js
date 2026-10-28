/*
 * run before all tests
 */

import '@testing-library/jest-dom';
import * as loglevel from 'loglevel';

loglevel.setDefaultLevel('trace');

// jsdom does not implement it; tests that need it spy on this.
window.HTMLElement.prototype.scrollIntoView = () => {};
