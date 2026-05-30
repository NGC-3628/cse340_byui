SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';


/*
Unique identifier (organization_id)
Name
Description
Contact Email
Logo Filename
*/

CREATE TABLE Organizations(
	organization_id SERIAL PRIMARY KEY,
	name VARCHAR(150) NOT NULL,
	description TEXT, 
	email VARCHAR(255) NOT NULL UNIQUE,
	logo_address VARCHAR(200)
);

CREATE TABLE Categories(
	id SERIAL PRIMARY KEY,
	name VARCHAR (150) NOT NULL,
	description TEXT
);

INSERT INTO Categories(name, description)
	VALUES
	('Environmental', 'love mother nature'),
	('Educational', 'love intellect'),
	('Community Service', 'love service'),
	('Health & Wellness', 'love yourself');

SELECT * FROM Categories;

INSERT INTO Organizations (name, description,
	email, logo_address)
	VALUES
(
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    'contact@greenharvest.org',
    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers',
    'A volunteer coordination group supporting local charities and service initiatives.',
    'hello@unityserve.org',
    'unityserve-logo.png'
);


SELECT * FROM Organizations;

UPDATE Organizations 
SET email = 'nuevo_correo@unityserve.org' 
WHERE organization_id = 2;

CREATE TABLE Project_Categories (
    project_id INT REFERENCES Projects(project_id) ON DELETE CASCADE,
    category_id INT REFERENCES Categories(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);






-- create table of projets
CREATE TABLE IF NOT EXISTS Projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INT REFERENCES Organizations(organization_id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    location VARCHAR(200),
    date DATE
);

SELECT * from Projects;

-- inserting some projects
INSERT INTO Projects (organization_id, title, description, location, date)
VALUES
(1, 'Community Garden Setup', 'Help build raised beds and prepare soil for our new urban farm.', 'Downtown Plaza', '2026-06-15'),
(2, 'Park Cleanup Drive', 'Join us in picking up trash and beautifying the local community park.', 'Central Park', '2026-06-20'),
(1, 'Urban Farming Workshop', 'Teach locals how to start their own sustainable balcony gardens.', 'GreenHarvest HQ', '2026-07-05'),
(2, 'Food Bank Sorting', 'Help organize donated canned goods for weekend distribution to families.', 'Main Street Food Bank', '2026-07-10');

SELECT * from Projects;


--creating table of relation 
CREATE TABLE IF NOT EXISTS Project_Categories (
    project_id INT REFERENCES Projects(project_id) ON DELETE CASCADE,
    category_id INT REFERENCES Categories(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

-- linking projects to categories
INSERT INTO Project_Categories (project_id, category_id)
VALUES
INSERT INTO Project_Categories (project_id, category_id)
VALUES
(1, 1), (1, 3), -- garden setup is environmental & community Service
(2, 1), (2, 3), -- park cleanup is environmental & Community Service
(3, 1), (3, 2), -- farming workshop is environmental & educational
(4, 3), (4, 4); -- foodbank is Community Service & health & wellnes

SELECT * from Projects;
SELECT * from Project_Categories;
