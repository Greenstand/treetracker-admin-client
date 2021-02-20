const PERMISSIONS = {
  ADMIN: 1,
  TREE_AUDIT: 2,
  PLANTER: 3,
};

const POLICIES = {
  SUPER_PERMISSION: 'super_permission',
  LIST_USER: 'list_user',
  MANAGER_USER: 'manager_user',
  LIST_TREE: 'list_tree',
  APPROVE_TREE: 'approve_tree',
  LIST_PLANTER: 'list_planter',
  MANAGE_PLANTER: 'manage_planter',
};

function hasPermission(user, p){
  // Chris github - BirdTho 9/21 user may fail if called when logged out, as in the case in Context.js
  // console.assert(user, "Why user fail?", user);
  if(!user) return false;
  if(p instanceof Array){
    return p.some(permission => {
      return user.policy.policies.some(r => r.name === permission);
    });
  }else{
    return user.policy.policies.some(r => r.name === p) ? true : false;
  }
}

/*
 * to save the token
 */
const session = {
}

export {PERMISSIONS, POLICIES, hasPermission, session};
