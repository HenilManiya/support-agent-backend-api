require('dotenv').config();

module.exports = {
    PORT: process.env.APP_PORT || 5000,
    jwt: {
        jwtSecrets : process.env.JWT_SECRET,
        jwtExpiresIn : 1 * 3600 * 1000
    },
    db: {
        dbLive: process.env.MONGOURI_LIVE,
        dbTest: process.env.MONGOURI_TEST,
        dbDev: process.env.MONGOURI_DEV,
        dbLocal: process.env.MONGOURI_DEV
    }
}
