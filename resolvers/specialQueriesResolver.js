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
            console.log('here', clients)
            return clients;
        }
    } 
};

module.exports = specialQueriesResolver;