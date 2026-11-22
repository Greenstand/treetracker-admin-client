/* Validates acceptance specifications. It does not execute UI/API steps. */
const fs = require('fs');
const path = require('path');
const { generateMessages } = require('@cucumber/gherkin');
const { IdGenerator, SourceMediaType } = require('@cucumber/messages');
const root = path.resolve(__dirname, '..');
const directory = path.join(root, 'features/domain');
const manifest = JSON.parse(fs.readFileSync(path.join(directory, 'manifest.json'), 'utf8'));
const statuses = ['@implemented', '@pending', '@legacy_contract'];
const ids = new Set();
let scenarios = 0, examples = 0;
const counts = Object.fromEntries(statuses.map(status => [status.slice(1), 0]));
const failures = [];
const files = fs.readdirSync(directory).filter(file => file.endsWith('.feature')).sort();
if (files.length !== manifest.features.length) failures.push('Manifest and feature-file counts differ');
for (const item of manifest.features) {
  const filename = path.join(directory, item.file);
  if (!files.includes(item.file)) { failures.push('Missing feature: ' + item.file); continue; }
  const source = fs.readFileSync(filename, 'utf8');
  const envelopes = generateMessages(source, item.file, SourceMediaType.TEXT_X_CUCUMBER_GHERKIN_PLAIN, {
    includeGherkinDocument: true, includePickles: true, newId: IdGenerator.incrementing(),
  });
  for (const envelope of envelopes) if (envelope.parseError) failures.push(item.file + ': ' + envelope.parseError.message);
  const feature = envelopes.find(envelope => envelope.gherkinDocument)?.gherkinDocument.feature;
  if (!feature) { failures.push('No parsed feature: ' + item.file); continue; }
  if (!feature.tags.some(tag => tag.name === '@acceptance_spec')) failures.push('Missing acceptance-spec safety tag: ' + item.file);
  const children = feature.children.flatMap(child => child.rule ? child.rule.children : [child]);
  for (const child of children) {
    const scenario = child.scenario;
    if (!scenario) continue;
    scenarios++;
    const tagNames = scenario.tags.map(tag => tag.name);
    const scenarioIds = tagNames.filter(tag => /^@UC-[A-Z]+-\d{3}$/.test(tag));
    const selected = tagNames.filter(tag => statuses.includes(tag));
    if (scenarioIds.length !== 1) failures.push(item.file + ': scenario needs one stable use-case ID: ' + scenario.name);
    for (const id of scenarioIds) { if (ids.has(id)) failures.push('Duplicate use-case ID: ' + id); ids.add(id); }
    if (selected.length !== 1) failures.push(item.file + ': scenario needs exactly one delivery status: ' + scenario.name);
    else counts[selected[0].slice(1)]++;
    if (!scenario.steps.length || !scenario.steps.some(step => step.keyword.trim() === 'Then')) failures.push('Missing outcome: ' + scenario.name);
    const placeholders = [...new Set(JSON.stringify(scenario.steps).match(/<([^<>]+)>/g) || [])].map(value => value.slice(1, -1));
    for (const table of scenario.examples) {
      const headers = table.tableHeader?.cells.map(cell => cell.value) || [];
      for (const name of placeholders) if (!headers.includes(name)) failures.push('Missing example value ' + name + ': ' + scenario.name);
      for (const row of table.tableBody) if (row.cells.length !== headers.length) failures.push('Unbalanced example row: ' + scenario.name);
    }
    if (placeholders.length && !scenario.examples.length) failures.push('Unbound outline values: ' + scenario.name);
  }
  examples += envelopes.filter(envelope => envelope.pickle).length;
  for (const reference of [...item.sources, ...item.tests]) {
    if (reference.startsWith('api:')) continue;
    if (!fs.existsSync(path.join(root, reference))) failures.push('Broken repository reference: ' + reference);
  }
}
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log(JSON.stringify({ features: files.length, scenarios, expandedCases: examples, statuses: counts, validation: 'Gherkin syntax, IDs, status, examples and local traceability references only; no browser/API scenarios executed' }, null, 2));
