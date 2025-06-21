let chartInstance;

// Xử lý nhân ma trận với vector (hỗ trợ cả số thực và số phức)
function simulateGate(matrix, label, colors) {
  const input = document.getElementById("inputState").value;
  const ket0 = [1, 0];
  const ket1 = [0, 1];
  const inputVector = input === "0" ? ket0 : ket1;

  const result = matrix.map(row =>
    row.reduce(
      (sum, val, i) =>
        math.add(
          sum,
          typeof val === "number"
            ? val * inputVector[i]
            : math.multiply(val, inputVector[i])
        ),
      math.complex ? math.complex(0, 0) : 0
    )
  );

  const ctx = document.getElementById("stateChart").getContext("2d");
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["|0⟩", "|1⟩"],
      datasets: [{
        label: label,
        data: result.map(c => math.abs ? math.abs(c) : Math.abs(c)),
        backgroundColor: colors,
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true, max: 1 }
      }
    }
  });
}

// Các hàm riêng cho từng cổng

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
 let hasShown = false;

  window.addEventListener("scroll", () => {
  const slide = document.getElementById("slideUpPage");
  const isAtBottom = window.scrollY + window.innerHeight >= document.body.offsetHeight - 10;

  if (isAtBottom) {
    slide.classList.remove("bottom-[-100%]");
    slide.classList.add("bottom-0");
  } else {
    slide.classList.remove("bottom-0");
    slide.classList.add("bottom-[-100%]");
  }
});

