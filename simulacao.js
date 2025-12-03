// -------------------------------
// ELEMENTOS DA INTERFACE
// -------------------------------

const objeto = document.getElementById("objeto");
const sensorEsq = document.getElementById("sensor-esq");
const sensorDir = document.getElementById("sensor-dir");
const distEsqSpan = document.getElementById("dist-esq");
const distDirSpan = document.getElementById("dist-dir");

// -------------------------------
// ÁUDIO (BEEP) — LIBERADO APÓS O PRIMEIRO CLIQUE
// -------------------------------

let beep = new Audio("beep.mp3");
beep.volume = 1;

// IMPORTANTE: desbloqueia o áudio quando o usuário clicar 1 vez na página
document.body.addEventListener("click", () => {
  beep.play().then(() => {
    beep.pause();
    beep.currentTime = 0;
  });
}, { once: true });

// -------------------------------
// INTERVALOS DOS BEEPS
// -------------------------------

let intervaloEsq = null;
let intervaloDir = null;

// -------------------------------
// FUNÇÃO DE DISTÂNCIA
// -------------------------------

function calcularDistancia(x1, x2) {
  const distPx = Math.abs(x1 - x2);
  return Math.floor(distPx / 5);  // Escala px → cm
}

// -------------------------------
// FUNÇÃO QUE CONTROLA O BEEEP
// -------------------------------

function tocarBeep(distancia, lado) {

  // Calcula a velocidade — mais perto → beep mais rápido
  const velocidade = Math.max(60, distancia * 10);

  if (lado === "esq") {
    clearInterval(intervaloEsq);

    if (distancia < 100) {
      intervaloEsq = setInterval(() => {
        beep.currentTime = 0;
        beep.play();
      }, velocidade);
    }
  }

  if (lado === "dir") {
    clearInterval(intervaloDir);

    if (distancia < 100) {
      intervaloDir = setInterval(() => {
        beep.currentTime = 0;
        beep.play();
      }, velocidade);
    }
  }
}

// -------------------------------
// MOVIMENTO DO OBJETO (SIMULA O OBSTÁCULO)
// -------------------------------

objeto.addEventListener("mousedown", () => {

  document.onmousemove = function (event) {

    const area = document.getElementById("simulador-area");
    const rect = area.getBoundingClientRect();

    let x = event.clientX - rect.left - 20;
    let y = event.clientY - rect.top - 20;

    // Mantém dentro da área
    x = Math.max(0, Math.min(x, rect.width - 40));
    y = Math.max(0, Math.min(y, rect.height - 40));

    objeto.style.left = x + "px";
    objeto.style.top = y + "px";

    // Distância horizontal entre objeto e sensores
    const sensorEsqX = sensorEsq.offsetLeft + sensorEsq.offsetWidth / 2;
    const sensorDirX = sensorDir.offsetLeft + sensorDir.offsetWidth / 2;
    const objetoX = x + 20; // centro do objeto

    const distEsq = calcularDistancia(objetoX, sensorEsqX);
    const distDir = calcularDistancia(objetoX, sensorDirX);

    distEsqSpan.textContent = distEsq;
    distDirSpan.textContent = distDir;

    tocarBeep(distEsq, "esq");
    tocarBeep(distDir, "dir");

  };

});

// -------------------------------
// PARAR MOVIMENTO AO SOLTAR O MOUSE
// -------------------------------

document.addEventListener("mouseup", () => {
  document.onmousemove = null;
});
