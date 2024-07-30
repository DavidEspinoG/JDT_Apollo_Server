const { Query } = require("./productResolver");
const verifyUserExistsAndIsAuthorized = require("./utils/verifyUserExistAndIsAuthorized");
const Client = require('../models/client');
const Product = require('../models/product');
const Order = require('../models/order');
const { UserInputError } = require("apollo-server");
const User = require('../models/user');

const orderResolver = {
    Query: {
        getAllOrders: async () => {
            try {
                const orders = await Order.find({});
                return orders;
            } catch(e) {
                console.log(e);
            }
        },
        getOrdersBySeller: async(_, data, ctx) => {
            try {
                const orders = await Order.find({ seller: ctx.user.id});
                return orders;
            } catch(e) {
                console.log(e);
            }
        }, 
        getOrderById: async(_, { id }, ctx) => {
            try {
                const order = await Order.findById(id);
                if(!order) {
                    throw new Error('order not found')
                } 
                if(order.seller._id.toString() !== ctx.user.id){
                    throw new Error('Unauthorized')
                }
                return order;
            } catch(e) {
                console.log(e);
            }
        },
        getOrdersByState: async (_, { state }, ctx) => {
            const orders = await Order.find({state, seller: ctx.user?.id});
            return orders;
        },
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
        }, 
        updateOrder: async (_, { id, input}, ctx) => {
            // verify order exists 
            const order = await Order.findById(id);
            if(!order) {
                throw new Error('Order not found');
            }
            // Verify client exists 
            const client = await User.findById(ctx.user?.id);
            if(!client) {
                throw new Error('Client not found');
            }
            if(order.seller._id.toString() !== ctx.user.id) {
                throw new Error('Unauthorized');
            }
            // Check stock
            const { products } = input;
            if(products) {
                for await (const product of products) {
                    const stockProduct = await Product.findById(product?.id);
                    if(product.quantity > stockProduct.items){
                        throw new Error(`Not enough stock`)
                    } else {
                        stockProduct.items = stockProduct.items - product.quantity
                        await stockProduct.save();
                    }
                }
            }
            
            const res = await Order.findOneAndUpdate({_id: id}, input, { new: true});
            return res;
        },
        deleteOrder: async(_, {id}, ctx) => {
            // Find the order
            const order = await Order.findById(id);
            // Verify the user is authorized 
            if(!order){
                throw new Error('Not found');
            }
            if(order?.seller._id.toString() !== ctx.user?.id) {
                throw new Error('Unauthorized');
            }
            // Delete the order
            const res = await Order.deleteOne({_id: id});
            if(res.deletedCount > 0){
                return 'Element deleted';
            } else {
                return 'Element not found';
            }
            
        },
       
    }
};

module.exports = orderResolver;