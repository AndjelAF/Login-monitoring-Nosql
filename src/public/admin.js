async function loadBlocked() {
  const res = await fetch("/admin/blocked");
  const data = await res.json();

  const tbody = document.getElementById("table-body");
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

loadBlocked();
