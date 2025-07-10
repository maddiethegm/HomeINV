// dbquery.js
require('dotenv').config();
const generateUUID = require('uuid').v4;
const sql = require('mssql');
const oracledb = require('oracledb');
const mysql = require('mysql2/promise');
const { Client } = require('pg');

const DB_TYPE = process.env.DB_TYPE || 'MSSQL';

async function formatQueryParams(params) {
    const formattedParams = {};
    for (const key in params) {
        if (key === 'ID') {
            formattedParams[key] = { type: sql.UniqueIdentifier, value: params[key] };
        } else if (['Name', 'Description', 'Building', 'Owner', 'Role', 'Location', 'Route'].includes(key)) {
            formattedParams[key] = { type: sql.NVarChar(255), value: params[key] };
        } else if (key === 'Username') {
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

async function executeOracleQuery(config, query, params) {
    const connection = await oracledb.getConnection(config);
    const binds = await formatQueryParams(params);
    const options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT
    };
    const result = await connection.execute(query, binds, options);
    return { recordset: result.rows };
}

async function executeMariaDBQuery(config, query, params) {
    const [result] = await mysql.createConnection(config).execute(query, params);
    return { recordset: result };
}

async function executePostgresQuery(config, query, params) {
    const connection = new Client(config);
    await connection.connect();
    const binds = await formatQueryParams(params);
    const result = await connection.query(query, binds.rows);
    return { recordset: result.rows };
}

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
            AuthenticatedUsername: authenticatedUsername
        };
        await executeQuery(config, query, params);
    } catch (err) {
        console.error('Transaction log error:', err);
    }
}

module.exports = { executeQuery, logTransaction };
