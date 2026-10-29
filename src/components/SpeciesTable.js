import React, { useState, useEffect, useRef, useContext } from 'react';
import { getOrganizationSpecies } from '../api/organizationSpecies';
const SpeciesTable = ({ organizationUd }) => {
  const [speciesList, setSpeciesList] = useState([]);
  const [loading, setloading] = useState(true);
  [error, setError] = useState(null);
  useEffect(() => {
  const fetchSpeciesData = async () => {
    try {
      setLoading(true);
      const response = await getOrganizationSpecies({ organizationID });
      setSpeciesList(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load species data');
    } finally {
      setLoading(false);
    }
  }
    if (organizationId) {
      fetcchingSpeciesData();
    }
  }, [organizationId]);
  if (loading) return <div>Loading species mapping...</div>;
  if (error) return <div>Error: {error}</div>;
return (
  <div className="species-table-container">
  <h3>Organization Species List</h3>
<table>
  <thead>
  <tr>
  <th>ID</th>
<th>Organization ID</th>
<th>Species Id</th>
  </tr>
  </thead>
<tbody>
{speciesList.length > 0 ? (
  speciesList.map((item) => (
    <tr key={item.id || '${item.organization_id}-${item.species_id}'}>
                  <td>{item.id}</td>
                  <td>{item.oragnization_id || item.organizationId}</td>
                  <td>{item.species_id || item.speciesId}</td>
                  </tr>
                  ))
  ) : (
    <tr>
  <td colSpan="3">No species mapped for this organization.</td>
  </tr>
)}
  </tbody>
  </table>
  </div>
);
};
export default SpeciesTable;
