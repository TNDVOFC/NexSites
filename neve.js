
// Efeito de neve simples
let snowContainer = document.getElementById("snow-container");
for (let i = 0; i < 100; i++) {
  let snowflake = document.createElement("div");
  snowflake.style.position = "fixed";
  snowflake.style.top = Math.random() * window.innerHeight + "px";
  snowflake.style.left = Math.random() * window.innerWidth + "px";
  snowflake.style.width = snowflake.style.height = Math.random() * 5 + 2 + "px";
  snowflake.style.background = "white";
  snowflake.style.borderRadius = "50%";
  snowflake.style.opacity = Math.random();
  snowflake.style.animation = `fall ${Math.random() * 5 + 5}s linear infinite`;
  snowflake.style.zIndex = 0;
  snowContainer.appendChild(snowflake);
}

let style = document.createElement("style");
style.innerHTML = `
@keyframes fall {
  0% { transform: translateY(0); }
  100% { transform: translateY(100vh); }
}`;
document.head.appendChild(style);
