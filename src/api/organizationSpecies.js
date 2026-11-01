'use strict';
const { OrganizationSpecies } = require('../models');
// Fetch all organization-species relationships or filter byr organziation/species
exports.getOrganizationSpecies = async (req, res) => {
  try {
    const { organizationId, speciesId } = req.query;
    const filter = {};
    if (organizationId) filter.organizationId = organizationId;
    if (speciesId) filter.speciesId = speciesId;
    return res.status (200).json({ sucess: true, filter });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
