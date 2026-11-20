import { getRoutes } from './AppContext';

function growersRoute(user) {
  return getRoutes(user).find((route) => route.name === 'Growers');
}

describe('Growers route access', () => {
  it('is enabled for an organization user', () => {
    const user = {
      policy: { policies: [{ name: 'org' }], organization: { id: 178 } },
    };

    expect(growersRoute(user).disabled).toBe(false);
  });

  it('is enabled for a greenstand admin', () => {
    const user = { policy: { policies: [{ name: 'greenstand-admin' }] } };

    expect(growersRoute(user).disabled).toBe(false);
  });

  it('stays disabled for a user with no accepted role', () => {
    const user = { policy: { policies: [] } };

    expect(growersRoute(user).disabled).toBe(true);
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

describe('Domain view permissions', () => {
  const organization = {
    policy: { policies: [{ name: 'org' }], organization: { id: 3414 } },
  };
  const platform = { policy: { policies: [{ name: 'greenstand-admin' }] } };
  it('offers projects, sessions, contracts and organization species to org members', () => {
    const routes = getRoutes(organization);
    for (const path of [
      '/projects',
      '/tracking-sessions',
      '/contracts',
      '/organization-species',
    ]) {
      expect(routes.find((route) => route.linkTo === path).disabled).toBe(
        false
      );
    }
  });
  it('keeps SaaS routes disabled for organization members and enabled for platform admins', () => {
    expect(
      getRoutes(organization).find((route) => route.name === 'SaaS').disabled
    ).toBe(true);
    const saas = getRoutes(platform).find((route) => route.name === 'SaaS');
    expect(saas.disabled).toBe(false);
    expect(saas.children.every((route) => !route.disabled)).toBe(true);
  });
  it('keeps domain organization routes disabled for unrelated users', () => {
    const routes = getRoutes({ policy: { policies: [{ name: 'planter' }] } });
    expect(routes.find((route) => route.linkTo === '/projects').disabled).toBe(
      true
    );
  });
});
