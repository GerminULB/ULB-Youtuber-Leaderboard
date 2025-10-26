// -------------------
// Sortable Table
// -------------------
function sortTable(n) {
  const table = document.getElementById("leaderboard");
  let rows = Array.from(table.rows).slice(1);
  let asc = true;

  rows.sort((a, b) => {
    let x = a.cells[n].innerText;
    let y = b.cells[n].innerText;

    if(!isNaN(x) && !isNaN(y)) { x = parseInt(x); y = parseInt(y); }

    return asc ? x - y : y - x;
  });

  asc = !asc;
  rows.forEach(row => table.appendChild(row));
}

// -------------------
// Example Graph (Subscriber Growth)
// -------------------
// In production, you’d read CSV data or pass historical stats from Flask
const labels = ["2025-10-20", "2025-10-21", "2025-10-22", "2025-10-23"];
const data = {
  labels: labels,
  datasets: [
    {
      label: 'Your Channel',
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      data: [540, 560, 580, 600],
    },
    {
      label: 'Friend 1',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      borderColor: 'rgba(255, 99, 132, 1)',
      data: [420, 430, 440, 450],
    }
  ]
};

const config = {
  type: 'line',
  data: data,
  options: {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Subscribers Over Time' }
    }
  },
};

new Chart(
  document.getElementById('subsChart'),
  config
);
