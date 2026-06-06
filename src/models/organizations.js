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

const createOrganization = async (name, description, contactEmail, logoFilename) => {
    const db = getDb();
    // Fixed table and column names to match your database!
    const query = `
      INSERT INTO organizations (name, description, email, logo_address)
      VALUES ($1, $2, $3, $4)
      RETURNING organization_id
    `;

    const queryParams = [name, description, contactEmail, logoFilename];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create organization');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new organization with ID:', result.rows[0].organization_id);
    }

    return result.rows[0].organization_id;
};

// Export all the model functions
export { getAllOrganizations, getOrganizationDetails, createOrganization };