const { gql } = require('apollo-server');

const typeDefs = gql`
    type Course {
        title: String
        technology: String
    }

    type Token {
        token: String
    }

    type Product {
        id: ID
        name: String
        items: Int
        price: Float
        createdAt: String
    }

    type User {
        id: ID
        name: String
        lastName: String
        email: String
        createdAt: String
    }

    type Client {
        id: ID
        password: String 
        name: String
        lastName: String
        company: String
        email: String
        phoneNumber: String
        seller: ID
        user: User
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
    
    input NewProductInput {
        name: String!
        items: Int!
        price: Float!
    }

    input ClientInput {
        name: String!
        password: String!
        lastName: String!
        company: String
        email: String!
        phoneNumber: String
        createdAt: String
    }

    input updateClientInput {
        name: String
        password: String
        lastName: String
        company: String
        email: String
        phoneNumber: String
    }

    type Order {
        id: ID
        products: [OrderProduct]!
        total: Float!
        client: ID!
        seller: ID!
        state: OrderState
        createdAt: String
    }
    type OrderProduct {
        id: ID
        quantity: Int
    }
    input OrderProductInput {
        id: ID
        quantity: Int
    }

    input NewOrderInput {
        products: [OrderProductInput]
        total: Float
        client: ID
        state: OrderState
    }

    enum OrderState {
        PENDING
        COMPLETED
        CANCELED
    }

    type Query {
        getUserFromToken(token: String) : User
        getProducts: [Product]
        getProduct(id: ID!) : Product
        getAllClients: [Client]
        getClientsBySeller: [Client]
        getClientById(id: ID!): Client
        # Orders
        getAllOrders: [Order]
        getOrdersBySeller: [Order]
        getOrderById(id: ID!) : Order
        getOrdersByState(state: OrderState) : [Order]
        # Special queries
        getTopClients: [TopClient]
    }

    type Mutation {
        # User
        newUser(data: newUserInput): User
        authenticateUser(data: authenticateUserInput): Token
        # Product 
        newProduct(data: NewProductInput) : Product
        updateProduct(id: ID!, input: NewProductInput) : Product
        deleteProduct(id: ID!) : String
        # Client
        newClient(data: ClientInput) : Client
        updateClient(id: ID!, data: updateClientInput!) : Client
        deleteClient(id: ID!) : String
        # Order
        newOrder(data: NewOrderInput) : Order
        updateOrder(id: ID!, input: NewOrderInput) : Order
        deleteOrder(id: ID!) : String
    }
    
    type TopClient {
        total: Float
        client: [Client]
    }

`;

module.exports = typeDefs;