const { Query } = require("./productResolver");
const Order = require('../models/order');

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
    } 
};

module.exports = specialQueriesResolver;