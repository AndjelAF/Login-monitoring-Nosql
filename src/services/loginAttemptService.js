import {
  recordFailedLogin,
  isBlocked,
  clearLoginAttempts
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
