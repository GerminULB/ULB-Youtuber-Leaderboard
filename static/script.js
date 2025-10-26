// -------------------
// Sortable Table
// -------------------
function sortTable(n) {
  const table = document.getElementById("leaderboard");
  let rows = Array.from(table.rows).slice(1);
  let asc = true;

  rows.sort((a, b) => {
    let x = a.cells[n].innerText.replace(/,/g, '');
    let y = b.cells[n].innerText.replace(/,/g, '');

    if(!isNaN(x) && !isNaN(y)) { x = parseInt(x); y = parseInt(y); }

    return asc ? x - y : y - x;
  });

  asc = !asc;
  rows.forEach(row => table.appendChild(row));
}

// -------------------
// Fetch historical data and draw charts
// -------------------
async function drawCharts() {
    const response = await fetch("/history");
    const data = await response.json(); // { "Your Channel": [...], "Friend 1": [...] }

    const labels = data[Object.keys(data)[0]].map(entry => entry.Date); // Dates
    const datasets = [];

    const colors = ["rgba(54,162,235,0.5)", "rgba(255,99,132,0.5)", "rgba(75,192,192,0.5)"];

    Object.keys(data).forEach((channel, idx) => {
        datasets.push({
            label: channel,
            data: data[channel].map(entry => entry.Subscribers),
            backgroundColor: colors[idx % colors.length],
            borderColor: colors[idx % colors.length].replace("0.5", "1"),
            fill: false,
            tension: 0.2
        });
    });

    const ctx = document.getElementById('subsChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: { labels, datasets },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Subscribers Over Time' }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// Call the function
drawCharts();
