const { ApolloServer } = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./resolvers');
const connectDB = require('./config/db');
const jwt = require('jsonwebtoken');

connectDB();
const server = new ApolloServer({
    typeDefs, 
    resolvers,
    context: ({req}) => {
        const token = req.headers['authorization'];
        let user; 
        if(token) {
            user = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        }
        return { user };
    }
});

server.listen().then(({url}) => {
    console.log(`Server running in ${url}`)
});