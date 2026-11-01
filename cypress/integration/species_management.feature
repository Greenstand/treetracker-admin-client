Scenario: Successfully link organization-specific species data via API routes
Given: the administrator is logged into the admin dashboard 
When: the administrator sends a POST request to the species management API route
And: provides a valid organization ID and species payload
Then: the response status should be 201 Created
And: the database should reflect the newly linked species record
