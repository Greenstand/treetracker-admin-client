import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from 'components/Login';
import * as loglevel from 'loglevel';

const log = loglevel.getLogger('../tests/Login.test.js');

describe('Login Page', () => {
  describe('Layout', () => {
    it('has "Greenstand" logo', () => {
      const { container } = render(<Login />, { wrapper: MemoryRouter });
      const logo = screen.queryByAltText('Greenstand logo');
      expect(logo).toBeInTheDocument();
    });
    it('has "Admin Panel" header', () => {
      const { container } = render(<Login />, { wrapper: MemoryRouter });
      log.debug(container.querySelector('div > h2').innerHTML);
      const header = screen.queryByRole('heading', { name: 'Admin Panel' });
      expect(header).toBeInTheDocument();
    });
    it('has username input', () => {
      render(<Login />, { wrapper: MemoryRouter });
      const emailInput = screen.queryByLabelText(/username/i);
      expect(emailInput).toBeInTheDocument();
    });
    it('has password input', () => {
      render(<Login />, { wrapper: MemoryRouter });
      const passwordInput = screen.queryByLabelText(/password/i);
      expect(passwordInput).toBeInTheDocument();
    });
    it('has "Remember me" checkbox', () => {
      render(<Login />, { wrapper: MemoryRouter });
      const checkbox = screen.queryByRole('checkbox', { name: 'Remember me' });
      expect(checkbox).toBeInTheDocument();
    });
    it('has "LOG IN" button', () => {
      render(<Login />, { wrapper: MemoryRouter });
      const loginButton = screen.queryByRole('button', { name: 'LOG IN' });
      expect(loginButton).toBeInTheDocument();
    });
  });
  describe('Interactions', () => {
    it('keeps the "LOG IN" button disabled until one of the input fields is empty', () => {
      render(<Login />, { wrapper: MemoryRouter });
      const emailInput = screen.queryByLabelText(/username/i);
      const passwordInput = screen.queryByLabelText(/password/i);
      const loginButton = screen.queryByRole('button', { name: 'LOG IN' });

      userEvent.type(emailInput, 'admin');
      expect(loginButton).toBeDisabled();
      userEvent.clear(emailInput);

      userEvent.type(passwordInput, 'P4ssword');
      expect(loginButton).toBeDisabled();
      userEvent.clear(passwordInput);

      userEvent.type(emailInput, 'admin');
      userEvent.type(passwordInput, 'P4ssword');
      expect(loginButton).toBeEnabled();
    });
    it('displays spinner after clicking the "LOG IN" button', () => {
      render(<Login />, { wrapper: MemoryRouter });
      const emailInput = screen.queryByLabelText(/username/i);
      const passwordInput = screen.queryByLabelText(/password/i);
      const loginButton = screen.queryByRole('button', { name: 'LOG IN' });

      userEvent.type(emailInput, 'admin');
      userEvent.type(passwordInput, 'P4ssword');
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();

      userEvent.click(loginButton);

      const progressbar = screen.queryByRole('progressbar');
      expect(progressbar).toBeInTheDocument();
    });
  });
});
