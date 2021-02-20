/*
 * Permission policy
 *
 */
const policy = {
  policies: [
    {
      name: 'super_permission',
      description: 'Can do anything',
    },
    {
      name: 'list_tree',
      description: 'Can view trees',
    },
    {
      name: 'approve_tree',
      description: 'Can approve/reject trees',
    },
    {
      name: 'list_planter',
      description: 'Can view planters',
    },
    {
      name: 'manage_planter',
      description: 'Can modify planter information',
    },
    {
      name: 'list_user',
      description: 'Can view admin users',
    },
    {
      name: 'manager_user',
      description: 'Can create/modify admin user',
    },
  ],
}

export default policy
