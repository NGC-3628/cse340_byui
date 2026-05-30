// Import any needed model functions
import { getAllCategories } from '../models/categories.js';

// Define any controller functions
const showCategoriesPage = async (req, res) => {
    try {
        const categories = await getAllCategories();
        const title = 'Service Categories';
        res.render('categories', { title, categories });    
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        res.status(500).send('Error interno del servidor');
    }
};  

// Export any controller functions
export { showCategoriesPage };