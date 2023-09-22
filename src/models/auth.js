const PERMISSIONS = {
  ADMIN: 1,
  TREE_AUDIT: 2,
  GROWER: 3,
};

const POLICIES = {
  SUPER_PERMISSION: 'super_permission',
  MANAGE_EARNINGS: 'manage_earnings',
  MANAGE_GROWER: 'manage_planters',
  MANAGE_PAYMENTS: 'manage_payments',
  MANAGE_REGIONS: 'manage_regions',
  MANAGE_STAKEHOLDERS: 'manage_stakeholders',
  MANAGER_USER: 'manager_users',
  LIST_EARNINGS: 'list_earnings',
  LIST_GROWER: 'list_planter',
  LIST_PAYMENTS: 'list_payments',
  LIST_REGIONS: 'list_regions',
  LIST_STAKEHOLDERS: 'list_stakeholders',
  LIST_TREE: 'list_trees',
  LIST_USER: 'list_users',
  APPROVE_TREE: 'approve_trees',
  SEND_MESSAGES: 'send_messages',
  MATCH_CAPTURES: 'match_captures',
};

function hasPermission(user, p) {
  // Chris github - BirdTho 9/21 user may fail if called when logged out, as in the case in Context.js
  // console.log('hasPermission', user.policies, p);
  if (!user) return false;
  if (p instanceof Array) {
    return p.some((permission) => {
      return user.policies.some((r) => r === permission);
    });
  } else {
    return user.policies.some((r) => r === p) ? true : false;
  }
}

function hasFreetownPermission(user) {
  if (!user) return false;
  // // super admin has freetown permission
  // if(hasPermssion(user, POLICIES.SUPER_PERMISSION)) return true;
  if (user.policy?.organization?.name?.toLowerCase() === 'freetown')
    return true;
  return false;
}

/*
 * to save the token
 */
const session = () => {
  let token = localStorage.getItem('token') || '';

  return {
    token,
  };
};

export { PERMISSIONS, POLICIES, hasPermission, hasFreetownPermission, session };
