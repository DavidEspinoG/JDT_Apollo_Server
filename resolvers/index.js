const clientResolver = require('./clientResolver');
const userResolver = require('./userResolver');
const productResolver = require('./productResolver');
require('dotenv').config({ path: './.env' });

const resolvers = {
    Query: {
        ...clientResolver.Query,
        ...userResolver.Query,
        ...productResolver.Query,
    }, 
    Mutation: {
        ...clientResolver.Mutation,
        ...userResolver.Mutation,
        ...productResolver.Mutation,
    }
}

module.exports = resolvers;
