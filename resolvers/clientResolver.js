const Client = require('../models/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
    }, 
    Mutation: {
        newClient: async (_, { input }, ctx ) => {
            if(!ctx.user.id) {
                throw new Error('Unauthorized');
            }
            const { email, password } = input;
            const userExists = await Client.findOne({email})
            const salt = bcrypt.genSaltSync(10);
            const hash = await bcrypt.hash(password, salt);

            if(userExists){
                throw new Error('The user already exists')
            }
            try {
                const newClient = new Client({...input, password: hash});
                newClient.seller = ctx.user.id;
                await newClient.save();
                return newClient;
            } catch(e){
                console.log(e)
            }
        }, 
    }
};

module.exports = clientResolver;