import redisClient from "./redisClient.js";

const MAX_IP_ATTEMPTS = 20;
const IP_ATTEMPT_WINDOW = 600; // 10 min
const IP_BLOCK_TIME = 900;     // 15 min

const MAX_ATTEMPTS = 5;
const ATTEMPT_WINDOW = 600; // 10 min
const BLOCK_TIME = 900;     // 15 min

function getAttemptsKey(username, ip) {
  return `login:attempts:${username}:${ip}`;
}

function getBlockedKey(username, ip) {
  return `login:blocked:${username}:${ip}`;
}
function getIpAttemptsKey(ip) {
  return `login:ip:attempts:${ip}`;
}

function getIpBlockedKey(ip) {
  return `login:ip:blocked:${ip}`;
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

export async function recordFailedLoginByIp(ip) {
  const attemptsKey = getIpAttemptsKey(ip);
  const blockKey = getIpBlockedKey(ip);

  const attempts = await redisClient.incr(attemptsKey);

  if (attempts === 1) {
    await redisClient.expire(attemptsKey, IP_ATTEMPT_WINDOW);
  }

  if (attempts >= MAX_IP_ATTEMPTS) {
    await redisClient.set(blockKey, "blocked", {
      EX: IP_BLOCK_TIME
    });
  }

  return {
    attempts,
    blocked: attempts >= MAX_IP_ATTEMPTS
  };
}

export async function isIpBlocked(ip) {
  return (await redisClient.exists(getIpBlockedKey(ip))) === 1;
}

