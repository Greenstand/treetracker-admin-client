@ndm @acceptance_spec @manual
Feature: Session map preview and recorded area
  Acceptance criteria for the domain administration integration.
  Roles and fixtures are defined in README.md.

  @UC-MAP-001 @implemented
  Scenario: Load an outer-area preview on demand
    Given a session has usable segment geometry
    When a user chooses its map icon
    Then an approximate outer envelope is loaded and displayed
    And thousands of individual capture markers and photos are not requested
    And map attribution is visible

  @UC-MAP-002 @implemented
  Scenario: Fall back to valid capture coordinates
    Given a session has no usable segment geometry but has valid capture coordinates
    When its map is requested
    Then the preview uses a derived outer envelope
    And a point or line is supported when too few distinct locations form a polygon

  @UC-MAP-003 @implemented
  Scenario: Distinguish area measurement from the map envelope
    Given a session has recorded segment polygons
    When its area is displayed
    Then the area is calculated from the recorded polygons in square metres and acres
    And it is not labelled as the convex-envelope area or verified planted acreage

  @UC-MAP-004 @implemented
  Scenario: Handle missing geometry and failed basemap tiles
    Given geometry or background map tiles are unavailable
    When the user opens a session preview
    Then an explicit unavailable message is displayed
    And missing area is not replaced with zero or an invented boundary

  @UC-MAP-005 @implemented
  Scenario: Enforce map organization ownership and dispose a closed map
    Given a session belongs to Organization B
    When an Organization A member requests its map directly
    Then the request is refused
    And closing an authorized map releases the map instance without background prefetching
