import getDb from './db.js';

const getAllCategories = async () => {
    const db = getDb();
    const query = `SELECT "id", "name", "description" FROM categories;`;
    const result = await db.query(query);
    return result.rows;
}

const getCategoryDetails = async (categoryId) => {
    const db = getDb();
    try {
        const query = `SELECT id, name, description FROM Categories WHERE id = $1;`;
        const result = await db.query(query, [categoryId]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        return null;
    }
}

const getCategoriesByProjectId = async (projectId) => {
    const db = getDb();
    try {
        const query = `
            SELECT c.id, c.name, c.description
            FROM Categories c
            JOIN Project_Categories pc ON c.id = pc.category_id
            WHERE pc.project_id = $1;
        `;
        const result = await db.query(query, [projectId]);
        return result.rows;
    } catch (error) {
        return [];
    }
}

export { getAllCategories, getCategoryDetails, getCategoriesByProjectId };