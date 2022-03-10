const  redis  = require("redis");
const client = redis.createClient();

async function connectToRedis () {
  await client.connect();
}
connectToRedis().then( () => console.log("connected!!")).catch(err => { throw err });

module.exports = class CacheService {

    static async setToken(key, value) {
      await client.set(key, value, {
        EX: 120
      });
    }

  static async getToken(key) {
      const token = await client.get(key);
      if (token) {
        return token
      } else {
        return false
      }
    };
}
