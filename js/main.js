document.addEventListener("DOMContentLoaded", () => {
  const vapi = document.getElementById("vapi");
  const button = document.getElementById("voice-button");
  const estadoLuz = document.getElementById("estado-luz");
  const mensajeFlotante = document.getElementById("mensaje-flotante");
  let idleTimeout;
  let estaHablando = false;

  function finalizarConversacion() {
    clearTimeout(idleTimeout);
    vapi.style.display = "none";
    button.classList.remove("escuchando", "activo");
    estadoLuz.style.display = "none";
    mensajeFlotante.style.display = "none";
    estaHablando = false;
  }

  button.addEventListener("click", () => {
    if (estaHablando) {
      console.log("🔴 Deteniendo conversación...");
      if (typeof vapi.stop === "function") {
        vapi.stop();
      }

      // ⚠️ Aseguramos visualmente el cierre (por si no responde)
      setTimeout(() => {
        if (estaHablando) {
          console.log("🛑 Forzando cierre visual");
          finalizarConversacion();
        }
      }, 1000);

      return;
    }

    console.log("🟢 Iniciando conversación...");

    // 🔁 Rebotar al hacer clic
    button.classList.add("bounce");
    setTimeout(() => button.classList.remove("bounce"), 500);

    // Activar estado visual
    button.classList.add("escuchando", "activo");
    estadoLuz.style.display = "block";
    mensajeFlotante.style.display = "block";
    vapi.style.display = "block";

    customElements.whenDefined('vapi-widget').then(() => {
      if (typeof vapi.start === "function") {
        vapi.start();

        if (typeof vapi.say === "function") {
          vapi.say("Hola, soy Luz. ¿En qué puedo ayudarte hoy?");
        }

        idleTimeout = setTimeout(() => {
          if (typeof vapi.say === "function") {
            vapi.say("¿Sigues ahí?");
          }
        }, 10000);

        estaHablando = true;
      }
    });
  });

  vapi.addEventListener("conversation-ended", () => {
    console.log("✅ Evento conversation-ended recibido");
    finalizarConversacion();
  });
});

// Fondo degradado animado
const canvas = document.getElementById("background-canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let gradientOffset = 0;

function drawGradientBackground() {
  gradientOffset += 0.5;
  if (gradientOffset > canvas.width) gradientOffset = 0;

  const gradient = ctx.createLinearGradient(
    gradientOffset, 0,
    canvas.width, canvas.height
  );
  gradient.addColorStop(0, "#e0c3fc");
  gradient.addColorStop(1, "#8ec5fc");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  requestAnimationFrame(drawGradientBackground);
}

drawGradientBackground();
