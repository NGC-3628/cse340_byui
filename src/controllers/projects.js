import { getAllProjects, getProjectDetails, createProject, updateProject, checkVolunteerStatus, addVolunteer, removeVolunteer } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

// --- VALIDATION RULES ---
const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format')
        .custom(value => {
            const minDate = new Date('2020-01-01');
            const inputDate = new Date(value);
            if (inputDate < minDate) {
                throw new Error('Date must be 2020 or later');
            }
            return true;
        }),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

// --- CONTROLLER FUNCTIONS ---

const showProjectsPage = async (req, res) => {
    const projects = await getAllProjects();
    const title = 'Upcoming Service Projects';
    res.render('projects', { title, projects });
};  

const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const projectDetails = await getProjectDetails(projectId);
    const categories = await getCategoriesByProjectId(projectId);
    
    if (!projectDetails) return res.status(404).render('errors/404', { title: 'Page Not Found' });

    // Check if user is logged in and if they are volunteering
    let isVolunteering = false;
    if (req.session && req.session.user) {
        isVolunteering = await checkVolunteerStatus(req.session.user.user_id, projectId);
    }

    const title = projectDetails.title;
    // Pass 'isVolunteering' to the view
    res.render('project', { title, projectDetails, categories, isVolunteering }); 
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
};

const processNewProjectForm = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new project form
        return res.redirect('/new-project');
    }

    // Extract form data from req.body
    const { title, description, location, date, organizationId } = req.body;

    try {
        // Create the new project in the database
        const newProjectId = await createProject(title, description, location, date, organizationId);

        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
};

const showEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const projectDetails = await getProjectDetails(projectId);
    const organizations = await getAllOrganizations();

    if (!projectDetails) return res.status(404).render('errors/404', { title: 'Page Not Found' });

    const title = 'Edit Service Project';
    res.render('edit-project', { title, projectDetails, organizations });
};

const processEditProjectForm = async (req, res) => {
    const projectId = req.params.id;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/edit-project/${projectId}`);
    }

    const { title, description, location, date, organizationId } = req.body;

    try {
        await updateProject(projectId, title, description, location, date, organizationId);
        req.flash('success', 'Service project updated successfully!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error updating project:', error);
        req.flash('error', 'There was an error updating the service project.');
        res.redirect(`/edit-project/${projectId}`);
    }
};

const volunteerForProject = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;
    try {
        await addVolunteer(userId, projectId);
        req.flash('success', 'You are now volunteering for this project!');
    } catch (error) {
        req.flash('error', 'Error signing up for the project.');
    }
    res.redirect(`/project/${projectId}`);
};

const unvolunteerForProject = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;
    try {
        await removeVolunteer(userId, projectId);
        req.flash('success', 'You have been removed as a volunteer.');
    } catch (error) {
        req.flash('error', 'Error removing you from the project.');
    }
    // Redirects back to either the dashboard or the project page depending on where they clicked it
    const referer = req.get('Referrer') || `/project/${projectId}`;
    res.redirect(referer);
};

// --- EXPORTS ---
export { 
    showProjectsPage, 
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    volunteerForProject, 
    unvolunteerForProject,
    projectValidation 
};