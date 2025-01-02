const ctx = document.getElementById('myChart').getContext('2d');

    // Data untuk Chart
    const data = {
      labels: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
      datasets: [
        // Kolom (Bar)
        {
          type: 'bar',
          label: 'Data Kolom 1',
          data: [50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 300, 200],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        },
        {
          type: 'bar',
          label: 'Data Kolom 2',
          data: [40, 90, 140, 190, 240, 290, 340, 390, 440, 490, 290, 190],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          type: 'bar',
          label: 'Data Kolom 3',
          data: [30, 80, 130, 180, 230, 280, 330, 380, 430, 480, 280, 180],
          backgroundColor: 'rgba(255, 206, 86, 0.5)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1
        },
        {
          type: 'bar',
          label: 'Data Kolom 4',
          data: [20, 70, 120, 170, 220, 270, 320, 370, 420, 470, 270, 170],
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        },
        // Line (Garis)
        {
          type: 'line',
          label: 'Data Garis 1',
          data: [60, 110, 160, 210, 260, 310, 360, 410, 460, 510, 310, 210],
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 2,
          fill: false
        },
        {
          type: 'line',
          label: 'Data Garis 2',
          data: [70, 120, 170, 220, 270, 320, 370, 420, 470, 520, 320, 220],
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 2,
          fill: false
        },
        {
          type: 'line',
          label: 'Data Garis 3',
          data: [80, 130, 180, 230, 280, 330, 380, 430, 480, 530, 330, 230],
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          fill: false
        },
        {
          type: 'line',
          label: 'Data Garis 4',
          data: [90, 140, 190, 240, 290, 340, 390, 440, 490, 540, 340, 240],
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          fill: false
        }
      ]
    };

    // Konfigurasi Chart
    const config = {
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                labels: {
                    font: {
                    size: 14, // Ukuran font untuk legenda
                    weight: 'bold' // Menebalkan teks legenda
                    }
                }
                },
                tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                    return `Rp ${tooltipItem.raw} juta`;
                    }
                }
                }
            },
            scales: {
                x: {
                title: {
                    display: true,
                    text: 'Bulan',
                    font: {
                    size: 16, // Ukuran font untuk judul sumbu X
                    weight: 'bold'
                    }
                },
                ticks: {
                    font: {
                    size: 12 // Ukuran font untuk label bulan
                    }
                }
                },
                y: {
                title: {
                    display: true,
                    text: 'Mata Uang (Rupiah)',
                    font: {
                    size: 16, // Ukuran font untuk judul sumbu Y
                    weight: 'bold'
                    }
                },
                ticks: {
                    font: {
                    size: 12 // Ukuran font untuk nilai pada sumbu Y
                    },
                    callback: function (value) {
                    return `Rp ${value} juta`;
                    },
                    stepSize: 50,
                    max: 500
                }
                }
            }
        }
    };

    // Render Chart
    new Chart(ctx, config);