'use strict';
const { OrganizationSpecies } = require('../models');
// Fetch all organization-species relationships or filter byr organziation/species
exports.getOrganizationSpecies = async (req, res) => {
  try {
    const { organizationId, speciesId } = req.query;
    const filter = {};
    if (orgnanizationId) filter.organizationId = organizationId;
    if (speciesId) filet
