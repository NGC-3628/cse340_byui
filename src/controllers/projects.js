import { getAllProjects, getProjectDetails } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';

const showProjectsPage = async (req, res) => {
    const projects = await getAllProjects();
    const title = 'Upcoming Service Projects';
    res.render('projects', { title, projects });
};  

const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const projectDetails = await getProjectDetails(projectId);
    const categories = await getCategoriesByProjectId(projectId);
    
    // If project not found, trigger 404
    if (!projectDetails) return res.status(404).render('errors/404', { title: 'Page Not Found' });

    const title = projectDetails.title;
    res.render('project', { title, projectDetails, categories });
};

export { showProjectsPage, showProjectDetailsPage };