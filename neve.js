const snowContainer = document.getElementById("snow-container");

// Quantidade de flocos de neve (reduzido para 70 para menos lag)
const flakesCount = 70;

// Função para criar um floco com propriedades aleatórias
function createSnowflake() {
  const snowflake = document.createElement("div");
  snowflake.style.position = "fixed";
  snowflake.style.top = Math.random() * window.innerHeight + "px";
  snowflake.style.left = Math.random() * window.innerWidth + "px";

  const size = Math.random() * 4 + 2;
  snowflake.style.width = size + "px";
  snowflake.style.height = size + "px";

  snowflake.style.background = "rgba(255,255,255,0.8)";
  snowflake.style.borderRadius = "50%";
  snowflake.style.boxShadow = "0 0 6px 2px rgba(255,255,255,0.6)";
  snowflake.style.opacity = Math.random() * 0.8 + 0.3;
  snowflake.style.zIndex = 0;
  snowflake.style.pointerEvents = "none";

  // Animação via CSS com duração e delay aleatórios para naturalidade
  snowflake.style.animation = `fall ${Math.random() * 8 + 7}s linear infinite`;
  snowflake.style.animationDelay = `${Math.random() * 8}s`;

  return snowflake;
}

// Cria e adiciona os flocos
for (let i = 0; i < flakesCount; i++) {
  snowContainer.appendChild(createSnowflake());
}

// Insere keyframes da animação
const style = document.createElement("style");
style.innerHTML = `
@keyframes fall {
  0% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(50vh) translateX(20px); }
  100% { transform: translateY(100vh) translateX(0); }
}`;
document.head.appendChild(style);
