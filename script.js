let btn = document.querySelector(".toggle-btn");

btn.addEventListener("click", function () {
    document.getElementById("sidebar").classList.toggle("active");
});


// GRAFICA

let contexto = document.getElementById("micanvas").getContext("2d");

let opciones = {
    type: "line",

    data: {
        labels: ["Ene", "Feb", "Mar", "Abr", "May"],

        datasets: [
            {
                label: "Ingresos",
                data: [500000, 1000000, 1500000, 2000000, 2500000],
                backgroundColor: "rgb(0,200,200)",
                borderColor: "rgb(0,200,0)",
                borderWidth: 2
            },
            {
                label: "Gastos",
                data: [400000, 800000, 1200000, 1500000, 1800000],
                backgroundColor: "rgb(200,50,50)",
                borderColor: "rgb(200,50,50)",
                borderWidth: 2
            }
        ]
    },

    options: {
        responsive: true,
        maintainAspectRatio: false
    }
};

let grafica = new Chart(contexto, opciones);
let tablaMovimientos = document.getElementById("tablaMovimientos");

let fila = document.createElement("tr");

fila.innerHTML = `
    <td>18/05/2026</td>
    <td>Ingreso</td>
    <td>Pago salario</td>
    <td>Trabajo</td>
    <td>$1.500.000</td>
`;

tablaMovimientos.appendChild(fila);
