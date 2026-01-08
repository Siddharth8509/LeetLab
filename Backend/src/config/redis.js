import redis from "redis";
import dotenv from "dotenv";
dotenv.config();

const redisClient = redis.createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-15582.crce263.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 15582
    }
})

export default redisClient;