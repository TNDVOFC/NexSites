
document.getElementById("formContato").addEventListener("submit", async function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const whatsapp = document.getElementById("whatsapp").value.trim();
  const mensagem = document.getElementById("mensagem").value.trim();

  const webhookPrivada = "https://discord.com/api/webhooks/1390864875705733191/AudiuKWxfeBGlJnLqyorsshg3h_ntsn0p2D0_YDkweEjfHKUNSmJltT1YCr7Z7YzFPB9";
  const webhookPublica = "https://discord.com/api/webhooks/1390868376313663609/QvmY53-UqSTRLnVjp0QtHPu7zZyQM_iD_imIV5F8W7BvtD5b_wVVzZf8bSrCMNKnZAs0";

  let ip = "IP não detectado";
  let cidade = "Desconhecida";
  let continente = "Desconhecido";
  let pais = "Desconhecido";
  let horario = "Desconhecido";
  let isp = "Desconhecido";
  let fuso = "Desconhecido";

  try {
    const res = await fetch("https://ipwho.is");
    const data = await res.json();

    ip = data.ip || ip;
    cidade = data.city || cidade;
    continente = data.continent || continente;
    pais = data.country || pais;
    horario = data.timezone.current_time || horario;
    isp = data.connection.isp || isp;
    fuso = data.timezone.utc || fuso;
  } catch (err) {
    console.warn("Erro ao obter dados de IP:", err);
  }

  const dadosPrivados = {
    content: "**📩 Novo pedido de site!**",
    embeds: [
      {
        title: "💼 Pedido via Site da NexSites",
        color: 16776960,
        fields: [
          { name: "👤 Nome", value: nome || "Não informado" },
          { name: "📧 Email", value: email || "Não informado" },
          { name: "📱 WhatsApp", value: whatsapp || "Não informado" },
          { name: "📝 Mensagem", value: mensagem || "Nenhuma" },
          { name: "🌐 IP", value: `||${ip}||` },
          { name: "🏙 Cidade", value: cidade },
          { name: "🌍 Continente", value: continente },
          { name: "🇧🇷 País", value: pais },
          { name: "🕒 Horário local", value: horario },
          { name: "📡 ISP", value: isp },
          { name: "🕓 Fuso Horário", value: fuso }
        ]
      }
    ]
  };

  const dadosPublicos = {
    content: "**📢 Novo pedido público recebido!**",
    embeds: [
      {
        title: "💼 Pedido Público NexSites",
        color: 16776960,
        fields: [
          { name: "👤 Nome", value: nome || "Anônimo" },
          { name: "📝 Pedido", value: "Um novo pedido de site foi enviado. Contate-nos para mais informações!" }
        ]
      }
    ]
  };

  try {
    await fetch(webhookPrivada, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dadosPrivados)
    });

    await fetch(webhookPublica, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dadosPublicos)
    });

    document.getElementById("formContato").reset();
    const aviso = document.getElementById("aviso");
    aviso.style.display = "block";
    setTimeout(() => {
      aviso.style.display = "none";
    }, 7000);
  } catch {
    alert("❌ Erro ao enviar. Tente novamente.");
  }
});
