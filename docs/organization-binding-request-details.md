# Organization binding request details

Extend the existing Platform Admin queue in [OrganizationBindingRequests](../src/components/OrganizationBindingRequests.js). The [client API module](../src/api/organizationBinding.js) already submits requests, loads the current user's request, lists pending requests with pagination, and approves or rejects a request by user ID. Approval and rejection should keep using those endpoints and the existing Keycloak authorization flow.

## Fields in the admin queue

The existing screen uses `userId`, `username`, and `organizationId`. Keep those fields compatible with existing clients. Add optional fields to the list response after confirming their sources with the Keycloak Admin service owner.

| Proposed response field | Source and display |
| --- | --- |
| `phoneNumber` | Use the verified account phone when available. Show it first. |
| `email` | Use the verified account email when available. Show it when a verified phone is absent. With neither contact, fall back to username or user ID. |
| `displayName` | Use the account profile name when available. |
| `reportedLocation` | Optional locality reported when the request is submitted. Show “Not provided” when absent. |
| `requestedAt` | Server-recorded submission timestamp in UTC. Show “Unknown” for older requests with no timestamp. |

Resolve the organization from its ID using the existing organization lookup. Show the available requester details and target organization in the confirmation dialog. An ID that the service cannot resolve should prevent approval. Missing display fields should leave the request actionable.

## Persistence and migration

The owning service's storage model and live response payload still need verification. Inspect its request storage, Keycloak account attributes, and approval transaction in dev before creating a migration. The legacy Treetracker database has not been verified as the store for this workflow.

- If the service can read verified contact and display name from Keycloak at review time, expose those through the admin response. No request-store migration is needed for those fields.
- If request storage lacks the submission metadata, add nullable location and timestamp fields in that store. Record the timestamp server-side for new requests. Keep older values null unless an authoritative source is available.
- If the service retains decisions, use that source for admin history. If it only retains pending requests and history is required, add a decision record with request identity, outcome, reviewer ID, and decision time in the owning service. Keep retries safe and record approval only once the membership update has succeeded. If request and membership share a database transaction, commit them together. If membership changes in Keycloak and history is stored separately, verify the service's retry and reconciliation behavior before rollout.
- Roll out additive response fields first, then deploy the client. An older client should still be able to use the existing fields and decision endpoints.

## Dev verification

1. Submit requests from test accounts with a phone, with an email, and with neither contact exposed to the queue. Include samples with and without reported location.
2. Confirm that a Platform Admin can review the requests and a regular organization user cannot access the list or decision endpoints.
3. Approve and reject separate test requests. Verify that approval creates the intended membership, rejection leaves membership as it was, and repeated approval cannot create a duplicate.
4. Use an isolated database for migration and integration tests that reset data.
