import driver from "../neo4j/neo4jDriver.js";

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


/**
 * Dashboard statistika
 */
export async function getStatistics() {
  const session = driver.session();

  try {

    // ukupni login attemptovi
    const totalResult = await session.run(`
      MATCH (a:LoginAttempt)
      RETURN count(a) AS total
    `);

    // neuspesni login attemptovi
    const failedResult = await session.run(`
      MATCH (a:LoginAttempt)
      WHERE a.success = false
      RETURN count(a) AS failed
    `);

    // uspesni login attemptovi
    const successResult = await session.run(`
      MATCH (a:LoginAttempt)
      WHERE a.success = true
      RETURN count(a) AS successful
    `);

    // suspicious IP count
    const suspiciousResult = await session.run(`
      MATCH (i:IP)<-[:FROM_IP]-(a:LoginAttempt)
      WHERE a.success = false
      WITH i, count(a) AS failures
      WHERE failures >= 5
      RETURN count(i) AS suspiciousIps
    `);

    return {
      totalAttempts: totalResult.records[0].get("total").toNumber(),
      failedAttempts: failedResult.records[0].get("failed").toNumber(),
      successfulAttempts: successResult.records[0].get("successful").toNumber(),
      suspiciousIps: suspiciousResult.records[0].get("suspiciousIps").toNumber()
    };

  } finally {
    await session.close();
  }
}


/**
 * Detekcija attack pattern-a
 */
export async function getAttackPatterns() {

  const session = driver.session();

  try {

    const patterns = [];

    // 1. Credential Stuffing
    const stuffingResult = await session.run(`
      MATCH (i:IP)<-[:FROM_IP]-(a:LoginAttempt)<-[:ATTEMPTED]-(u:User)
      WITH i.address AS ip, collect(DISTINCT u.username) AS users
      WHERE size(users) >= 3
      RETURN ip, size(users) AS userCount
      ORDER BY userCount DESC
    `);

    stuffingResult.records.forEach(r => {
      patterns.push({
        type: "Credential Stuffing",
        target: r.get("ip"),
        details: `${r.get("userCount").toNumber()} different users`
      });
    });


    // 2. Brute Force
    const bruteForceResult = await session.run(`
      MATCH (i:IP)<-[:FROM_IP]-(a:LoginAttempt)
      WHERE a.success = false
      WITH i.address AS ip, count(a) AS failures
      WHERE failures >= 5
      RETURN ip, failures
      ORDER BY failures DESC
    `);

    bruteForceResult.records.forEach(r => {
      patterns.push({
        type: "Brute Force",
        target: r.get("ip"),
        details: `${r.get("failures").toNumber()} failed attempts`
      });
    });


    // 3. Suspicious User Access
    const suspiciousUsers = await session.run(`
      MATCH (u:User)-[:ATTEMPTED]->(a:LoginAttempt)-[:FROM_IP]->(i:IP)
      WITH u.username AS username, collect(DISTINCT i.address) AS ips
      WHERE size(ips) >= 3
      RETURN username, size(ips) AS ipCount
      ORDER BY ipCount DESC
    `);

    suspiciousUsers.records.forEach(r => {
      patterns.push({
        type: "Suspicious User Access",
        target: r.get("username"),
        details: `${r.get("ipCount").toNumber()} different IP addresses`
      });
    });

    return patterns;

  } finally {

    await session.close();
  }
}