const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './.env' });

const resolvers = {
    Query: {
        getUserFromToken: (_, { token }) => {
            const dataFromToken = jwt.verify(token, process.env.JWT_SECRET)
            return dataFromToken;
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
        }
    }
}

module.exports = resolvers;
