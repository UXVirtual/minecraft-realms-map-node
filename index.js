require('dotenv').config();
const storage = require('node-persist');

const prompt = require('prompt');

const ygg = require('yggdrasil')({
  host: process.env.MOJANG_URL // Optional custom host. No trailing slash.
});

async function refreshToken(oldAccessToken) {
  const clientToken = await storage.getItem('clientToken');

  return new Promise((resolve, reject) => {
    ygg.refresh(oldAccessToken, clientToken, function(err, newAccessToken, response, body) {
      if (err) {
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
    ygg.validate(accessToken, err => {
      console.log(err);

      if (err) {
        refreshToken(accessToken);
        reject(err);
      } else {
        resolve(accessToken);
      }
    });
  });
}

async function authenticateUser(username, password) {
  // Authenticate a user

  let accessToken = await storage.getItem('accessToken');

  const config = {
    agent: 'backup-client', // Agent name. Defaults to 'Minecraft'
    version: 0.1 // Agent version. Defaults to 1
  };

  if (accessToken) {
    accessToken = await getValidToken(accessToken);
    console.log('Got access token from storage: ', accessToken);
    config.token = accessToken;
    await storage.setItem('accessToken', accessToken);
  } else if (username && password) {
    config.user = username;
    config.pass = password;
  } else {
    return Promise.reject(new Error('Failed to enter username and password'));
  }

  return new Promise((resolve, reject) => {
    ygg.auth(config, (err, data) => {
      if (err) {
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

  const clientToken = await storage.getItem('clientToken');

  console.log('Client token: ', clientToken);

  let username;
  let password;

  if (!clientToken) {
    const credentials = await getUserCredentials();
    username = credentials.username;
    password = credentials.password;
  }

  const authData = await authenticateUser(username, password);

  console.log('AuthData: ', authData);

  await storage.setItem('accessToken', authData.accessToken);
  await storage.setItem('clientToken', authData.clientToken);
}

init();
