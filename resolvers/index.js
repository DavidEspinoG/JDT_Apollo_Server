const clientResolver = require('./clientResolver');
const userResolver = require('./userResolver');
const productResolver = require('./productResolver');
const orderResolver = require('./orderResolver');
// require('dotenv').config({ path: './.env' });

const resolvers = {
    Query: {
        ...clientResolver.Query,
        ...userResolver.Query,
        ...productResolver.Query,
        ...orderResolver.Query,
    }, 
    Mutation: {
        ...clientResolver.Mutation,
        ...userResolver.Mutation,
        ...productResolver.Mutation,
        ...orderResolver.Mutation,
    }
}

module.exports = resolvers;
