import redisClient from "./redisClient.js";

const MAX_ATTEMPTS = 5;
const ATTEMPT_WINDOW = 600; // 10 min
const BLOCK_TIME = 900;     // 15 min

function getAttemptsKey(username, ip) {
  return `login:attempts:${username}:${ip}`;
}

function getBlockedKey(username, ip) {
  return `login:blocked:${username}:${ip}`;
}

export async function recordFailedLogin(username, ip) {
  const attemptsKey = getAttemptsKey(username, ip);
  const blockKey = getBlockedKey(username, ip);

  const attempts = await redisClient.incr(attemptsKey);

  if (attempts === 1) {
    await redisClient.expire(attemptsKey, ATTEMPT_WINDOW);
  }

  if (attempts >= MAX_ATTEMPTS) {
    await redisClient.set(blockKey, "blocked", {
      EX: BLOCK_TIME
    });
  }

  return {
    attempts,
    blocked: attempts >= MAX_ATTEMPTS
  };
}

export async function isBlocked(username, ip) {
  const blockKey = getBlockedKey(username, ip);
  return (await redisClient.exists(blockKey)) === 1;
}

export async function clearLoginAttempts(username, ip) {
  await redisClient.del(getAttemptsKey(username, ip));
  await redisClient.del(getBlockedKey(username, ip));
}
