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

//it calls information from DB or DB function, which is at the same time called or used in the file db.js, which is the file that connects to the database and makes queries.
//Then we got constant getAllOrganizations it is as synchronous constant and it has DB well we used to be, which is also the same time stated from get to function, and we also use a constant query, and it has the columns and draws from the database
//Then we have the result, which is also a constant, and it has the query, which is also a constant, and it has the query as an argument, and then we return the result rows, which is the data that we get from the database.
//Then we have the getOrganizationDetails, which is also a constant, and it is as asynchronous, and it has the DB, which is also a constant, and it has the query, which is also a constant, and it has the SQL query to get the organization details based on the organization ID, 
// and then we have the query parameters, which is also a constant, and it has the organization ID as an argument, and then we execute the query with the parameters, and then we return the first row of the result set, or null if no rows are found. Finally, 
// we export the model functions so that they can be used in other parts of the application.
