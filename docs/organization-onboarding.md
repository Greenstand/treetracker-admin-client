# Organization On-boarding Feature

## Overview 

Normal user --> Apply for organization --> no approval needed (for the time being) --> user becomes organization owner --> user can verify trees 


## Application Form / Organization Attributes

Please also refer to table `entity` in DB.

- Name (required)
- Email (required)
- Phone number (optional)
- Website (optional)
- Logo Url (optional)
- Map Name (optional)

The sequence:

![Organization Application Flow](./images/apply-org.png)

The API need to post the organization id and request new role for the user, the role spec for now:

- treetracker: normal user, default role for all user
- organization: organization owner, can verify trees, manage organization info.


After the application, user become organization, so they can see the menu and doing the verifying, NOTE, the API need to verify the JWT token bring by the user, and check if the user has the organization role, if not, return 403 forbidden.

The sequence for verifying trees:

![Organization Verify Tree Flow](./images/Verify-tree.png)

