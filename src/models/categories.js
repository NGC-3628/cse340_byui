import getDb from './db.js';

const getAllCategories = async () => {
    const db = getDb();
    const query = `
        SELECT "id", "name", "description"
        FROM categories;
    `;

    const result = await db.query(query);
    return result.rows; // Esto retorna un arreglo de objetos
}

export { getAllCategories };