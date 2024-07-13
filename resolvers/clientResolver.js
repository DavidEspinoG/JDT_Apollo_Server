const Client = require('../models/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const user = require('../models/user');
const verifyUserExistAndIsAuthorized = require('./utils/verifyUserExistAndIsAuthorized');
const { UserInputError, AuthenticationError } = require('apollo-server');
const clientResolver = {
    Query: {
        getAllClients: async () => {
            try {
                const clients = await Client.find({});
                return clients;
            } catch (error) {
                console.log(error);
                return {
                    message: "Internal server error",
                }
            }
        },
        getClientsBySeller: async (_, { input }, ctx) => {
            try {
                const clients = await Client.find({ seller: ctx.user.id.toString() });
                return clients;
            } catch (e) {
                console.log(e);
            }
        },
        getClientById: async(_, { id }, ctx) => {
            try {
                const client = await Client.findById(id);
                verifyUserExistAndIsAuthorized(client, ctx);
                return client;
            } catch(e) {
                console.log(e)
                return { message: 'debugging'}
            }
            // return client
        },
    }, 
    Mutation: {
        newClient: async (_, { data }, ctx ) => {
            if(!ctx.user?.id) {
                throw new AuthenticationError('Unauthorized');
            }
            const { email, password } = data;
            const clientExists = await Client.findOne({email})
            const salt = bcrypt.genSaltSync(10);
            const hash = await bcrypt.hash(password, salt);

            if(clientExists){
                throw new UserInputError('The client already exists')
            }
            try {
                const newClient = new Client({...data, password: hash});
                newClient.seller = ctx.user.id;
                await newClient.save();
                return newClient;
            } catch(e){
                console.log(e)
                throw new UserInputError(e.message);
            }
        },
        updateClient: async (_, {email, data} , ctx) => {
            let client = await Client.findOne({ email });
            verifyUserExistAndIsAuthorized(client, ctx);
            try {
                client = Client.findOneAndUpdate({ email }, data, {new: true})
            } catch(e) {
                console.log(e);
                throw new Error(e.message);
            }
            return client; 
        }
    }
};

module.exports = clientResolver;