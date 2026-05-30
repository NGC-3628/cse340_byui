import getDb from './db.js'

const getAllOrganizations = async() => {
    const db = getDb();
    const query = `
        SELECT "organization_id", "name", "description", "email" as contact_email, "logo_address" as logo_filename
        FROM organizations;
    `;
    const result = await db.query(query);
    return result.rows;
}

const getOrganizationDetails = async (organizationId) => {
    const db = getDb();
    // Adjusted SQL to match your database schema
    const query = `
      SELECT
        organization_id,
        name,
        description,
        email as contact_email,
        logo_address as logo_filename
      FROM organizations
      WHERE organization_id = $1;
    `;

    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);

    // Return the first row of the result set, or null if no rows are found
    return result.rows.length > 0 ? result.rows[0] : null;
};

// Export the model functions
export { getAllOrganizations, getOrganizationDetails };