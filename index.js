const { ApolloServer } = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./resolvers');
const connectDB = require('./config/db');
const jwt = require('jsonwebtoken');

connectDB();
const server = new ApolloServer({
    typeDefs, 
    resolvers,
    introspection: true,
    context: ({req}) => {
        const token = req.headers['authorization'];
        let user; 
        if(token) {
            try {
                user = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
            } catch(e) {
                console.log(e)
            }
        }
        return { user };
    }
});

server.listen().then(({url}) => {
    console.log(`Server running in ${url}`)
});