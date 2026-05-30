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
}

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
}

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

export { getAllProjects, getProjectDetails, getProjectsByOrganizationId, getProjectsByCategoryId };