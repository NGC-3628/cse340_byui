import getDb from './db.js';

const getAllProjects = async () => {
    const db = getDb();
    try {
        // Gets next 5 upcoming projects with organization names
        const query = `
            SELECT p.project_id, p.title, p.date, o.organization_id, o.name as organization_name
            FROM projects p
            JOIN organizations o ON p.organization_id = o.organization_id
            ORDER BY p.date ASC
            LIMIT 5;
        `;
        const result = await db.query(query);
        return result.rows; 
    } catch (error) {
        return [];
    }
};

const getProjectDetails = async (projectId) => {
    const db = getDb();
    try {
        const query = `
            SELECT p.*, o.name as organization_name, o.organization_id
            FROM projects p
            JOIN organizations o ON p.organization_id = o.organization_id
            WHERE p.project_id = $1;
        `;
        const result = await db.query(query, [projectId]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        return null;
    }
};

const getProjectsByOrganizationId = async (organizationId) => {
    const db = getDb();
    try {
        const query = `SELECT * FROM projects WHERE organization_id = $1 ORDER BY date;`;
        const result = await db.query(query, [organizationId]);
        return result.rows;
    } catch (error) {
        return [];
    }
};

const getProjectsByCategoryId = async (categoryId) => {
    const db = getDb();
    try {
        const query = `
            SELECT p.* FROM projects p
            JOIN Project_Categories pc ON p.project_id = pc.project_id
            WHERE pc.category_id = $1
            ORDER BY p.date;
        `;
        const result = await db.query(query, [categoryId]);
        return result.rows;
    } catch (error) {
        return [];
    }
};

const createProject = async (title, description, location, date, organizationId) => {
    const db = getDb(); // get the DB connection
    
    // Notice we use "Projects" to match your actual database table
    const query = `
      INSERT INTO Projects (title, description, location, date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
};

const updateProject = async (projectId, title, description, location, date, organizationId) => {
    const db = getDb();
    const query = `
      UPDATE Projects
      SET title = $1, description = $2, location = $3, date = $4, organization_id = $5
      WHERE project_id = $6
      RETURNING project_id;
    `;
    const queryParams = [title, description, location, date, organizationId, projectId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Project not found');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Updated project with ID:', projectId);
    }

    return result.rows[0].project_id;
};

/*
CONSTANTS FOR VOLUNTEERS
*/
const checkVolunteerStatus = async (userId, projectId) => {
    const db = getDb();
    const query = `SELECT * FROM project_volunteers WHERE user_id = $1 AND project_id = $2;`;
    const result = await db.query(query, [userId, projectId]);
    return result.rows.length > 0;
};

const addVolunteer = async (userId, projectId) => {
    const db = getDb();
    const query = `
        INSERT INTO project_volunteers (user_id, project_id) 
        VALUES ($1, $2) 
        ON CONFLICT DO NOTHING;
    `;
    await db.query(query, [userId, projectId]);
};

const removeVolunteer = async (userId, projectId) => {
    const db = getDb();
    const query = `DELETE FROM project_volunteers WHERE user_id = $1 AND project_id = $2;`;
    await db.query(query, [userId, projectId]);
};

const getVolunteeredProjects = async (userId) => {
    const db = getDb();
    const query = `
        SELECT p.*, o.name as organization_name
        FROM projects p
        JOIN project_volunteers pv ON p.project_id = pv.project_id
        JOIN organizations o ON p.organization_id = o.organization_id
        WHERE pv.user_id = $1
        ORDER BY p.date ASC;
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
};

export { getAllProjects, getProjectDetails, getProjectsByOrganizationId, getProjectsByCategoryId, createProject, updateProject,
        checkVolunteerStatus, addVolunteer, removeVolunteer, getVolunteeredProjects
 };