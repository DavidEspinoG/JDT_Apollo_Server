const Order = require('../models/order');
const Product = require('../models/product');

const specialQueriesResolver = {
    Query: {
        getTopClients: async() => {
            const clients = await Order.aggregate([
                { $match: { state: "COMPLETED"}}, 
                { $group: {
                    _id: "$client", 
                    total: { $sum: '$total'}
                }}, 
                {
                    $lookup: {
                        from: 'clients', 
                        localField: '_id', 
                        foreignField: '_id', 
                        as: 'client'
                    }
                }, 
                { $sort: { total: -1}}
            ]);
            return clients;
        }, 
        getTopSellers: async () => {
            const sellers = await Order.aggregate([
                { $match: { state: "COMPLETED" } },
                { $group: {
                    _id: "$seller", 
                    total: { $sum: '$total' }
                }}, 
                {
                    $lookup: {
                        from: 'users', 
                        localField: '_id', 
                        foreignField: '_id', 
                        as: 'seller'
                    }
                }, 
                { $limit: 5 }, 
                {
                    $sort:  { total: -1 }
                }
            ])
            return sellers;
        },
        searchProduct: async(_, { text }) => {
            const products = await Product.find( { $text: { $search: text } }).limit(10);
            return products;
        }
    } 
};

module.exports = specialQueriesResolver;