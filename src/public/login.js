async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const resultDiv = document.getElementById("result");

  resultDiv.innerText = "Loading...";

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    resultDiv.innerText = data.message;

    if (data.attempts !== undefined) {
      resultDiv.innerText += ` | Attempts: ${data.attempts}`;
    }

    if (data.blocked) {
      resultDiv.innerText += " | BLOCKED";
    }

  } catch (err) {
    resultDiv.innerText = "Server error";
  }
}
