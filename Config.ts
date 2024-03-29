import 'dotenv/config'

const baseSqlConfig = {
    port: parseInt(process.env.MYSQL_DEVELOPMENT_PORT),
    database: process.env.MYSQL_DEVELOPMENT_DATABASE,   
    host: process.env.MYSQL_DEVELOPMENT_HOST,
    user: process.env.MYSQL_DEVELOPMENT_USER,
    password: process.env.MYSQL_DEVELOPMENT_PASSWORD,
    locationsCsvPath: process.env.LOCATIONS_CSV_ABSOLUTE_PATH,
    lockersCsvPath: process.env.LOCKERS_CSV_ABSOLUTE_PATH,
    contractsCsvPath: process.env.CONTRACTS_CSV_ABSOLUTE_PATH
}

const config = {
    production: {
        id: 'production',
        contractExpirationDate: '-05-15',  // les contrats expirent le 15 mai à minuit.
        contractRenewalDeadline: '-08-30', // les contrats se renouvellent juqu'au 30 Juin à minuit et passent en colonisé.
        port: process.env.NODE_PORT,
        sqlConfig: {
            port: parseInt(process.env.MYSQL_PRODUCTION_PORT),
            host: process.env.MYSQL_PRODUCTION_HOST,
            user: process.env.MYSQL_PRODUCTION_USER,
            password: process.env.MYSQL_PRODUCTION_PASSWORD,
            database: process.env.MYSQL_PRODUCTION_DATABASE,
            locationsCsvPath: process.env.LOCATIONS_CSV_ABSOLUTE_PATH,
            lockersCsvPath: process.env.LOCKERS_CSV_ABSOLUTE_PATH,
            contractsCsvPath: process.env.CONTRACTS_CSV_ABSOLUTE_PATH
        }
    },
    test: {
        id: 'test',
        contractExpirationDate: '-05-15',
        contractRenewalDeadline: '-06-30',
        port: process.env.NODE_PORT,
        sqlConfig: baseSqlConfig
    },
    dev: {
        id: 'dev',
        contractExpirationDate: '-05-15',
        contractRenewalDeadline: '-08-30',
        port: process.env.NODE_PORT,
        sqlConfig: baseSqlConfig
    }
}

const environment: string = process.argv[process.argv.length - 1];
const gConfig = (config as any)[environment];

export { gConfig as config };