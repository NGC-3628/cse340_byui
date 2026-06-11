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

const assignCategoryToProject = async (categoryId, projectId) => {
    const db = getDb();
    const query = `
        INSERT INTO Project_Categories (category_id, project_id)
        VALUES ($1, $2);
    `;
    await db.query(query, [categoryId, projectId]);
}

const updateCategoryAssignments = async (projectId, categoryIds) => {
    const db = getDb();

    const deleteQuery = `
        DELETE FROM Project_Categories
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
}

const createCategory = async (name, description = '') => {
    const db = getDb();
    const query = `
        INSERT INTO Categories (name, description) 
        VALUES ($1, $2) 
        RETURNING id;
    `;
    const result = await db.query(query, [name, description]);
    return result.rows[0].id;
};

const updateCategory = async (categoryId, name, description = '') => {
    const db = getDb();
    const query = `
        UPDATE Categories 
        SET name = $1, description = $2 
        WHERE id = $3 
        RETURNING id;
    `;
    const result = await db.query(query, [name, description, categoryId]);
    return result.rows[0].id;
};

export { getAllCategories, getCategoryDetails, getCategoriesByProjectId, updateCategoryAssignments, createCategory, updateCategory};