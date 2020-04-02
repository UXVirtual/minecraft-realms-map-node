require('dotenv').config()
const storage = require('node-persist')
const rp = require('request-promise')

// TODO: add check that .env file is created

const ygg = require('yggdrasil')({
  host: process.env.MOJANG_URL, // Optional custom host. No trailing slash.
})

async function storeRefreshToken() {
  const tempAccessToken = await storage.getItem('tempAccessToken')
  const clientToken = await storage.getItem('clientToken')
  console.log('Refreshing token: ', tempAccessToken)
  return new Promise(async (resolve, reject) => {
    ygg.refresh(tempAccessToken, clientToken, async function(err, newAccessToken, response) {
      if (err !== null) {
        reject(err)
      } else {
        console.log('Response: ', response)
        console.log('Stored long life access token: ', response.accessToken)
        await storage.setItem('accessToken', response.accessToken)
        resolve(response.accessToken)
      }
    })
  })
}

async function authenticateUser(username, password) {
  // Authenticate a user
  console.log('Authenticating with username: ', username)

  const config = {
    token: process.env.CLIENT_ID, // NOTE: somehow providing client token causes auth process to fail
  }

  config.user = username
  config.pass = password

  return new Promise((resolve, reject) => {
    ygg.auth(config, (err, data) => {
      if (err !== null) {
        console.error('Error: ', err)
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

async function storeUUID() {
  console.log('Storing playerUUID')
  return new Promise(async (resolve, reject) => {
    const request = {
      method: 'GET',
      uri: `https://${process.env.MOJANG_API_HOST}/users/profiles/minecraft/${process.env.MOJANG_USERNAME}`,
    }

    try {
      // Make the request and return the token
      const profile = JSON.parse(await rp(request))
      console.log('Got profile: ', profile)
      await storage.setItem('playerUUID', profile.id)
      console.log('Stored playerUUID: ', profile.id)
      resolve(profile.id)
    } catch (err) {
      reject(err)
    }
  })
}

async function downloadWorldBackup() {
  return new Promise(async (resolve, reject) => {
    //
    const realmID = await getRealmID()
    console.log(realmID)
    // NOTE: port minecraft-realms-map.sh to node.js from this repo: https://github.com/UXVirtual/minecraft-realms-map
    // NOTE: see Realms API here: https://wiki.vg/Realms_API
    // NOTE: see Mojang API here: https://wiki.vg/Mojang_API

    // TODO: make request to REALMS_WORLD_URL to get realm ID
    // TODO: get world backup URL based on realm ID
    // TODO: download world backup zip and attempt up to 2 retries before failing
    // TODO: extract world backup to disk
    // TODO: clean old backups from disk
    // TODO: trigger Minecraft Overviewer to generate map
    // TODO: use AWS API to sync map to S3 bucket
    // TODO: clean logs older than 7 days
  })
}

function constructRealmsHeaders(accessToken, playerUUID) {
  const headers = {
    Cookie: `sid=token:${accessToken}:${playerUUID};user=${process.env.MOJANG_USERNAME};version=${process.env.VERSION}`,
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    'User-Agent': `Java/1.8.0_101`,
    Host: process.env.REALMS_HOST,
    Accept: 'text/html, image/gif, image/jpeg, *; q=.2, */*; q=.2',
    Connection: 'keep-alive',
    'Content-Type': 'application/json',
  }
  console.log('Constructed headers: ', headers)
  return headers
}

async function getRealmID() {
  const accessToken = await storage.getItem('accessToken')
  const playerUUID = await storage.getItem('playerUUID')

  return new Promise(async (resolve, reject) => {
    console.log('Getting realm ID')
    const request = {
      method: 'GET',
      uri: `https://${process.env.REALMS_HOST}/worlds`,
      headers: constructRealmsHeaders(accessToken, playerUUID),
    }

    try {
      // Make the request and return the token
      const response = await rp(request)

      console.log('Realm ID response: ', JSON.parse(response))
      resolve(JSON.parse(response))
    } catch (err) {
      reject(err)
    }
  })
}

async function storeAccessToken() {
  return new Promise(async (resolve, reject) => {
    let username
    let password

    username = process.env.MOJANG_EMAIL
    password = process.env.MOJANG_PASSWORD

    try {
      const authData = await authenticateUser(username, password)

      console.log('AuthData: ', authData)

      await storage.setItem('tempAccessToken', authData.accessToken)
      await storage.setItem('clientToken', authData.clientToken)

      resolve(authData.accessToken)
    } catch (err) {
      reject(err)
    }
  })
}

async function init() {
  // you must first call storage.init
  await storage.init()
  await storeAccessToken()
  await storeRefreshToken()
  await storeUUID()
  await downloadWorldBackup()
}

init()
