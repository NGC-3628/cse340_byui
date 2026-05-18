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

export {getAllOrganizations}  