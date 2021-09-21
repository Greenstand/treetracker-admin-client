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
      name: 'list_grower',
      description: 'Can view growers',
    },
    {
      name: 'manage_planter',
      description: 'Can modify grower information',
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
};

export default policy;
