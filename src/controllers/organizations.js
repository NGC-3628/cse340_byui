// import any needed model functions
import { getAllOrganizations, getOrganizationDetails } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

// defines any controller functions
const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';
    res.render('organizations', { title, organizations });
};

const showOrganizationDetailsPage = async (req, res) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);
    const projects = await getProjectsByOrganizationId(organizationId);
    const title = 'Organization Details';

    res.render('organization', {title, organizationDetails, projects});
};

// export controlller functions
export { showOrganizationsPage, showOrganizationDetailsPage };
/*
the extraction of specific parameters from the request object 
(like req.params.id) and the use of model functions to fetch data from the database,
which is then passed to the view for rendering.
for example, in the showOrganizationDetailsPage function, we extract the organization ID from the request parameters, 
use it to fetch the organization details and related projects from the database, and then render the organization details page with that data.
*/