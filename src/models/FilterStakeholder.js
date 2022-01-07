export const ALL_ORGANIZATIONS = 'ALL_ORGANIZATIONS';
export const ORGANIZATION_NOT_SET = 'ORGANIZATION_NOT_SET';

export default class FilterStakeholder {
  constructor(options) {
    Object.assign(this, options);
  }

  /*
   * A fn to count the number of current applied filters
   */
  countAppliedFilters() {
    let numFilters = 0;

    if (this.id) {
      numFilters += 1;
    }

    if (this.type) {
      numFilters += 1;
    }

    if (this.org_name) {
      numFilters += 1;
    }

    if (this.first_name) {
      numFilters += 1;
    }

    if (this.last_name) {
      numFilters += 1;
    }

    if (this.image_url) {
      numFilters += 1;
    }

    if (this.email) {
      numFilters += 1;
    }

    if (this.phone) {
      numFilters += 1;
    }

    if (this.website) {
      numFilters += 1;
    }

    if (this.logo_url) {
      numFilters += 1;
    }

    if (this.map) {
      numFilters += 1;
    }

    if (this.id && this.id !== ALL_ORGANIZATIONS) {
      numFilters += 1;
    }

    if (this.owner_id) {
      numFilters += 1;
    }

    return numFilters;
  }
}
