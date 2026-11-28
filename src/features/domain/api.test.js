jest.mock('../../api/httpClient', () => ({ authAxios: jest.fn() }));
const previous = process.env.NODE_ENV;
afterEach(() => {
  process.env.NODE_ENV = previous;
  delete global.fetch;
});
it('uses a loopback runtime API override in local development', async () => {
  jest.resetModules();
  process.env.NODE_ENV = 'development';
  global.fetch = jest
    .fn()
    .mockResolvedValue({
      ok: true,
      json: async () => ({ domainApiRoot: 'http://127.0.0.1:3005' }),
    });
  const { domainRequest } = require('./api');
  const client = require('../../api/httpClient').authAxios;
  client.mockResolvedValue({ data: { ok: true } });
  await domainRequest('/context');
  expect(client).toHaveBeenCalledWith(
    expect.objectContaining({
      url: 'http://127.0.0.1:3005/api/admin-domain/context',
    })
  );
});
it('does not read per-machine routing in production', async () => {
  jest.resetModules();
  process.env.NODE_ENV = 'production';
  process.env.REACT_APP_DOMAIN_API_ROOT = 'https://api.example.org';
  global.fetch = jest.fn();
  const { domainRequest } = require('./api');
  const client = require('../../api/httpClient').authAxios;
  client.mockResolvedValue({ data: {} });
  await domainRequest('/context');
  expect(global.fetch).not.toHaveBeenCalled();
  expect(client).toHaveBeenCalledWith(
    expect.objectContaining({
      url: 'https://api.example.org/api/admin-domain/context',
    })
  );
  delete process.env.REACT_APP_DOMAIN_API_ROOT;
});
