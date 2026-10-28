/**
* Model representing the relationship between and Organization and a Species.
*/
class OrganizationSpecies {
  constructor(data = {}) {
    this.id = data.id || null;
    this.organizationId = data.organization_id || data.organizationId || null;
    this.speciesId = data.species_id || data.speciesId || null;
    this.createdAt = data.created_at || data.createdAt || null;
    this.updatedAt = data.updated_at || data.updatedAt || null;
  }
  /**
  * Formats the model data for API requests.
  */
toJSON() {
  return {
    organization_id: this.organizationId,
    species_id: this.speciesId,
  };
  ule.exports = OrganizationSpecies;
