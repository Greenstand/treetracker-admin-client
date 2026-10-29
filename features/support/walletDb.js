// The wallet API stamps the caller's keycloak_account_id on every wallet it
// creates, so an unbound one has to be written straight to the database.
// Mirrors treetracker-wallet-app (apps/bdd/utils/seed.ts).
const { Client } = require('pg');

const DB_URL = process.env.WALLET_DATABASE_URL;
const DB_SCHEMA = process.env.WALLET_DATABASE_SCHEMA || 'wallet';
// Local Postgres does not offer SSL; enable it only for remote (dev/CI) hosts.
const DB_SSL = /@(localhost|127\.0\.0\.1)[:/]/.test(DB_URL || '')
  ? false
  : { rejectUnauthorized: false };

async function withClient(run) {
  if (!DB_URL) {
    throw new Error(
      'WALLET_DATABASE_URL is not set, so the wallet fixtures cannot be seeded'
    );
  }
  const client = new Client({ connectionString: DB_URL, ssl: DB_SSL });
  await client.connect();
  try {
    await client.query(`SET search_path TO ${DB_SCHEMA}`);
    return await run(client);
  } finally {
    await client.end();
  }
}

// Delete first: wallet names are globally unique, and a crashed run leaves
// this one bound.
async function seedUnboundWallet(name) {
  return withClient(async (client) => {
    await removeWallet(client, name);
    await client.query(
      `INSERT INTO wallet (name, created_at) VALUES ($1, NOW())`,
      [name]
    );
  });
}

async function deleteWallet(name) {
  return withClient((client) => removeWallet(client, name));
}

async function removeWallet(client, name) {
  const { rows } = await client.query('SELECT id FROM wallet WHERE name = $1', [
    name,
  ]);
  if (!rows.length) return;
  await client.query('DELETE FROM wallet_event WHERE wallet_id = $1', [
    rows[0].id,
  ]);
  await client.query('DELETE FROM wallet WHERE id = $1', [rows[0].id]);
}

module.exports = { seedUnboundWallet, deleteWallet };
