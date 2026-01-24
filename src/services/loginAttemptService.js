import {
  recordFailedLogin,
  isBlocked,
  clearLoginAttempts,
  recordFailedLoginByIp,
  isIpBlocked
} from "../redis/loginMonitor.js";

export async function handleFailedLogin(username, ip) {
  return await recordFailedLogin(username, ip);
}

export async function checkIfBlocked(username, ip) {
  return await isBlocked(username, ip);
}

export async function handleSuccessfulLogin(username, ip) {
  await clearLoginAttempts(username, ip);
}
export async function handleFailedLoginByIp(ip) {
  return await recordFailedLoginByIp(ip);
}

export async function checkIfIpBlocked(ip) {
  return await isIpBlocked(ip);
}

