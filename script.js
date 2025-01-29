// Array para almacenar los resultados del liderboard
let liderboard = JSON.parse(localStorage.getItem('liderboard')) || [];

// Función para calcular el VO2Max
function calcularVO2Max(kilometros) {
  return (22.351 * kilometros) - 11.288;
}

// Función para determinar el nivel de VO2Max según la edad
function determinarNivelVO2Max(vo2max, edad) {
  const rangos = {
    "13-19": { muyPobre: 35.0, pobre: 38.3, promedio: 45.1, bueno: 50.9, excelente: 55.9 },
    "20-29": { muyPobre: 33.0, pobre: 36.4, promedio: 42.4, bueno: 46.4, excelente: 52.4 },
    "30-39": { muyPobre: 31.5, pobre: 35.4, promedio: 40.9, bueno: 44.9, excelente: 49.4 },
    "40-49": { muyPobre: 30.2, pobre: 33.5, promedio: 38.9, bueno: 43.7, excelente: 48.0 },
    "50-59": { muyPobre: 26.1, pobre: 30.9, promedio: 35.7, bueno: 40.9, excelente: 45.3 },
    "60+": { muyPobre: 20.5, pobre: 26.0, promedio: 32.2, bueno: 36.4, excelente: 44.2 },
  };

  let grupoEdad = "";

  if (edad >= 13 && edad <= 19) grupoEdad = "13-19";
  else if (edad >= 20 && edad <= 29) grupoEdad = "20-29";
  else if (edad >= 30 && edad <= 39) grupoEdad = "30-39";
  else if (edad >= 40 && edad <= 49) grupoEdad = "40-49";
  else if (edad >= 50 && edad <= 59) grupoEdad = "50-59";
  else if (edad >= 60) grupoEdad = "60+";

  const { muyPobre, pobre, promedio, bueno, excelente } = rangos[grupoEdad];

  if (vo2max < muyPobre) return "Muy Pobre";
  else if (vo2max <= pobre) return "Pobre";
  else if (vo2max <= promedio) return "Promedio";
  else if (vo2max <= bueno) return "Bueno";
  else if (vo2max <= excelente) return "Excelente";
  else return "Superior";
}

// Función para actualizar el liderboard
function actualizarLiderboard(nombre, vo2max) {
  // Verificar si el usuario ya existe en el liderboard
  const usuarioExistente = liderboard.find(entry => entry.nombre === nombre);

  if (usuarioExistente) {
    // Si el nuevo VO2Max es mejor, actualizar el valor
    if (vo2max > usuarioExistente.vo2max) {
      usuarioExistente.vo2max = vo2max;
    }
  } else {
    // Si no existe, agregar al liderboard
    liderboard.push({ nombre, vo2max });
  }

  // Ordenar el liderboard de mayor a menor VO2Max
  liderboard.sort((a, b) => b.vo2max - a.vo2max);

  // Mantener solo los 15 mejores resultados
  if (liderboard.length > 15) {
    liderboard = liderboard.slice(0, 15);
  }

  // Guardar en localStorage
  localStorage.setItem('liderboard', JSON.stringify(liderboard));

  // Actualizar la visualización del liderboard
  mostrarLiderboard();
}

// Función para mostrar el liderboard en la interfaz
function mostrarLiderboard() {
  const liderboardElement = document.getElementById('liderboard');
  liderboardElement.innerHTML = liderboard
    .map((entry, index) => `
      <li>
        ${index + 1}. ${entry.nombre}: ${entry.vo2max.toFixed(2)} vo2max
        <button class="eliminar-btn" data-nombre="${entry.nombre}">Eliminar</button>
      </li>
    `)
    .join('');

  // Agregar eventos a los botones de eliminar
  document.querySelectorAll('.eliminar-btn').forEach(button => {
    button.addEventListener('click', () => eliminarUsuario(button.dataset.nombre));
  });
}

// Función para eliminar un usuario del liderboard
function eliminarUsuario(nombre) {
  liderboard = liderboard.filter(entry => entry.nombre !== nombre);
  localStorage.setItem('liderboard', JSON.stringify(liderboard));
  mostrarLiderboard();
}

// Manejar el envío del formulario
document.getElementById('vo2maxForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // Obtener los valores del formulario
  const nombre = document.getElementById('nombre').value;
  const kilometros = parseFloat(document.getElementById('kilometros').value);
  const edad = parseInt(document.getElementById('edad').value);

  // Calcular el VO2Max
  const vo2max = calcularVO2Max(kilometros);

  // Determinar el nivel de VO2Max
  const nivel = determinarNivelVO2Max(vo2max, edad);

  // Mostrar el resultado
  document.getElementById('resultado').innerHTML = `
    ${nombre}, tu vo2max es: <strong>${vo2max.toFixed(2)}</strong><br>
    Nivel: <strong>${nivel}</strong>
  `;

  // Actualizar el liderboard
  actualizarLiderboard(nombre, vo2max);

  // Limpiar el formulario
  document.getElementById('vo2maxForm').reset();
});

// Mostrar el liderboard al cargar la página
mostrarLiderboard();