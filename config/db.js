const mongoose = require('mongoose');
const config = require('../config/config');
const mongoUri = config.db.dbLocal;

const InitiateMongoServer = async (logger) => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true, useUnifiedTopology: true
        });
        logger.info('Mongodb connected !');
    } catch(e) {
        console.log('error in connection!')
        logger.error('error in connection!', e);
        throw e;
    }
} 


module.exports = InitiateMongoServer;