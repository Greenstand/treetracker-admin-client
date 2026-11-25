import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CountrySelect from './CountrySelect';

function renderSelect(props) {
  return render(
    <CountrySelect
      id="organization-location"
      name="location"
      label="Country"
      value=""
      onChange={() => {}}
      {...props}
    />
  );
}

describe('CountrySelect', () => {
  it('reports the picked country as a form-style change event', async () => {
    const onChange = jest.fn();
    renderSelect({ onChange });

    await userEvent.type(screen.getByLabelText(/country/i), 'Sierra Leo');
    await userEvent.click(await screen.findByText('Sierra Leone'));

    expect(onChange).toHaveBeenCalledWith({
      target: { name: 'location', value: 'Sierra Leone' },
    });
  });

  it('keeps a stored value that is not one of the listed countries', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    renderSelect({ value: 'Freetown' });

    expect(screen.getByLabelText(/country/i)).toHaveValue('Freetown');
    expect(warn).not.toHaveBeenCalled();

    warn.mockRestore();
  });
});
