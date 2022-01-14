import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from 'components/Login';

describe('Login Page', () => {
  describe('Layout', () => {
    it('has "Greenstand" logo', () => {
      const { container } = render(<Login />, { wrapper: MemoryRouter });
      const logo = screen.queryByAltText('Greenstand logo');
      expect(logo).toBeInTheDocument();
    });
    it('has "Admin Panel" header', () => {
      const { container } = render(<Login />, { wrapper: MemoryRouter });
      console.log(container.querySelector('div > h2').innerHTML);
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
});
