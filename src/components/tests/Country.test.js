import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Country from '../common/Country';
import { publicAxios } from '../../api/httpClient';

jest.mock('../../api/httpClient', () => ({
  publicAxios: {
    get: jest.fn(),
  },
}));

describe('Country component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'count').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
    console.count.mockRestore();
  });

  it('renders country name on success', async () => {
    publicAxios.get.mockResolvedValue({
      data: {
        countries: [{ name: 'Kenya' }],
      },
    });

    render(<Country lat={-1.2} lon={36.8} />);

    await waitFor(() => {
      expect(screen.getByText('Kenya')).toBeInTheDocument();
    });
  });

  it('renders 404 message when country not found', async () => {
    publicAxios.get.mockRejectedValue({
      response: {
        status: 404,
      },
    });

    render(<Country lat={1} lon={1} />);

    await waitFor(() => {
      expect(
        screen.getByText(/can not find country at lat:1, lon:1/i)
      ).toBeInTheDocument();
    });
  });
});
