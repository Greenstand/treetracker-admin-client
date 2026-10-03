import React, { useState, useEffect } from 'react';

export default function SpeciesManagement() {
  const [globalSpecies, setGlobalSpecies] = useState([]);
  const [orgSpecies, setOrgSpecies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Global Species Pool and Organization-level species selection data
  useEffect(() => {
    const fetchSpeciesData = async () => {
      try {
        setLoading(true);
        // Replace with your actual API route endpoints for backend integration
        const globalRes = await fetch('/api/v1/species/global');
        const globalData = await globalRes.json();
        setGlobalSpecies(globalData);

        const orgRes = await fetch('/api/v1/species/organization');
        const orgData = await orgRes.json();
        setOrgSpecies(orgData);
      } catch (err) {
        setError('Failed to load species data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpeciesData();
  }, []);

  if (loading) return <div style={{ padding: '20px', color: '#fff' }}>Loading species management UI...</div>;
  if (error) return <div style={{ padding: '20px', color: '#ff6b6b' }}>{error}</div>;

  return (
    <div style={{ padding: '20px', color: '#fff', fontFamily: 'sans-serif' }}>
      <h2>Species Management Dashboard</h2>
      
      {/* Sub-Issue #1219: Global Species Pool UI */}
      <section style={{ marginBottom: '30px' }}>
        <h3>Global Species Pool (#1219)</h3>
        <p>Manage and view all available species globally.</p>
        <ul style={{ background: '#1e1e1e', padding: '15px', borderRadius: '6px', listStyle: 'none' }}>
          {globalSpecies.map((species, index) => (
            <li key={index} style={{ padding: '8px 0', borderBottom: '1px solid #333' }}>
              {species.name || species.scientificName || `Species item ${index + 1}`}
            </li>
          ))}
        </ul>
      </section>

      {/* Sub-Issue #1220: Organization-Level Species Selection UI */}
      <section>
        <h3>Organization-Level Species Selection (#1220)</h3>
        <p>Select and configure species assigned to specific organizations.</p>
        <div style={{ background: '#1e1e1e', padding: '15px', borderRadius: '6px' }}>
          {orgSpecies.map((item, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #333' }}>
              <span>{item.organizationName || 'Organization'}</span>
              <span>{item.selectedSpeciesCount || '0'} species selected</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
