import 'dotenv/config'

const config = {
    test: {
        id: 'test',
        contractExpirationDate: '-05-15',
        contractRenewalDeadline: '-06-30',
        port: process.env.NODE_PORT,
        sqlConfig: {
            port: process.env.MYSQL_DEVELOPMENT_PORT,
            database: process.env.MYSQL_DEVELOPMENT_DATABASE,   
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD
        }
    },
    production: {
        id: 'production',
        contractExpirationDate: '-05-15',  // les contrats expirent le 15 mai à minuit.
        contractRenewalDeadline: '-06-30', // les contrats se renouvellent juqu'au 30 Juin à minuit et passent en colonisé.
        port: process.env.NODE_PORT,
        sqlConfig: {
            port: process.env.MYSQL_PRODUCTION_PORT,
            database: process.env.MYSQL_PRODUCTION_DATABASE,
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD
        }
    }
}

const gConfig = config.test;

export { gConfig as config };