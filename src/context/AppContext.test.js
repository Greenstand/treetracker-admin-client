import { getRoutes } from './AppContext';

function growersRoute(user) {
  return getRoutes(user).find((route) => route.name === 'Growers');
}

describe('Growers route access', () => {
  it('is enabled for an organization user with no grower policy', () => {
    const user = {
      policy: { policies: [{ name: 'org' }], organization: { id: 178 } },
    };

    expect(growersRoute(user).disabled).toBe(false);
  });

  it('stays disabled for a user with neither a grower policy nor an organization', () => {
    const user = { policy: { policies: [{ name: 'greenstand-admin' }] } };

    expect(growersRoute(user).disabled).toBe(true);
  });

  it('is enabled for a user holding list_planter', () => {
    const user = { policy: { policies: [{ name: 'list_planter' }] } };

    expect(growersRoute(user).disabled).toBe(false);
  });
});

function capturesRoute(user) {
  return getRoutes(user).find((route) => route.name === 'Captures');
}

describe('Captures route access', () => {
  it('is enabled for a greenstand admin', () => {
    const user = { policy: { policies: [{ name: 'greenstand-admin' }] } };

    expect(capturesRoute(user).disabled).toBe(false);
  });

  it('is enabled for an organization user', () => {
    const user = {
      policy: { policies: [{ name: 'org' }], organization: { id: 178 } },
    };

    expect(capturesRoute(user).disabled).toBe(false);
  });

  it('is enabled for a user holding list_tree', () => {
    const user = { policy: { policies: [{ name: 'list_tree' }] } };

    expect(capturesRoute(user).disabled).toBe(false);
  });

  it('stays disabled for a user with no accepted role', () => {
    const user = { policy: { policies: [] } };

    expect(capturesRoute(user).disabled).toBe(true);
  });
});
