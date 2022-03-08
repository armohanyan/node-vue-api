const  redis  = require("redis");
// const client = createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
const client = redis.createClient();

async function connectToRedis () {
  await client.connect();
}
connectToRedis().then(r => console.log("connected!!")).catch( err => console.log(err))

module.exports = class CacheService {
    static async setToken(key, value) {
      await client.set(key, value, {
        EX: 120
      });
    }

  static async getToken(key) {
      const data = await client.get(key);
      if (data) {
        return true
      } else {
        return false
      }
    };
}
