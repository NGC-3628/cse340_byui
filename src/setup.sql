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




