import getDb from './db.js';

const getAllProjects = async () => {
    const db = getDb();
    
    try {
        // Try to fetch projects from the database
        const query = `
            SELECT *
            FROM projects;
        `;
        const result = await db.query(query);
        return result.rows; 
        
    } catch (error) {
        // If the projects table doesn't exist yet, catch the error 
        // and return an empty array so the app doesn't crash!
        console.log("Note: Projects table not found or empty. Returning empty array for now.");
        return [];
    }
}

export { getAllProjects };