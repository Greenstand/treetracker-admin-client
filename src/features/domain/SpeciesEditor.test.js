import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SpeciesEditor } from './Species';
import { domainRequest } from './api';
jest.mock('./api', () => ({ domainRequest: jest.fn(), errorMessage: String }));
test('Latin edits keep the historical code until a suggestion is explicitly chosen', () => {
  render(
    <SpeciesEditor
      species={{
        id: 'species',
        herbarium_name: 'ACACTORT',
        scientific_name: 'Acacia tortilis',
      }}
      onClose={() => {}}
      onSaved={() => {}}
    />
  );
  fireEvent.change(screen.getByLabelText('Latin name'), {
    target: { value: 'Vachellia tortilis' },
  });
  expect(screen.getByLabelText('Herbarium name').value).toBe('ACACTORT');
  fireEvent.click(
    screen.getByRole('button', { name: 'Use suggested name VACHTORT' })
  );
  expect(screen.getByLabelText('Herbarium name').value).toBe('VACHTORT');
  expect(domainRequest).not.toHaveBeenCalled();
});
