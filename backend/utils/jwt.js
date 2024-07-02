// Destructure to directly get the required function if express-jwt exports an object
const { expressjwt: expressJwt } = require('express-jwt');
const config = require('config.json');

module.exports = jwt;

function jwt() {
    const secret = config.secret;
    return expressJwt({ secret, algorithms: ['HS256'] }).unless({
        path: [
            // No auth required for these APIs
            '/login',
            '/register',
            '/'
        ]
    });
}