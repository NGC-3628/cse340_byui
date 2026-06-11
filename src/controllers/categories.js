import { getAllCategories, getCategoryDetails, getCategoriesByProjectId, updateCategoryAssignments } from '../models/categories.js';
import { getProjectsByCategoryId, getProjectDetails } from '../models/projects.js';
import { body, validationResult } from 'express-validator';


// --- AÑADIR VALIDACIÓN DEL SERVIDOR ---
const categoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ min: 3, max: 100 }).withMessage('Category name must be between 3 and 100 characters')
];

// --- AÑADIR FUNCIONES PARA CREAR (NEW) ---
const showNewCategoryForm = (req, res) => {
    const title = 'Create New Category';
    res.render('new-category', { title });
};

const processNewCategoryForm = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect('/new-category');
    }

    const { name, description } = req.body;
    const newCategoryId = await createCategory(name, description);
    
    req.flash('success', 'Category created successfully!');
    res.redirect(`/category/${newCategoryId}`);
};

// --- AÑADIR FUNCIONES PARA EDITAR (EDIT) ---
const showEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;
    const categoryDetails = await getCategoryDetails(categoryId);
    
    if (!categoryDetails) return res.status(404).render('errors/404', { title: 'Page Not Found' });

    const title = 'Edit Category';
    res.render('edit-category', { title, categoryDetails });
};

const processEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/edit-category/${categoryId}`);
    }

    const { name, description } = req.body;
    await updateCategory(categoryId, name, description);
    
    req.flash('success', 'Category updated successfully!');
    res.redirect(`/category/${categoryId}`);
};

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

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, projectDetails, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categories || [];
    
    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

export { showCategoriesPage, 
        showCategoryDetailsPage, 
        showAssignCategoriesForm, 
        processAssignCategoriesForm,
        showNewCategoryForm,        
        processNewCategoryForm,     
        showEditCategoryForm,       
        processEditCategoryForm,   
        categoryValidation };