import driver from "./neo4jDriver.js";

/**
 * IP adrese koje su pokušale login za više korisnika
 */
export async function getIpsWithMultipleUsers(minUsers = 2) {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (i:IP)<-[:FROM_IP]-(a:LoginAttempt)<-[:ATTEMPTED]-(u:User)
      WITH i.address AS ip, collect(DISTINCT u.username) AS users
      WHERE size(users) >= $minUsers
      RETURN ip, users, size(users) AS userCount
      ORDER BY userCount DESC
      `,
      { minUsers }
    );

    return result.records.map(r => ({
      ip: r.get("ip"),
      users: r.get("users"),
      userCount: r.get("userCount").toNumber()
    }));
  } finally {
    await session.close();
  }
}

/**
 * Korisnici koji se loguju sa vise IP adresa
 */
export async function getUsersWithMultipleIps(minIps = 2) {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (u:User)-[:ATTEMPTED]->(a:LoginAttempt)-[:FROM_IP]->(i:IP)
      WITH u.username AS username, collect(DISTINCT i.address) AS ips
      WHERE size(ips) >= $minIps
      RETURN username, ips, size(ips) AS ipCount
      ORDER BY ipCount DESC
      `,
      { minIps }
    );

    return result.records.map(r => ({
      username: r.get("username"),
      ips: r.get("ips"),
      ipCount: r.get("ipCount").toNumber()
    }));
  } finally {
    await session.close();
  }
}


/**
 * IP adrese sa velikim brojem neuspelih logovanja
 */
export async function getSuspiciousIps(minFailures = 5) {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (i:IP)<-[:FROM_IP]-(a:LoginAttempt)
      WHERE a.success = false
      WITH i.address AS ip, count(a) AS failures
      WHERE failures >= $minFailures
      RETURN ip, failures
      ORDER BY failures DESC
      `,
      { minFailures }
    );

    return result.records.map(r => ({
      ip: r.get("ip"),
      failures: r.get("failures").toNumber()
    }));
  } finally {
    await session.close();
  }
}
