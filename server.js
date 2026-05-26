import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from "dotenv";
dotenv.config();

import { testConnection } from './src/models/db.js';
import { getAllOrganizations } from './src/models/organizations.js';
import { getAllCategories } from './src/models/categories.js';


import express from 'express';



const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();



/**
  * Configure Express middleware
  */

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));


// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));




/**
 * Routes
 */
app.get('/', async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
});

app.get('/organizations', async (req, res) => {
    const organizations = await getAllOrganizations();
    console.log(organizations);
      
    const title = 'Our Partner Organizations';
    res.render('organizations', { title, organizations });
});

app.get('/projects', async (req, res) => {
    const title = 'Service Projects';
    res.render('projects', { title });
});

/*app.get('/categories', async (req, res) => {
    const title = 'Categories';
    res.render('categories', { title });    
});
*/
app.get('/categories', async (req, res) => {
    try {
        const categories = await getAllCategories(); // Obtiene las categorías de la BD
        const title = 'Categories';
        
        // El truco está aquí: pasamos tanto el title como el arreglo de categories
        res.render('categories', { title, categories });    
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        res.status(500).send('Error interno del servidor');
    }
});


app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});


