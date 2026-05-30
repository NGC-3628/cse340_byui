import { getAllCategories, getCategoryDetails } from '../models/categories.js';
import { getProjectsByCategoryId } from '../models/projects.js';

const showCategoriesPage = async (req, res) => {
    try {
        const categories = await getAllCategories();
        const title = 'Service Categories';
        res.render('categories', { title, categories });    
    } catch (error) {
        res.status(500).send('Error interno del servidor');
    }
};  

const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;
    const categoryDetails = await getCategoryDetails(categoryId);
    const projects = await getProjectsByCategoryId(categoryId);
    
    // If category not found, trigger 404
    if (!categoryDetails) return res.status(404).render('errors/404', { title: 'Page Not Found' });

    const title = categoryDetails.name;
    res.render('category', { title, categoryDetails, projects });
};

export { showCategoriesPage, showCategoryDetailsPage };