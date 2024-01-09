const { gql } = require('apollo-server');

const typeDefs = gql`
    type Course {
        title: String
        technology: String
    }

    type User {
        id: ID
        name: String
        lastName: String
        email: String
        createdAt: String
    }

    type Query {
        getCourses(technology: String) : [Course]
    }

    input newUserInput {
        name: String!
        lastName: String!
        email: String!
        password: String!
    }

    type Mutation {
        newUser(data: newUserInput): String
    }
`;

module.exports = typeDefs;