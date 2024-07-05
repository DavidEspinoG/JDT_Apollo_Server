const verifyUserExistsAndIsAuthorized = (client, ctx) => {
    console.log('Here---')
    const clientSellerID = client.seller._id.toString();
    const userID = ctx.user.id;
    if(!client) {
        return new Error('Not found');
    }
    if(clientSellerID !== userID) {
        throw new Error('Unauthorized');
    }
};

module.exports = verifyUserExistsAndIsAuthorized;