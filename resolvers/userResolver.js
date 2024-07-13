const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userResolver = {
    Query: {
        getUserFromToken: (_, { token }) => {
            const dataFromToken = jwt.verify(token, process.env.JWT_SECRET)
            return dataFromToken;
        }, 
        
    },
    Mutation: {
        newUser: async (_, { data }) => {
            const { email, password } = data;
            const userExists = await User.findOne({email})
             if(userExists) {
                throw new Error('The user already exists');
             }
             try {  
                const salt = bcrypt.genSaltSync(10);
                const hash = await bcrypt.hash(password, salt);
                const newUser = new User({...data, password: hash});
                await newUser.save();
                return newUser;
             } catch(e) {
                console.log(e);
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
            const payload = { 
                id: user.id,
                name: user.name,
                lastName: user.lastName,
                email: user.email,
            };
            return {
                token: jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '24h'})
            }
        }, 
    }
};

module.exports = userResolver;