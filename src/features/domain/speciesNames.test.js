import { speciesLabel, suggestHerbariumName } from './speciesNames';

test('suggests an eight-letter name from genus and species', () => {
  expect(suggestHerbariumName('Acrocarpus fraxinifolius Arn.')).toBe(
    'ACROFRAX'
  );
});
test('does not invent padded names for incomplete botanical identities', () => {
  expect(suggestHerbariumName('GRASSES')).toBe('');
  expect(suggestHerbariumName('Poa annua')).toBe('');
});
test('displays the independent code and Latin name', () => {
  expect(
    speciesLabel({
      herbarium_name: 'ACACTORT',
      scientific_name: 'Vachellia tortilis',
    })
  ).toBe('ACACTORT · Vachellia tortilis');
  expect(speciesLabel({ legacy_catalogue_name: 'GRASSES' })).toBe('GRASSES');
});
