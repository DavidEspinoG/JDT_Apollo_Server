const { UserInputError, AuthenticationError } = require('apollo-server');

const verifyUserExistsAndIsAuthorized = (client, ctx) => {
    if(!client) {
        throw new UserInputError('Client not found');
    }
    const clientSellerID = client?.seller._id.toString();
    const userID = ctx.user?.id;
    if((clientSellerID !== userID) || !ctx) {
        throw new AuthenticationError('Invalid token or token not provided');
    }
};

module.exports = verifyUserExistsAndIsAuthorized;