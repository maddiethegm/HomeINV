// dbquery.js

require('dotenv').config();
const generateUUID = require('uuid').v4;
const sql = require('mssql');
const oracledb = require('oracledb');
const mysql = require('mysql2/promise');
const { Client } = require('pg');

/**
 * Database type configuration from environment variable.
 * Default to MSSQL server because that's what's used in development.
 * @type {string}
 */
const DB_TYPE = process.env.DB_TYPE || 'MSSQL';

/**
 * Formats query parameters based on their keys and types.
 * This should be neatened up but it works for now so ¯\_(ツ)_/¯
 *
 * @param {Object} params - An object containing the parameters to format.
 * @returns {Promise<Object>} A promise that resolves with formatted parameters.
 */
async function formatQueryParams(params) {
    const formattedParams = {};
    for (const key in params) {
        if (key === 'ID') {
            formattedParams[key] = { type: sql.UniqueIdentifier, value: params[key] };
        } else if (['Name', 'Description', 'Building', 'Owner', 'Role', 'Location', 'Route'].includes(key)) {
            formattedParams[key] = { type: sql.NVarChar(255), value: params[key] };
        } else if (key === 'Username', 'AuthenticatedUsername') {
            formattedParams[key] = { type: sql.NVarChar(50), value: params[key].toLowerCase() }; // Normalize to lowercase
        } else if (['PasswordHash', 'Image'].includes(key)) {
            formattedParams[key] = { type: sql.NVarChar(sql.MAX), value: params[key] };
        } else if (typeof params[key] === 'string') {
            formattedParams[key] = { type: sql.NVarChar(255), value: params[key] };
        } else if (typeof params[key] === 'number') {
            formattedParams[key] = { type: sql.Int, value: params[key] };
        }
    }
    return formattedParams;
}

/**
 * Executes a query against a MSSQL database.
 *
 * @param {Object} config - Database configuration object.
 * @param {string} query - SQL query to execute.
 * @param {Object} params - Parameters for the SQL query.
 * @returns {Promise<Object>} A promise that resolves with the result of the query execution.
 */
async function executeMSSQLQuery(config, query, params) {
    const connection = await sql.connect(config);
    const request = connection.request();
    const formattedParams = await formatQueryParams(params);

    for (const key in formattedParams) {
        if (formattedParams[key]) {
            request.input(key, formattedParams[key].type, formattedParams[key].value);
        }
    }

    const result = await request.query(query);
    return { recordset: result.recordset };
}

/**
 * Executes a query against an Oracle database.
 *
 * @param {Object} config - Database configuration object.
 * @param {string} query - SQL query to execute.
 * @param {Object} params - Parameters for the SQL query.
 * @returns {Promise<Object>} A promise that resolves with the result of the query execution.
 */
async function executeOracleQuery(config, query, params) {
    const connection = await oracledb.getConnection(config);
    const binds = await formatQueryParams(params);
    const options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT
    };
    const result = await connection.execute(query, binds, options);
    return { recordset: result.rows };
}

/**
 * Executes a query against a MariaDB database.
 *
 * @param {Object} config - Database configuration object.
 * @param {string} query - SQL query to execute.
 * @param {Object} params - Parameters for the SQL query.
 * @returns {Promise<Object>} A promise that resolves with the result of the query execution.
 */
async function executeMariaDBQuery(config, query, params) {
    const [result] = await mysql.createConnection(config).execute(query, params);
    return { recordset: result };
}

/**
 * Executes a query against a PostgreSQL database.
 *
 * @param {Object} config - Database configuration object.
 * @param {string} query - SQL query to execute.
 * @param {Object} params - Parameters for the SQL query.
 * @returns {Promise<Object>} A promise that resolves with the result of the query execution.
 */
async function executePostgresQuery(config, query, params) {
    const connection = new Client(config);
    await connection.connect();
    const binds = await formatQueryParams(params);
    const result = await connection.query(query, binds.rows);
    return { recordset: result.rows };
}

/**
 * Executes a query against the configured database type.
 *
 * @param {Object} config - Database configuration object.
 * @param {string} query - SQL query to execute.
 * @param {Object} params - Parameters for the SQL query.
 * @returns {Promise<Object>} A promise that resolves with the result of the query execution.
 */
async function executeQuery(config, query, params) {
    let result;
    switch (DB_TYPE.toUpperCase()) {
        case 'MSSQL':
            result = await executeMSSQLQuery(config, query, params);
            break;
        case 'ORACLE':
            result = await executeOracleQuery(config, query, params);
            break;
        case 'MARIADB':
            result = await executeMariaDBQuery(config, query, params);
            break;
        case 'POSTGRES':
            result = await executePostgresQuery(config, query, params);
            break;
        default:
            throw new Error('Unsupported database type');
    }
    return result;
}

/**
 * Logs a transaction to the database.
 * This should be broken out to a separate file. It's on the to-do list at the same time as adding detailed logging to a local log in .txt or .csv format
 *
 * @param {Object} config - Database configuration object.
 * @param {string} route - The API route that was called.
 * @param {Object} requestPayload - Payload of the request.
 * @param {string} authenticatedUsername - Username of the authenticated user.
 */
async function logTransaction(config, route, requestPayload, authenticatedUsername) {
    try {
        const ID = generateUUID();
        const query = `
            INSERT INTO Transactions (ID, Route, RequestPayload, AuthenticatedUsername)
            VALUES (@ID, @Route, @RequestPayload, @AuthenticatedUsername)
        `;
        const params = {
            ID: ID,
            Route: route,
            RequestPayload: JSON.stringify(requestPayload),
            AuthenticatedUsername: authenticatedUsername || 'none'
        };
        await executeQuery(config, query, params);
    } catch (err) {
        console.error('Transaction log error:', err);
    }
}

module.exports = { executeQuery, logTransaction };
