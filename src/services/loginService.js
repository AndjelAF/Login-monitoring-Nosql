import {
  handleFailedLogin,
  handleSuccessfulLogin,
  checkIfBlocked,
  checkIfIpBlocked,
  handleFailedLoginByIp
} from "./loginAttemptService.js";

import { logLoginAttempt } from "../neo4j/loginGraphService.js";

/**
 * Centralna login logika
 * Monitoring hipotetičkog sistema
 */
export async function login(username, password, ip) {

  //  Globalna IP blokada
  const ipBlocked = await checkIfIpBlocked(ip);
  if (ipBlocked) {
    return {
      status: 403,
      message: "IP temporarily blocked due to suspicious activity"
    };
  }

  //  User + IP blokada
  const blocked = await checkIfBlocked(username, ip);
  if (blocked) {
    return {
      status: 403,
      message: "User temporarily blocked from this IP due to too many failed attempts"
    };
  }

  //  SIMULACIJA AUTENTIFIKACIJE
  const CORRECT_PASSWORD = "secret123";

  if (password !== CORRECT_PASSWORD) {
    const result = await handleFailedLogin(username, ip);

    await handleFailedLoginByIp(ip);
    await logLoginAttempt(username, ip, false);

    return {
      status: 401,
      message: "Invalid credentials",
      attempts: result.attempts,
      blocked: result.blocked
    };
  }

  //  Uspešan login
  await handleSuccessfulLogin(username, ip);
  await logLoginAttempt(username, ip, true);

  return {
    status: 200,
    message: "Login successful"
  };
}
