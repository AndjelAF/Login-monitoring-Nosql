async function loadBlocked() {
  const res = await fetch("/admin/blocked");
  const data = await res.json();

  const tbody = document.getElementById("blocked-body");
  tbody.innerHTML = "";

  data.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.username}</td>
      <td>${item.ip}</td>
      <td>${item.ttl}</td>
    `;
    tbody.appendChild(row);
  });
}

async function loadAnalytics() {
  const res = await fetch("/admin/analytics");
  const data = await res.json();

  // IPs with multiple users
  const ipUsersBody = document.getElementById("ip-users-body");
  ipUsersBody.innerHTML = "";
  data.ipsWithMultipleUsers.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.ip}</td>
      <td>${item.users.join(", ")}</td>
      <td>${item.userCount}</td>
    `;
    ipUsersBody.appendChild(row);
  });

  // Users with multiple IPs
  const userIpsBody = document.getElementById("user-ips-body");
  userIpsBody.innerHTML = "";
  data.usersWithMultipleIps.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.username}</td>
      <td>${item.ips.join(", ")}</td>
      <td>${item.ipCount}</td>
    `;
    userIpsBody.appendChild(row);
  });

  // Suspicious IPs
  const suspiciousBody = document.getElementById("suspicious-body");
  suspiciousBody.innerHTML = "";
  data.suspiciousIps.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.ip}</td>
      <td>${item.failures}</td>
    `;
    suspiciousBody.appendChild(row);
  });
}

// INIT
loadBlocked();
loadAnalytics();
