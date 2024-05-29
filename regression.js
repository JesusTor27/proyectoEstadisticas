let chart; // Variable para almacenar el gráfico

document.getElementById('inputX').addEventListener('input', function (e) {
    this.value = this.value.replace(/[^0-9.,]/g, '');
});
document.getElementById('inputY').addEventListener('input', function (e) {
    this.value = this.value.replace(/[^0-9.,]/g, '');
});

function calcularRegresion() {
    const inputX = document.getElementById('inputX').value;
    const inputY = document.getElementById('inputY').value;

    if (inputX.trim() === "" || inputY.trim() === "") {
        alert("Los campos de entrada no deben estar vacíos.");
        return;
    }

    const xValues = inputX.split(',').map(x => parseFloat(x));
    const yValues = inputY.split(',').map(y => parseFloat(y));

    if (xValues.length !== yValues.length) {
        alert("Las listas deben tener la misma longitud.");
        return;
    }

    const n = xValues.length;
    const xMean = xValues.reduce((a, b) => a + b, 0) / n;
    const yMean = yValues.reduce((a, b) => a + b, 0) / n;

    let sumXiX = 0, sumYiY = 0, sumXiXYiY = 0, sumXiX2 = 0, sumYiY2 = 0, sumYiHatY = 0;
    let sumX = 0, sumY = 0;

    const tbody = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';

    xValues.forEach((xi, i) => {
        const yi = yValues[i];
        const xi_x = xi - xMean;
        const yi_y = yi - yMean;
        const xi_x_yi_y = xi_x * yi_y;
        const xi_x2 = xi_x * xi_x;
        const yi_y2 = yi_y * yi_y;

        sumXiX += xi_x;
        sumYiY += yi_y;
        sumXiXYiY += xi_x_yi_y;
        sumXiX2 += xi_x2;
        sumYiY2 += yi_y2;
        sumX += xi;
        sumY += yi;

        const row = tbody.insertRow();
        row.insertCell(0).innerText = i + 1;
        row.insertCell(1).innerText = xi.toFixed(2);
        row.insertCell(2).innerText = yi.toFixed(2);
        row.insertCell(3).innerText = xi_x.toFixed(2);
        row.insertCell(4).innerText = yi_y.toFixed(2);
        row.insertCell(5).innerText = xi_x_yi_y.toFixed(2);
        row.insertCell(6).innerText = xi_x2.toFixed(2);
        row.insertCell(7).innerText = yi_y2.toFixed(2);
    });

    const b1 = sumXiXYiY / sumXiX2;
    const b0 = yMean - b1 * xMean;

    const regressionPoints = xValues.map(xi => b0 + b1 * xi);

    xValues.forEach((xi, i) => {
        const yiHat = b0 + b1 * xi;
        const yiHat_y = yiHat - yMean;
        const yiHat_y2 = yiHat_y * yiHat_y;
        sumYiHatY += yiHat_y2;

        tbody.rows[i].insertCell(8).innerText = yiHat.toFixed(2);
        tbody.rows[i].insertCell(9).innerText = yiHat_y2.toFixed(2);
    });

    const summaryRow = tbody.insertRow();
    summaryRow.insertCell(0).innerText = 'Sum / Promedio';
    summaryRow.insertCell(1).innerText = (sumX / n).toFixed(3);
    summaryRow.insertCell(2).innerText = (sumY / n).toFixed(3);
    summaryRow.insertCell(3).innerText = (sumXiX).toFixed(3);
    summaryRow.insertCell(4).innerText = (sumYiY).toFixed(3);
    summaryRow.insertCell(5).innerText = (sumXiXYiY).toFixed(3);
    summaryRow.insertCell(6).innerText = (sumXiX2).toFixed(3);
    summaryRow.insertCell(7).innerText = (sumYiY2).toFixed(3);
    summaryRow.insertCell(8).innerText = '';
    summaryRow.insertCell(9).innerText = (sumYiHatY).toFixed(2);

    const r2 = sumYiHatY / sumYiY2;

    document.getElementById('b0').innerText = b0.toFixed(2);
    document.getElementById('b1').innerText = b1.toFixed(3);
    document.getElementById('r2').innerText = r2.toFixed(2);

    const evaluationMessage = document.getElementById('evaluationMessage');
    if (r2 < 0.5) {
        evaluationMessage.innerText = "Se rechaza porque es un mal modelo. R² < 0.5";
        evaluationMessage.style.color = "red";
    } else if (0.5 <= r2 && r2 <= 0.7) {
        evaluationMessage.innerText = "Es un modelo Regular. 0.5 ≤ R² ≤ 0.7";
        evaluationMessage.style.color = "orange";
    } else {
        evaluationMessage.innerText = "Es un Buen modelo. R² > 0.7";
        evaluationMessage.style.color = "green";
    }

    const formula = document.getElementById('formula');
    if (b1 >= 0) {
        formula.innerText = "Y = " + b0.toFixed(2) + " + " + b1.toFixed(2) + " × X";
    } else {
        formula.innerText = "Y = " + b0.toFixed(2) + b1.toFixed(2) + " × X";
    }

    const ctx = document.getElementById('regressionChart').getContext('2d');
    if (chart) {
        chart.destroy();
    }
    chart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Datos',
                data: xValues.map((x, i) => ({ x: x, y: yValues[i] })),
                backgroundColor: 'rgba(255, 99, 132, 1)',
                showLine: false
            },
            {
                label: 'Línea de Regresión',
                data: xValues.map((x, i) => ({ x: x, y: regressionPoints[i] })),
                backgroundColor: 'rgba(54, 162, 235, 1)',
                borderColor: 'rgba(54, 162, 235, 1)',
                fill: false,
                showLine: true,
                tension: 0.1
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'X'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Y'
                    }
                }
            }
        }
    });
}