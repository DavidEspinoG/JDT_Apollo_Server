const { Query } = require("./productResolver");
const verifyUserExistsAndIsAuthorized = require("./utils/verifyUserExistAndIsAuthorized");
const Client = require('../models/client');

const orderResolver = {
    Query: {

    }, 
    Mutation: {
        newOrder: async (_, {data}, ctx) => {
            // verify client exists and is authorized
            const { client:clientId } = data;    
            let client = await Client.findById(clientId);
            verifyUserExistsAndIsAuthorized(client, ctx);
            return {
                total: 200.0
            }


            // Check stock


            // asign a seller 


            // Save it in DB
        }
    }
};

module.exports = orderResolver;