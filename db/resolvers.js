const User = require('../models/user');
const Product = require('../models/product');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './.env' });

const resolvers = {
    Query: {
        getUserFromToken: (_, { token }) => {
            const dataFromToken = jwt.verify(token, process.env.JWT_SECRET)
            return dataFromToken;
        }, 
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
        newUser: async (_, { data }) => {
            const { email, password } = data;
            const userExists = await User.findOne({email})
            const salt = bcrypt.genSaltSync(10);
            const hash = await bcrypt.hash(password, salt);

            if(userExists){
                throw new Error('The user already exists')
            }
            try {
                const newUser = new User({...data, password: hash});
                await newUser.save();
                return newUser;
            } catch(e){
                console.log(e)
            }
        }, 
        authenticateUser: async (_, { data }) => {
            const { email, password } = data;
            const user = await User.findOne({email});
            if(!user){
                throw new Error('The email doesn\'t exist')
            }
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if(!isPasswordCorrect){
                throw new Error('The password is not correct');
            }
            const payload = { id: user.id,
                name: user.name,
                lastName: user.lastName,
                email: user.email,
            };
            return {
                token: jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '24h'})
            }
        }, 
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
    }
}

module.exports = resolvers;
