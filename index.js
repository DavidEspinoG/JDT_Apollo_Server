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
        try {
            const user = jwt.verify(token, process.env.JWT_SECRET);
            return { user };
        } catch(e) {
            console.log(e);
        }
    }
});

server.listen().then(({url}) => {
    console.log(`Server running in ${url}`)
});