import driver from "./neo4jDriver.js";

export async function logLoginAttempt(username, ip, success) {
  const session = driver.session();

  try {
    await session.run(
      `
      MERGE (u:User {username: $username})
      MERGE (i:IP {address: $ip})
      CREATE (a:LoginAttempt {
        time: datetime(),
        success: $success
      })
      MERGE (u)-[:ATTEMPTED]->(a)
      MERGE (a)-[:FROM_IP]->(i)
      `,
      { username, ip, success }
    );
  } finally {
    await session.close();
  }
}
