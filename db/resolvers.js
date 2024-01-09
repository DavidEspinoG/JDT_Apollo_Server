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
        newUser: (_, {data}) => {
            console.log(data);
            return 'Creating new user';
        }
    }
}

module.exports = resolvers;
