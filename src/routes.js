import express from 'express';

import { showHomePage } from './controllers/index.js';
import { 
    showOrganizationsPage, 
    showOrganizationDetailsPage, 
    showNewOrganizationForm, 
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm
} from './controllers/organizations.js';

import { showProjectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm, projectValidation } from './controllers/projects.js';
import { showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';


const router = express.Router();

// HOME PAGE
router.get('/', showHomePage);



//ORGANIZATION PAGES
router.get('/organizations', showOrganizationsPage);
router.get('/new-organization', showNewOrganizationForm);
router.post('/new-organization', organizationValidation, processNewOrganizationForm);
router.get('/organization/:id', showOrganizationDetailsPage);
        // editing routes
router.get('/edit-organization/:id', showEditOrganizationForm);
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);


// PROJECT PAGES
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage); 
router.get('/new-project', showNewProjectForm);
router.post('/new-project', projectValidation, processNewProjectForm);



// CATEGORY PAGES
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

// Assign categories to project routes
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm); 


// error-handling routes
router.get('/test-error', testErrorPage);

export default router;