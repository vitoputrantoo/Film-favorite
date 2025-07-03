const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
    console.log('Setting up database...');
    
    try {
        // Connect without specifying database first
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT
        });

        console.log('✅ Connected to MariaDB successfully!');

        // Check if database exists
        const [databases] = await connection.execute('SHOW DATABASES');
        const dbExists = databases.some(db => db.Database === process.env.DB_NAME);
        
        if (!dbExists) {
            console.log(`Creating database '${process.env.DB_NAME}'...`);
            await connection.execute(`CREATE DATABASE ${process.env.DB_NAME}`);
            console.log('✅ Database created successfully!');
        } else {
            console.log(`✅ Database '${process.env.DB_NAME}' already exists`);
        }

        // Close current connection and reconnect with database specified
        await connection.end();
        
        const dbConnection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });
        
        console.log(`✅ Connected to database '${process.env.DB_NAME}'`);

        // Check if table exists
        const [tables] = await dbConnection.execute("SHOW TABLES");
        const tableExists = tables.some(table => table[`Tables_in_${process.env.DB_NAME}`] === 'favorite_movies');

        if (!tableExists) {
            console.log('Creating favorite_movies table...');
            await dbConnection.execute(`
                CREATE TABLE favorite_movies (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    omdb_id VARCHAR(20) NOT NULL UNIQUE,
                    title VARCHAR(255) NOT NULL,
                    year VARCHAR(10),
                    poster TEXT,
                    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
            console.log('✅ Table favorite_movies created successfully!');
        } else {
            console.log('✅ Table favorite_movies already exists');
        }

        await dbConnection.end();
        console.log('\n🎉 Database setup complete! Your movie app is ready to run.');
        return true;

    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        return false;
    }
}

setupDatabase().then(success => {
    process.exit(success ? 0 : 1);
});
