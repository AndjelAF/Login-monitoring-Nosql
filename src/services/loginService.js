import {
  handleFailedLogin,
  handleSuccessfulLogin,
  checkIfBlocked
} from "./loginAttemptService.js";

/**
 * Centralna login logika
 * Ovde se kasnije kace:
 * - prava baza korisnika
 * - bcrypt / argon2
 * - Neo4j analiza ponasanja
 */
export async function login(username, password, ip) {

  //  Provera blokade (username + IP)
  const blocked = await checkIfBlocked(username, ip);
  if (blocked) {
    return {
      status: 403,
      message: "User temporarily blocked from this IP due to too many failed attempts"
    };
  }

  /**
   *  SIMULACIJA AUTENTIFIKACIJE
   * Kasnije:
   * - fetch user from DB
   * - bcrypt.compare(...)
   */
  const CORRECT_PASSWORD = "secret123";

  if (password !== CORRECT_PASSWORD) {
    const result = await handleFailedLogin(username, ip);

    return {
      status: 401,
      message: "Invalid credentials",
      attempts: result.attempts,
      blocked: result.blocked
    };
  }

  //  Uspesan login- reset Redis state-a
  await handleSuccessfulLogin(username, ip);

  return {
    status: 200,
    message: "Login successful"
  };
}
