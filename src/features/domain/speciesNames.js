export function suggestHerbariumName(latinName = '') {
  const match = String(latinName).match(
    /^\s*([A-Za-z]{4,})\s+([A-Za-z]{4,})\b/
  );
  return match
    ? (match[1].slice(0, 4) + match[2].slice(0, 4)).toUpperCase()
    : '';
}
export function speciesLabel(species = {}) {
  return (
    [species.herbarium_name, species.scientific_name]
      .filter(Boolean)
      .join(' · ') ||
    species.legacy_catalogue_name ||
    species.common_name ||
    'Unnamed species'
  );
}
