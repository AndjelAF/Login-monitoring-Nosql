// testLogins.js

const URL = "http://localhost:3000/api/login";

async function login(username, password, ip) {
  const res = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip
    },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  console.log(username, ip, data.message);
}

async function runTest() {
  await login("ana", "wrong", "10.0.0.1");
  await login("maja", "wrong", "10.0.0.1");
  await login("jana", "wrong", "10.0.0.1");

  await login("lana", "wrong", "192.168.1.5");
  await login("lana", "wrong", "192.168.1.6");

  for (let i = 0; i < 6; i++) {
    await login("hacker", "wrong", "66.66.66.66");
  }

  console.log("Test finished");
}

runTest();
