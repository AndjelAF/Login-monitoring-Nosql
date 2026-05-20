async function loadStatistics() {

  const res = await fetch("/admin/stats");
  const data = await res.json();

  document.getElementById("total-attempts")
    .innerText = data.totalAttempts;

  document.getElementById("failed-attempts")
    .innerText = data.failedAttempts;

  document.getElementById("successful-attempts")
    .innerText = data.successfulAttempts;

  document.getElementById("suspicious-ips-count")
    .innerText = data.suspiciousIps;
}


async function loadBlocked() {

  const res = await fetch("/admin/blocked");
  const data = await res.json();

  const tbody =
    document.getElementById("blocked-body");

  tbody.innerHTML = "";

  data.forEach(item => {

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.username}</td>
      <td>${item.ip}</td>
      <td>
        <span class="badge badge-warning">
          ${item.ttl}s
        </span>
      </td>
    `;

    tbody.appendChild(row);
  });
}


async function loadAnalytics() {

  const res = await fetch("/admin/analytics");
  const data = await res.json();

  // =========================
  // IPs with multiple users
  // =========================

  const ipUsersBody =
    document.getElementById("ip-users-body");

  ipUsersBody.innerHTML = "";

  data.ipsWithMultipleUsers.forEach(item => {

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.ip}</td>
      <td>${item.users.join(", ")}</td>
      <td>
        <span class="badge badge-info">
          ${item.userCount}
        </span>
      </td>
    `;

    ipUsersBody.appendChild(row);
  });


  // =========================
  // Users with multiple IPs
  // =========================

  const userIpsBody =
    document.getElementById("user-ips-body");

  userIpsBody.innerHTML = "";

  data.usersWithMultipleIps.forEach(item => {

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.username}</td>
      <td>${item.ips.join(", ")}</td>
      <td>
        <span class="badge badge-info">
          ${item.ipCount}
        </span>
      </td>
    `;

    userIpsBody.appendChild(row);
  });


  // =========================
  // Suspicious IPs
  // =========================

  const suspiciousBody =
    document.getElementById("suspicious-body");

  suspiciousBody.innerHTML = "";

  data.suspiciousIps.forEach(item => {

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.ip}</td>
      <td>
        <span class="badge badge-danger">
          ${item.failures}
        </span>
      </td>
    `;

    suspiciousBody.appendChild(row);
  });


  // =========================
  // Attack Patterns
  // =========================

  const attackBody =
    document.getElementById("attack-patterns-body");

  attackBody.innerHTML = "";

  data.attackPatterns.forEach(item => {

    let badgeClass = "badge-info";

    if (item.type === "Brute Force") {
      badgeClass = "badge-danger";
    }

    if (item.type === "Credential Stuffing") {
      badgeClass = "badge-warning";
    }

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>
        <span class="badge ${badgeClass}">
          ${item.type}
        </span>
      </td>

      <td>${item.target}</td>

      <td>${item.details}</td>
    `;

    attackBody.appendChild(row);
  });
}


// INIT
loadStatistics();
loadBlocked();
loadAnalytics();