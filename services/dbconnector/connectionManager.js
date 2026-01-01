// /services/dbconnector/connectionManager.js

require('dotenv').config();
const sql = require('mssql');
const mysql = require('mysql2/promise');
const { Client } = require('pg');
const sqlite3 = require('sqlite3');

/**
 * Gets a connection based on the configured database type.
 *
 * @returns {Promise<Object>} A promise that resolves with the database connection.
 */
async function getConnection(config = {}) {
    const dbType = config?.dbType || process.env.DB_TYPE;
    const dbConfig = getDBConfig(dbType, config);
    switch (dbType) {
        case 'MSSQL':
            return await sql.connect(dbConfig);
        case 'MARIADB':
            return await mysql.createConnection(dbConfig);
        case 'POSTGRES':
            const client = new Client(dbConfig);
            await client.connect();
            return client;
        case 'SQLITE':
            const db = new sqlite3.Database(dbConfig.filename);
            return db;
        default:
            throw new Error('Unsupported database type');
    }
}

/**
 * Fetches the configuration for a specified database type from environment variables.
 *
 * @param {string} dbType - Type of database (e.g., 'MSSQL', 'ORACLE').
 * @returns {Object} The database configuration object.
 */
function getDBConfig(dbType, config = {}) {
    // If no config was passed, use environment variables as defaults
    const dbConfig = { ...config };

    switch (dbType.toUpperCase()) {
        case 'MSSQL':
            dbConfig.user = dbConfig.user || process.env.DB_USER;
            dbConfig.password = dbConfig.password || process.env.DB_PASSWORD;
            dbConfig.server = dbConfig.server || process.env.DB_SERVER;
            dbConfig.database = dbConfig.database || process.env.DB_DATABASE;
            dbConfig.options = dbConfig.options || {
                encrypt: true,
                trustServerCertificate: true
            };
            break;

        case 'MARIADB':
            dbConfig.host = dbConfig.host || process.env.DB_SERVER;
            dbConfig.port = dbConfig.port || parseInt(process.env.DB_PORT, 10) || 3006;
            dbConfig.user = dbConfig.user || process.env.DB_USER;
            dbConfig.password = dbConfig.password || process.env.DB_PASSWORD;
            dbConfig.database = dbConfig.database || process.env.DB_DATABASE;
            dbConfig.namedPlaceholders = dbConfig.namedPlaceholders || true;
            break;

        case 'POSTGRES':
            dbConfig.host = dbConfig.host || process.env.DB_SERVER;
            dbConfig.port = dbConfig.port || parseInt(process.env.DB_PORT, 10) || 5432;
            dbConfig.user = dbConfig.user || process.env.DB_USER;
            dbConfig.password = dbConfig.password || process.env.DB_PASSWORD;
            dbConfig.database = dbConfig.database || process.env.DB_DATABASE;
            break;

        case 'SQLITE':
            dbConfig.filename = dbConfig.filename || process.env.DB_SQLITE_PATH;
            break;

        default:
            throw new Error('Unsupported database type');
    }

    return dbConfig;
}


module.exports = { getConnection };
