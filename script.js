// ===============================
// DATOS GUARDADOS
// ===============================

let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];

// ===============================
// ELEMENTOS DEL HTML
// ===============================

const formulario = document.getElementById("formMovimiento");
const inputMonto = document.getElementById("monto");
const selectTipo = document.getElementById("tipo");
const selectDescripcion = document.getElementById("descripcion");
const tablaMovimientos = document.getElementById("tablamovimientos");

const tarjetaSaldo = document.querySelector("#uno h3");
const tarjetaIngresos = document.querySelector("#dos h3");
const tarjetaGastos = document.querySelector("#tres h3");
const tarjetaAhorro = document.querySelector("#cuatro h3");
const textoAhorro = document.querySelector("#cuatro p");

// ===============================
// FORMATO PESOS COLOMBIANOS
// ===============================

function formatearCOP(valor) {
  return valor.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0
  });
}

// ===============================
// GUARDAR EN EL NAVEGADOR
// ===============================

function guardarMovimientos() {
  localStorage.setItem("movimientos", JSON.stringify(movimientos));
}

// ===============================
// AGREGAR MOVIMIENTO
// ===============================

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const monto = Number(inputMonto.value);
  const tipo = selectTipo.value;
  const descripcion = selectDescripcion.value;

  if (monto <= 0 || descripcion === "") {
    alert("Por favor ingresa un monto válido y selecciona una descripción.");
    return;
  }

  const nuevoMovimiento = {
    fecha: new Date().toLocaleDateString("es-CO"),
    tipo: tipo,
    descripcion: descripcion,
    categoria: descripcion,
    monto: monto
  };

  movimientos.push(nuevoMovimiento);

  guardarMovimientos();
  pintarTabla();
  actualizarTarjetas();
  actualizarGrafica();

  formulario.reset();
});

// ===============================
// PINTAR TABLA
// ===============================

function pintarTabla() {
  tablaMovimientos.innerHTML = "";

  movimientos.forEach(function (movimiento, index) {
    const fila = document.createElement("tr");

    const signo = movimiento.tipo === "Ingreso" ? "+" : "-";
    const claseMonto = movimiento.tipo === "Ingreso" ? "monto-ingreso" : "monto-gasto";

    fila.innerHTML = `
      <td>${movimiento.fecha}</td>
      <td>${movimiento.tipo}</td>
      <td>${movimiento.descripcion}</td>
      <td>${movimiento.categoria}</td>
      <td class="${claseMonto}">${signo}${formatearCOP(movimiento.monto)}</td>
      <td>
        <button class="btn-eliminar" onclick="eliminarMovimiento(${index})">
          Eliminar
        </button>
      </td>
    `;

    tablaMovimientos.appendChild(fila);
  });
}

// ===============================
// ELIMINAR MOVIMIENTO
// ===============================

function eliminarMovimiento(index) {
  movimientos.splice(index, 1);

  guardarMovimientos();
  pintarTabla();
  actualizarTarjetas();
  actualizarGrafica();
}

// ===============================
// ACTUALIZAR TARJETAS
// ===============================

function actualizarTarjetas() {
  let ingresos = 0;
  let gastos = 0;

  movimientos.forEach(function (movimiento) {
    if (movimiento.tipo === "Ingreso") {
      ingresos += movimiento.monto;
    } else {
      gastos += movimiento.monto;
    }
  });

  const saldo = ingresos - gastos;
  const ahorro = saldo;

  let porcentajeAhorro = 0;

  if (ingresos > 0) {
    porcentajeAhorro = Math.round((ahorro / ingresos) * 100);
  }

  tarjetaSaldo.textContent = formatearCOP(saldo);
  tarjetaIngresos.textContent = formatearCOP(ingresos);
  tarjetaGastos.textContent = formatearCOP(gastos);
  tarjetaAhorro.textContent = formatearCOP(ahorro);
  textoAhorro.textContent = `${porcentajeAhorro}% de tus ingresos`;
}

// ===============================
// GRÁFICA
// ===============================

const ctx = document.getElementById("micanvas").getContext("2d");

let grafica = new Chart(ctx, {
  type: "line",
  data: {
    labels: ["Sin datos"],
    datasets: [
      {
        label: "Ingresos",
        data: [0],
        borderColor: "green",
        backgroundColor: "green",
        tension: 0.3
      },
      {
        label: "Gastos",
        data: [0],
        borderColor: "red",
        backgroundColor: "red",
        tension: 0.3
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

function actualizarGrafica() {
  const labels = movimientos.map(function (movimiento, index) {
    return `Mov. ${index + 1}`;
  });

  const ingresos = movimientos.map(function (movimiento) {
    return movimiento.tipo === "Ingreso" ? movimiento.monto : 0;
  });

  const gastos = movimientos.map(function (movimiento) {
    return movimiento.tipo === "Gasto" ? movimiento.monto : 0;
  });

  grafica.data.labels = labels.length > 0 ? labels : ["Sin datos"];
  grafica.data.datasets[0].data = ingresos.length > 0 ? ingresos : [0];
  grafica.data.datasets[1].data = gastos.length > 0 ? gastos : [0];

  grafica.update();
}

// ===============================
// CARGA INICIAL
// ===============================

pintarTabla();
actualizarTarjetas();
actualizarGrafica();
