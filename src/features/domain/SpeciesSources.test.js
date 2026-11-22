import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SpeciesSources, { speciesSources } from './SpeciesSources';

test('deduplicates references and distinguishes exact Herbarium host from external hosts', () => {
  expect(
    speciesSources({
      reference_url: 'https://en.wikipedia.org/wiki/Cedar',
      description:
        'https://herbarium.treetracker.org/guide/ACROFRAX.html https://en.wikipedia.org/wiki/Cedar https://herbarium.treetracker.org.example.com/page',
    }).map((source) => source.herbarium)
  ).toEqual([true, false, false]);
  expect(speciesSources({ reference_url: 'javascript:alert(1)' })).toEqual([]);
  expect(
    speciesSources({ reference_url: 'https://user:secret@example.com' })
  ).toEqual([]);
});

test('source links open separately without opening the species editor', () => {
  const onRow = jest.fn();
  render(
    <div onClick={onRow}>
      <SpeciesSources
        species={{
          scientific_name: 'ACROFRAX (Pink Cedar)',
          description: 'https://herbarium.treetracker.org/guide/ACROFRAX.html',
          reference_url: 'https://en.wikipedia.org/wiki/Cedar',
        }}
      />
    </div>
  );
  const links = screen.getAllByRole('link');
  expect(links).toHaveLength(2);
  expect(screen.getByAltText('Greenstand')).toBeInTheDocument();
  expect(links[0]).toHaveAttribute('target', '_blank');
  fireEvent.click(links[0]);
  expect(onRow).not.toHaveBeenCalled();
});
