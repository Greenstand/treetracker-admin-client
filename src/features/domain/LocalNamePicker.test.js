import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LocalNamePicker from './LocalNamePicker';

test('adds a trimmed scoped local name using a separate inline control', () => {
  const onAdd = jest.fn();
  render(
    <LocalNamePicker
      species={{ scientific_name: 'Fixture' }}
      value=""
      names={['Cedar']}
      onChange={jest.fn()}
      onAdd={onAdd}
    />
  );
  fireEvent.click(screen.getByRole('button', { name: /Add local name/i }));
  fireEvent.change(screen.getByLabelText('New local name'), {
    target: { value: '  Mkuyu  ' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Add', exact: true }));
  expect(onAdd).toHaveBeenCalledWith('Mkuyu');
  expect(screen.queryByLabelText('New local name')).not.toBeInTheDocument();
});

test('does not permit adding a name to an unselected or unauthorized species', () => {
  render(
    <LocalNamePicker
      disabled
      species={{ scientific_name: 'Fixture' }}
      value=""
      names={[]}
      onChange={jest.fn()}
      onAdd={jest.fn()}
    />
  );
  expect(
    screen.getByRole('button', { name: /Add local name/i })
  ).toBeDisabled();
});
