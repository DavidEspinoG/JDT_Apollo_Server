const { gql } = require('apollo-server');

const typeDefs = gql`
    type Course {
        title: String
        technology: String
    }

    type Token {
        token: String
    }

    type User {
        id: ID
        name: String
        lastName: String
        email: String
        createdAt: String
    }

    type Query {
        getUserFromToken(token: String) : User
    }

    input newUserInput {
        name: String!
        lastName: String!
        email: String!
        password: String!
    }

    input authenticateUserInput {
        email: String!
        password: String!
    }

    type Mutation {
        newUser(data: newUserInput): User
        authenticateUser(data: authenticateUserInput): Token
    }

`;

module.exports = typeDefs;