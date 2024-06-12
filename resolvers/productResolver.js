const Product = require('../models/product');

const productResolver = {
    Query: {
        getProducts: async () => {
            try {
                const products = await Product.find({});
                return products;
            } catch(e) {
                console.log(e);
            }
        }, 
        getProduct: async (_, { id }) => {
            try {
                const product = await Product.findById(id);
                if(!product){
                    throw new Error('Product doesn\'t exist')
                }
                return product;
            } catch(e) {
                console.log(e);
            }
        }
    },
    Mutation: {
        newProduct: async (_, { data }) => {
            try {
                const product = new Product(data);
                const res = await product.save();
                return res; 
            } catch(e) {
                console.log(e);
            }
        },
        updateProduct: async (_, {id, input}) => {
            const product = await Product.findById(id);
            if(!product){
                throw new Error('The product doesn\'t exist')
            }
            try {
                const updatedProduct = await Product.findOneAndUpdate({_id: id}, input, {new: true});
                return updatedProduct;
            } catch(e){
                console.log(e);
            }
        },
        deleteProduct: async (_, {id}) => {
            const product = await Product.findById(id);
            if(!product){
                throw new Error('The product doesn\'t exist')
            }
            try {
                const result = await Product.findOneAndDelete({_id: id})
                return `${result.name} deleted`
            } catch(e){
                console.log(e);
            }
        }
    }
};

module.exports = productResolver;