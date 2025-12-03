const objeto = document.getElementById("objeto");
const sensorEsq = document.getElementById("sensor-esq");
const sensorDir = document.getElementById("sensor-dir");
const distEsqSpan = document.getElementById("dist-esq");
const distDirSpan = document.getElementById("dist-dir");

function gerarBeep(frequencia = 800, duracao = 100) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.type = "square";
  oscillator.frequency.value = frequencia;

  gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime); 

  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
    audioCtx.close();
  }, duracao);
}

let intervaloEsq = null;
let intervaloDir = null;

function calcularDistancia(x1, x2) {
  const distPx = Math.abs(x1 - x2);
  return Math.floor(distPx / 5);  
}

function tocarBeep(distancia, lado) {
  const velocidade = Math.max(70, distancia * 10); 
  if (lado === "esq") {
    clearInterval(intervaloEsq);
    if (distancia < 100) {
      intervaloEsq = setInterval(() => {
        gerarBeep(1000, 80); 
      }, velocidade);
    }
  }

  if (lado === "dir") {
    clearInterval(intervaloDir);
    if (distancia < 100) {
      intervaloDir = setInterval(() => {
        gerarBeep(700, 80);
      }, velocidade);
    }
  }
}

objeto.addEventListener("mousedown", () => {

  document.onmousemove = function (event) {

    const area = document.getElementById("simulador-area");
    const rect = area.getBoundingClientRect();

    let x = event.clientX - rect.left - 20;
    let y = event.clientY - rect.top - 20;

    x = Math.max(0, Math.min(x, rect.width - 40));
    y = Math.max(0, Math.min(y, rect.height - 40));

    objeto.style.left = x + "px";
    objeto.style.top = y + "px";

    const sensorEsqX = sensorEsq.offsetLeft + sensorEsq.offsetWidth / 2;
    const sensorDirX = sensorDir.offsetLeft + sensorDir.offsetWidth / 2;
    const objetoX = x + 20;

    const distEsq = calcularDistancia(objetoX, sensorEsqX);
    const distDir = calcularDistancia(objetoX, sensorDirX);

    distEsqSpan.textContent = distEsq;
    distDirSpan.textContent = distDir;

    tocarBeep(distEsq, "esq");
    tocarBeep(distDir, "dir");

  };

});

document.addEventListener("mouseup", () => {
  document.onmousemove = null;
});


