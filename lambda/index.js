const ygg = require('yggdrasil')({
    host: process.env.MOJANG_URL, // Optional custom host. No trailing slash.
})

async function authenticateUser() {
    const config = {
        version: process.env.CLIENT_VERSION,
        user: process.env.MOJANG_USERNAME,
        pass: process.env.MOJANG_PASSWORD
    }

    return new Promise((resolve, reject) => {
        ygg.auth(config, (error, data) => {
            if (error) {
                reject(error)
            } else {
                resolve(data)
            }
        })
    })
}

exports.handler = async (event) => {
    let response;
    
    if(!event.headers.authorization){
        response = {
            statusCode: 401,
            body: JSON.stringify({ message: 'Missing auth header' }),
        };
        return response;
    }
    
    const match = event.headers.authorization.match(new RegExp(`^(Bearer.${process.env.TOKEN})$`))

    if (match === null) {
        response = {
            statusCode: 401,
            body: JSON.stringify({
                error: 'Invalid bearer token'
            })
        };
        return response;
    }
    
    try{
        const authResponse = await authenticateUser();
        response = {
            statusCode: 200,
            body: JSON.stringify(authResponse),
        };
    } catch (error) {
        response = {
            statusCode: 401,
            body: JSON.stringify({
                error: error.message
            })
        };
    }

    return response;
};
