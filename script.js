const styleButtons = document.querySelectorAll(".plan-card button");
const selectedStyleInput = document.getElementById("selectedStyle");
const orderForm = document.getElementById("orderForm");
const formMessage = document.getElementById("formMessage");
const whatsappInput = document.getElementById("whatsapp");

// Máscara WhatsApp (99) 99999-9999
whatsappInput.addEventListener("input", (e) => {
  let v = e.target.value.replace(/\D/g, "");
  if (v.length > 11) v = v.slice(0, 11);
  if (v.length > 7) {
    v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
  } else if (v.length > 2) {
    v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
  } else if (v.length > 0) {
    v = `(${v}`;
  }
  e.target.value = v;
});

styleButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    selectedStyleInput.value = btn.dataset.style;
    selectedStyleInput.focus();
    formMessage.textContent = "";
  });
});

orderForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  formMessage.textContent = "";

  const nome = document.getElementById("name").value.trim();
  const whatsapp = whatsappInput.value.trim();
  const estilo = selectedStyleInput.value.trim();
  const descricao = document.getElementById("descricaoSite").value.trim();

  if (!nome || !whatsapp || !estilo || !descricao) {
    formMessage.style.color = "red";
    formMessage.textContent = "Por favor, preencha todos os campos e selecione um estilo.";
    return;
  }

  formMessage.style.color = "#2563eb";
  formMessage.textContent = "Enviando pedido...";

  // Busca dados IP e localização
  let ip = "IP não detectado";
  let cidade = "Desconhecida";
  let pais = "Desconhecido";
  let continente = "Desconhecido";
  let timezone = "Desconhecida";
  try {
    const res = await fetch("https://ipwho.is");
    const data = await res.json();
    if (data.success) {
      ip = data.ip || ip;
      cidade = data.city || cidade;
      pais = data.country || pais;
      continente = data.continent || continente;
      timezone = data.timezone.name || timezone;
    }
  } catch (error) {
    console.warn("Erro ao obter dados do IP:", error);
  }

  const webhookURL = "https://discord.com/api/webhooks/1390864875705733191/AudiuKWxfeBGlJnLqyorsshg3h_ntsn0p2D0_YDkweEjfHKUNSmJltT1YCr7Z7YzFPB9";

  const dadosPedido = {
    embeds: [
      {
        title: "📥 Novo Pedido de Site Recebido",
        color: 3447003,
        timestamp: new Date().toISOString(),
        footer: {
          text: "NexSites © 2025",
          icon_url: "https://cdn-icons-png.flaticon.com/512/5968/5968705.png",
        },
        fields: [
          { name: "👤 Nome do Cliente", value: nome, inline: true },
          { name: "📱 Whatsapp", value: whatsapp, inline: true },
          { name: "🎨 Estilo Selecionado", value: estilo, inline: false },
          { name: "📝 Descrição do Site", value: descricao, inline: false },
          { name: "🌐 IP", value: `||${ip}||`, inline: true },
          { name: "🏙 Cidade", value: cidade, inline: true },
          { name: "🇧🇷 País", value: pais, inline: true },
          { name: "🌍 Continente", value: continente, inline: true },
          { name: "🕒 Fuso Horário", value: timezone, inline: true },
        ],
      },
    ],
  };

  try {
    await fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dadosPedido),
    });

    orderForm.reset();
    formMessage.style.color = "#16a34a"; // verde
    formMessage.textContent = "✅ Pedido enviado com sucesso! Entraremos em contato em breve.";
  } catch (err) {
    formMessage.style.color = "red";
    formMessage.textContent = "❌ Erro ao enviar pedido. Tente novamente.";
    console.error("Erro ao enviar webhook:", err);
  }
});
