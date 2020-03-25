require('dotenv').config();
const storage = require('node-persist');

const prompt = require('prompt');

// TODO: add check that .env file is created

const ygg = require('yggdrasil')({
  host: process.env.MOJANG_URL // Optional custom host. No trailing slash.
});

async function refreshToken(oldAccessToken) {
  console.log('Refreshing token');
  const clientToken = await storage.getItem('clientToken');

  return new Promise((resolve, reject) => {
    ygg.refresh(oldAccessToken, clientToken, function(err, newAccessToken, response, body) {
      if (err !== null) {
        reject(err);
      } else {
        console.log('Got refresh token response: ', response);
        resolve(newAccessToken);
      }
    });
  });
}

async function getValidToken(accessToken) {
  return new Promise((resolve, reject) => {
    console.log('Validating access token: ', accessToken);
    ygg.validate(accessToken, async err => {
      console.log('Access token validated');
      console.log(err);

      if (err !== null) {
        try {
          const refreshedToken = await refreshToken(accessToken);
          resolve(refreshedToken);
        } catch (err) {
          reject(err);
        }
      } else {
        resolve(accessToken);
      }
    });
  });
}

async function authenticateUser(username, password) {
  // Authenticate a user
  console.log('Authenticating with username: ', username);

  const config = {
    agent: 'backup-client', // Agent name. Defaults to 'Minecraft'
    version: 1, // Agent version. Defaults to 1
    token: '' // NOTE: somehow providing client token causes auth process to fail
  };

  config.user = username;
  config.pass = password;

  return new Promise((resolve, reject) => {
    ygg.auth(config, (err, data) => {
      console.log('Got auth result: ', data);
      console.log('Got auth error: ', err);
      if (err !== null) {
        console.error('Error: ', err);
        reject(err);
      } else {
        console.log('Data: ', data);
        resolve(data);
      }
    });
  });
}

async function getUserCredentials() {
  return new Promise((resolve, reject) => {
    const schema = {
      properties: {
        username: {
          required: true
        },
        password: {
          hidden: true
        }
      }
    };

    //
    // Start the prompt
    //
    console.log('Enter username and password: ');
    prompt.start();
    prompt.get(schema, (err, result) => {
      if (err) {
        reject(err);
      }

      resolve(result);
    });
  });
}

async function init() {
  // you must first call storage.init
  await storage.init();

  let username;
  let password;

  username = process.env.MOJANG_USERNAME;
  password = process.env.MOJANG_PASSWORD;

  const authData = await authenticateUser(username, password);

  console.log('AuthData: ', authData);

  await storage.setItem('accessToken', authData.accessToken);
  await storage.setItem('clientToken', authData.clientToken);
}

init();
