const User = require('../models/user');

const courses = [
    {
        title: 'JavaScript Moderno Guía Definitiva Construye +10 Proyectos',
        technology: 'JavaScript ES6',
    },
    {
        title: 'React – La Guía Completa: Hooks Context Redux MERN +15 Apps',
        technology: 'React',
    },
    {
        title: 'Node.js – Bootcamp Desarrollo Web inc. MVC y REST API’s',
        technology: 'Node.js'
    }, 
    {
        title: 'ReactJS Avanzado – FullStack React GraphQL y Apollo',
        technology: 'React'
    }
];

const resolvers = {
    Query: {
        getCourses: (_, {technology}) => {
            const res = courses.filter((course) => course.technology === technology);
            return res; 
        }
    }, 
    Mutation: {
        newUser: async (_, {data}) => {
            const { email } = data;
            const userExists = await User.findOne({email})

            console.log('userExists', userExists);
            if(userExists){
                throw new Error('The user already exists')
            }
            try {
                const newUser = new User(data);
                await newUser.save();
                return newUser;
            } catch(e){
                console.log(e)
            }
        }
    }
}

module.exports = resolvers;
