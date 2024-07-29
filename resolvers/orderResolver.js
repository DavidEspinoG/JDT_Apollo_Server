const { Query } = require("./productResolver");
const verifyUserExistsAndIsAuthorized = require("./utils/verifyUserExistAndIsAuthorized");
const Client = require('../models/client');
const Product = require('../models/product');
const Order = require('../models/order');

const orderResolver = {
    Query: {

    }, 
    Mutation: {
        newOrder: async (_, {data}, ctx) => {
            // verify client exists and is authorized
            const { client:clientId, products } = data;    
            let client = await Client.findById(clientId);
            verifyUserExistsAndIsAuthorized(client, ctx);
            // Check stock
            for await (const product of products) {
                const stockProduct = await Product.findById(product?.id);
                if(product.quantity > stockProduct.items){
                    throw new Error(`Not enough stock`)
                } else {
                    stockProduct.items = stockProduct.items - product.quantity
                    await stockProduct.save();
                }

            }
            // create an order 
            const newOrder = new Order(data);
            // asign a seller 
            newOrder.seller = ctx.user.id;
            // Save it in DB
            const res = await newOrder.save();
            return res; 
        }
    }
};

module.exports = orderResolver;