const { gql } = require('apollo-server');

const typeDefs = gql`
    type Course {
        title: String
        technology: String
    }
    type Query {
        getCourses(technology: String) : [Course]
    }
`;

module.exports = typeDefs;