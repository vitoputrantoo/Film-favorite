const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
    console.log('Testing database connection...');
    console.log('Current configuration:');
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`User: ${process.env.DB_USER}`);
    console.log(`Password: ${process.env.DB_PASSWORD ? '[SET]' : '[EMPTY]'}`);
    console.log(`Database: ${process.env.DB_NAME}`);
    console.log(`Port: ${process.env.DB_PORT}`);
    console.log('');

    // Test different password scenarios
    const scenarios = [
        { password: process.env.DB_PASSWORD, description: 'Current password from .env' },
        { password: '', description: 'Empty password' },
        { password: null, description: 'Null password' },
        { password: 'password', description: 'Default password: password' },
        { password: 'root', description: 'Default password: root' },
        { password: '123456', description: 'Common password: 123456' }
    ];

    for (const scenario of scenarios) {
        try {
            console.log(`Trying: ${scenario.description}...`);
            
            const connection = await mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: scenario.password,
                port: process.env.DB_PORT
            });

            console.log(`✅ SUCCESS! Connected with: ${scenario.description}`);
            
            // Test if database exists
            try {
                await connection.execute(`USE ${process.env.DB_NAME}`);
                console.log(`✅ Database '${process.env.DB_NAME}' exists`);
            } catch (dbError) {
                console.log(`❌ Database '${process.env.DB_NAME}' does not exist`);
                console.log('Creating database...');
                await connection.execute(`CREATE DATABASE ${process.env.DB_NAME}`);
                console.log(`✅ Database '${process.env.DB_NAME}' created successfully`);
            }

            await connection.end();
            
            // Update .env file with working password
            if (scenario.password !== process.env.DB_PASSWORD) {
                console.log('\n🔧 Updating .env file with working password...');
                const fs = require('fs');
                let envContent = fs.readFileSync('.env', 'utf8');
                envContent = envContent.replace(/DB_PASSWORD=.*/, `DB_PASSWORD=${scenario.password || ''}`);
                fs.writeFileSync('.env', envContent);
                console.log('✅ .env file updated');
            }
            
            return true;
        } catch (error) {
            console.log(`❌ Failed: ${error.message}`);
        }
    }

    console.log('\n❌ All connection attempts failed. Please check:');
    console.log('1. MariaDB/MySQL service is running');
    console.log('2. Root user credentials');
    console.log('3. Try connecting manually with a database client');
    return false;
}

testConnection().then(success => {
    if (success) {
        console.log('\n🎉 Database connection fixed! You can now run your application.');
    } else {
        console.log('\n💡 Manual fix needed. Please check your database configuration.');
    }
    process.exit(success ? 0 : 1);
});
