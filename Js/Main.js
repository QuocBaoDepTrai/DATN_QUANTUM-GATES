let chartInstance;
let complexChartInstance;
// Hàm mô phỏng với ma trận bất kỳ
function simulateGate(matrix, label, colors) {
  const input = document.getElementById("inputState").value;
 // Dùng vector đầu vào là số phức
  const ketVectors = {
    "0": [math.complex(1, 0), math.complex(0, 0)],
    "1": [math.complex(0, 0), math.complex(1, 0)],
  };
  const inputVector = ketVectors[input];
  // Nhân ma trận với vector input
  const result = matrix.map(row =>
    row.reduce((sum, val, i) =>
      math.add(sum, typeof val === "number"
        ? val * inputVector[i]
        : math.multiply(val, inputVector[i])
      ),
      math.complex(0, 0)
    )
  );
  // === Biểu đồ Hadamard 1: Biên độ |c| ===
  const ctx = document.getElementById("stateChart").getContext("2d");
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["|0⟩", "|1⟩"],
      datasets: [{
        label: label,
        data: result.map(c => math.abs(c)),
        backgroundColor: colors,
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, max: 1 }
      }
    }
  });
  // === Biểu đồ Hadamard 2: Complex amplitudes ===
  const complexCtx = document.getElementById("complexChart").getContext("2d");
  if (complexChartInstance) complexChartInstance.destroy();

  complexChartInstance = new Chart(complexCtx, {
    type: "bar",
    data: {
      labels: ["|0⟩", "|1⟩"],
      datasets: [
        {
          label: "Phần thực (Re)",
          data: [result[0].re, result[1].re],
          backgroundColor: "#facc15"
        },
        {
          label: "Phần ảo (Im)",
          data: [result[0].im, result[1].im],
          backgroundColor: "#60a5fa"
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          suggestedMin: -1,
          suggestedMax: 1
        }
      }
    }
  });
}

// Cổng lượng tử
function simulateHadamard() {
  const hadamard = [
    [1 / Math.sqrt(2), 1 / Math.sqrt(2)],
    [1 / Math.sqrt(2), -1 / Math.sqrt(2)]
  ];
  simulateGate(hadamard, "Biên độ (Hadamard)", ["#3b82f6", "#10b981"]);
}

function simulatePauliX() {
  const pauliX = [
    [0, 1],
    [1, 0]
  ];
  simulateGate(pauliX, "Biên độ (Pauli-X)", ["#f59e0b", "#8b5cf6"]);
}

function simulatePauliY() {
  const pauliY = [
    [math.complex(0, 0), math.complex(0, -1)],
    [math.complex(0, 1), math.complex(0, 0)]
  ];
  simulateGate(pauliY, "Biên độ (Pauli-Y)", ["#6366f1", "#ec4899"]);
}

function simulatePauliZ() {
  const pauliZ = [
    [1, 0],
    [0, -1]
  ];
  simulateGate(pauliZ, "Biên độ (Pauli-Z)", ["#f87171", "#60a5fa"]);
}

function simulateGateS() {
  const S = [
    [1, 0],
    [0, math.complex(0, 1)]  // i
  ];
  simulateGate(S, "Biên độ (S)", ["#34d399", "#f472b6"]);
}


// Hiệu ứng scroll xuất hiện Layer
window.addEventListener("scroll", () => {
  const slide = document.getElementById("slideUpPage");
  const isAtBottom = window.scrollY + window.innerHeight >= document.body.offsetHeight - 10;

  slide.classList.toggle("bottom-0", isAtBottom);
  slide.classList.toggle("bottom-[-100%]", !isAtBottom);
}
);


