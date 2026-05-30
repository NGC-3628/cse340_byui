import { Pool } from 'pg';

/**
 * Connection pool for PostgreSQL database.
 * 
 * A connection pool maintains a set of reusable database connections
 * to avoid the overhead of creating new connections for each request.
 * This improves performance and reduces load on the database server.
 * 
 * Uses a connection string from environment variables for simplified setup.
 * The connection string format is:
 * postgresql://username:password@host:port/database
 */

// Parse connection string to extract components
const parseConnectionString = (connStr) => {
    const url = new URL(connStr);
    const isExternal = url.hostname.includes('render.com');
    return {
        user: url.username,
        password: url.password,
        host: url.hostname,
        port: url.port || 5432,
        database: url.pathname.slice(1),
        ssl: isExternal ? { rejectUnauthorized: false } : false
    };
};

let pool = null;

//Initialize the connection pool if it hasn't been created yet
const initializePool = () => {
    if (!pool) {
        const connParams = parseConnectionString(process.env.DB_URL);
        pool = new Pool(connParams);
    }
    return pool;
};

// Get the connection pool, initializing it if necessary
const getPool = () => {
    return pool || initializePool();
};

/**
 * Common SSL Issue:
 *
 * You may encounter SSL connection errors depending on your operating system, Node.js
 * version, or PostgreSQL server settings. If you have confirmed your credentials are
 * correct but still see SSL errors, try updating the 'ssl' property in the Pool
 * configuration above to:
 *
 * ssl: {
 *     rejectUnauthorized: false
 * }
 */

/**
 * Since we will modify the normal pool object in development mode, we need to create and
 * export a reference to the pool object. This allows us to use the same name for the
 * export regardless of whether we are in development or production mode.
 */

const createDbWrapper = () => {
    const pool = getPool();
    
    if (process.env.NODE_ENV === 'development' && process.env.ENABLE_SQL_LOGGING === 'true') {
        /**
         * In development mode, we wrap the pool to provide query logging.
         * This helps with debugging by showing all executed queries in the console.
         * 
         * The wrapper also adds timing information to help identify slow queries
         * and tracks the number of rows affected by each query.
         */
        return {
            async query(text, params) {
                try {
                    const start = Date.now();
                    const res = await pool.query(text, params);
                    const duration = Date.now() - start;
                    console.log('Executed query:', { 
                        text: text.replace(/\s+/g, ' ').trim(), 
                        duration: `${duration}ms`, 
                        rows: res.rowCount 
                    });
                    return res;
                } catch (error) {
                    console.error('Error in query:', { 
                        text: text.replace(/\s+/g, ' ').trim(), 
                        error: error.message 
                    });
                    throw error;
                }
            },

            async close() {
                await pool.end();
            }
        };
    } else {
        // In production, export the pool directly without logging overhead
        return pool;
    }
};

let db = null; // why is db null? 
// We will initialize it lazily when the first query is made. 
// This allows us to avoid creating a connection pool before we have the database URL configured, 
// which can be helpful in certain deployment environments. 

/**
 * Tests the database connection by executing a simple query.
 */
const testConnection = async() => {
    if (!db) {
        db = createDbWrapper();
    }
    console.log('DB_URL:', process.env.DB_URL);
    try {
        const result = await db.query('SELECT NOW() as current_time');
        console.log('Database connection successful:', result.rows[0].current_time);
        return true;
    } catch (error) {
        console.error('Database connection failed:', error.message);
        throw error;
    }
};

const getDb = () => {
    if (!db) {
        db = createDbWrapper();
    }
    return db;
};

export { getDb as default, testConnection };