const dotenv = require('dotenv');
const { executeQuery } = require('../dbconnector/queryExecutor');
const paramLibrary = require('../dbconnector/paramLibrary');

dotenv.config();

// Load schema from JSON file
let schemaSync;
try {
    schemaSync = require('./sync.json');
} catch (error) {
    console.error('Error reading schemaSync.json:', error);
}

/**
 * Sync data between two databases using config objects.
 *
 * @param {Object} sourceConfig - Configuration for the source database (uses environment variables).
 * @param {Object} targetConfig - Configuration for the target database (passed in).
 */
async function syncData(targetConfig) {
    const sourceDBType = process.env.DB_TYPE; // Use environment variable
    const targetDBType = targetConfig.dbType;

    console.log(`Syncing from ${sourceDBType} to ${targetDBType}`);

    // Load schema for source and target
    const sourceSchema = schemaSync[sourceDBType];
    const targetSchema = schemaSync[targetDBType];

    if (!sourceSchema || !targetSchema) {
        throw new Error('Schema not found for one of the databases.');
    }

    // Sync each mapping
    for (const mapping of schemaSync.syncMappings) {
        console.log(`Syncing table ${mapping.sourceTable} from source to ${mapping.targetTable} in target...`);

        try {
            // Read data from source database using environment variables
            const result = await executeQuery(
                mapping.sourceTable,
                'READ',
            );
            console.log(result);
            if (!result) {
                console.log(`No data to sync for ${mapping.sourceTable} from ${sourceDBType}.`);
                continue;
            }

            // Prepare parameters for target database
            const params = {};
            console.log(params)
            for (const key in result[0]) {
                params[key] = result[0][key];
            }

            // Write data to target database using passed-in config
            const written = await executeQuery(
                mapping.targetTable,
                'CREATE',
                params,
                targetConfig
            );
            console.log(written);
        } catch (error) {
            console.error(`Error syncing table ${mapping.sourceTable}:`, error.message);
        }
    }

    console.log('Sync completed.');
}
module.exports = { syncData }; 