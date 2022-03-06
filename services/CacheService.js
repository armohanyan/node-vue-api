const {
  createClient
} = require('redis');

const client = createClient();

client.connect().then().catch();

client.on('connect', () => {
  console.log('connect')
});

module.exports = class CacheService {
  constructor() {

  }

  static async setToken(key, value) {
    await client.expireAt(key,10)
    await client.set(key, value)
    return {}
  }

  static async getToken(key) {
    let data = await client.get(key);
    return data
  }

  static isTokenExist(key) {
    return true
  }


}