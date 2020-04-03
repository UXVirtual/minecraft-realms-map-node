require('dotenv').config()
const storage = require('node-persist')
const rp = require('request-promise')
const { spawn, execSync } = require('child_process')
const moment = require('moment')

// TODO: add check that .env file is created

const ygg = require('yggdrasil')({
  host: process.env.MOJANG_URL, // Optional custom host. No trailing slash.
})

async function storeRefreshToken() {
  const tempAccessToken = await storage.getItem('tempAccessToken')
  const clientToken = await storage.getItem('clientToken')
  console.log('Getting access token...')
  return new Promise(async (resolve, reject) => {
    ygg.refresh(tempAccessToken, clientToken, async function(error, newAccessToken, response) {
      if (error !== null) {
        reject(error)
      } else {
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
    version: process.env.CLIENT_VERSION,
  }

  config.user = username
  config.pass = password

  return new Promise((resolve, reject) => {
    ygg.auth(config, (error, data) => {
      if (error !== null) {
        console.error('Error: ', error)
        reject(error)
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
    } catch (error) {
      reject(error)
    }
  })
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function downloadWorldBackup() {
  return new Promise(async (resolve, reject) => {
    const servers = await getRealmsServers()
    servers.filter(server => {
      return server.realmsSubscriptionId === process.env.REALMS_SUBSCRIPTION_ID
    })

    const realmID = servers[0].id
    let backupURL
    try {
      backupURL = await getWorldBackupURL(realmID)
    } catch (error) {
      if (error.statusCode === 503) {
        console.warn('WARNING: Rate limited. Waiting for 30 sec, then retrying...')
        await sleep(30000)
        console.log('Retrying...')
        try {
          backupURL = await getWorldBackupURL(realmID)
        } catch (error) {
          reject('Failed to get world backup url')
        }
      }
    }

    try {
      const path = await downloadAndVerifyWorld(backupURL)
      resolve(path)
    } catch (error) {
      console.log('Verification failed. Waiting for 30 sec, then re-downloading...')
      await sleep(30000)
      console.log('Retrying...')
      try {
        await downloadAndVerifyWorld(backupURL)
      } catch (error) {
        console.warn(error)
        reject('Failed to download valid world backup')
      }
    }

    // NOTE: port minecraft-realms-map.sh to node.js from this repo: https://github.com/UXVirtual/minecraft-realms-map
    // NOTE: see Realms API here: https://wiki.vg/Realms_API
    // NOTE: see Mojang API here: https://wiki.vg/Mojang_API

    // TODO: make request to REALMS_WORLD_URL to get realm ID
    // TODO: get world backup URL based on realm ID
    // TODO: download world backup zip and attempt up to 2 retries before failing
  })
}

async function downloadAndVerifyWorld(backupURL) {
  let path = await storage.getItem('lastBackup')

  return new Promise(async (resolve, reject) => {
    if (!path) {
      try {
        path = await downloadFromURL(backupURL)
      } catch (error) {
        console.warn('Error while downloading backup. Waiting for 30 sec, then retrying...')
        await sleep(30000)
        console.log('Retrying...')

        try {
          path = await downloadFromURL(backupURL)
        } catch (error) {
          reject('Failed on 2nd retry. Aborting.')
        }
      }
    }

    try {
      await verifyWorldBackup(path)
      console.log('validation successful')
      resolve(path)
    } catch (error) {
      console.log('Verification failed')
      console.warn(error)
      await storage.removeItem('lastBackup')
      reject(error)
    }
  })
}

function constructRealmsHeaders(accessToken, playerUUID) {
  const headers = {
    Cookie: `sid=token:${accessToken}:${playerUUID};user=${process.env.MOJANG_USERNAME};version=${process.env.CLIENT_VERSION}`,
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    'User-Agent': `Java/1.8.0_101`,
    Host: process.env.REALMS_HOST,
    Accept: 'text/html, image/gif, image/jpeg, *; q=.2, */*; q=.2',
    Connection: 'keep-alive',
    'Content-Type': 'application/json',
  }

  return headers
}

async function getWorldBackupURL(realmID) {
  const accessToken = await storage.getItem('accessToken')
  const playerUUID = await storage.getItem('playerUUID')
  const uri = `https://${process.env.REALMS_HOST}/worlds/${realmID}/slot/1/download`
  console.log('Getting world backup url...')
  return new Promise(async (resolve, reject) => {
    const request = {
      method: 'GET',
      uri,
      headers: constructRealmsHeaders(accessToken, playerUUID),
    }

    try {
      // Make the request and return the token
      const response = await rp(request)
      resolve(JSON.parse(response).downloadLink)
    } catch (error) {
      reject(error)
    }
  })
}

async function downloadFromURL(url) {
  const date = moment().format('YYYY-MM-DD')
  const backupPath = `${process.env.BACKUP_PATH}/mcr_world_${date}.tar.gz`
  await storage.setItem('lastBackup', backupPath)

  console.log('Downloading backup...')
  return new Promise((resolve, reject) => {
    const curl = spawn('curl', ['-o', backupPath, '-k', url, '--progress-bar'], {
      stdio: 'inherit',
    })

    curl.on('exit', async function(code) {
      if (code === 0) {
        resolve(backupPath)
      } else {
        reject(`Failed to download backup. Curl exited with code: ${code.toString()}`)
      }
    })
  })
}

async function verifyWorldBackup(path) {
  console.log('Verifying world backup at: ', path)
  return new Promise((resolve, reject) => {
    let output
    try {
      output = execSync(`tar -xvzf "${path}" -O > /dev/null`)
    } catch (error) {
      reject(error.stdout)
    }

    resolve(output)
  })
}

async function extractWorldBackup(backupPath) {
  const extractPath = process.env.WORLD_PATH
  console.log(`Extracting world backup to: ${extractPath}`)
  return new Promise((resolve, reject) => {
    let output
    try {
      output = execSync(`tar -xvf "${backupPath}" ${extractPath}`)
    } catch (error) {
      reject(error.stdout)
    }

    resolve(output)
  })
}

async function getRealmsServers() {
  const accessToken = await storage.getItem('accessToken')
  const playerUUID = await storage.getItem('playerUUID')
  console.log('Getting realm details')
  return new Promise(async (resolve, reject) => {
    const request = {
      method: 'GET',
      uri: `https://${process.env.REALMS_HOST}/worlds`,
      headers: constructRealmsHeaders(accessToken, playerUUID),
    }

    try {
      // Make the request and return the token
      const response = await rp(request)
      resolve(JSON.parse(response).servers)
    } catch (error) {
      reject(error)
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

      await storage.setItem('tempAccessToken', authData.accessToken)
      await storage.setItem('clientToken', authData.clientToken)

      resolve(authData.accessToken)
    } catch (error) {
      reject(error)
    }
  })
}

async function init() {
  // you must first call storage.init
  await storage.init()
  const accessToken = await storage.getItem('accessToken')
  if (accessToken) {
    console.log('Using access token from storage...')
  } else {
    await storeAccessToken()
    await storeRefreshToken()
    await storeUUID()
  }

  let path

  try {
    path = await downloadWorldBackup()
    console.log(`Valid world backup downloaded to: ${path}`)
  } catch (error) {
    console.log('Failed to download world backup')
    console.error(error)
  }

  try {
    await extractWorldBackup(path)
    console.log(`Successfully extracted world backup to: ${process.env.WORLD_PATH}`)
  } catch (error) {
    console.log('Failed to extract world backup')
    console.error(error)
  }

  // TODO: extract world backup to disk
  // TODO: clean old backups from disk
  // TODO: trigger Minecraft Overviewer to generate map
  // TODO: use AWS API to sync map to S3 bucket
  // TODO: clean logs older than 7 days
}

init()
