import { SetOptions, createClient } from 'redis';
import config from '../config';

const redisClient = createClient({
  url: config.redis.url,
});
const redisPubClient = createClient({
  url: config.redis.url,
});
const redisSubClient = createClient({
  url: config.redis.url,
});

redisClient.on('error', error => console.log('RedisErrror', error));

redisClient.on('connect', () => console.log('Redis Connected'));

const connect = async (): Promise<void> => {
  await redisClient.connect();
  await redisPubClient.connect();
  await redisSubClient.connect();
};

const set = async (
  key: string,
  value: string,
  options?: SetOptions
): Promise<void> => {
  await redisClient.set(key, value, options);
};

const get = async (key: string): Promise<string | null> => {
  return await redisClient.get(key);
};
const del = async (key: string): Promise<void> => {
  await redisClient.del(key);
};

const setAccessToken = async (userid: string, token: string): Promise<void> => {
  const key = `access-token:${userid}`;
  await redisClient.set(key, token, { EX: Number(config.redis.expires_in) });
};

const getAccessToken = async (userid: string): Promise<string | null> => {
  const key = `access-token:${userid}`;
  return await redisClient.get(key);
};

const deleteAccessToken = async (userid: string): Promise<void> => {
  const key = `access-token:${userid}`;
  await redisClient.del(key);
};

const disconnect = async (): Promise<void> => {
  await redisClient.quit();
  await redisPubClient.quit();
  await redisSubClient.quit();
};

export const RedisClient = {
  set,
  get,
  del,
  disconnect,
  getAccessToken,
  setAccessToken,
  deleteAccessToken,
  connect,
  publish: redisPubClient.publish.bind(redisPubClient),
  subscribe: redisSubClient.subscribe.bind(redisSubClient),
};
