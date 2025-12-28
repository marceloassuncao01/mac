// 1. INICIALIZAÇÃO DO RELÓGIO (Prioridade total para funcionar logo)
function atualizarRelogio() {
    const agora = new Date();
    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');
    const segundos = String(agora.getSeconds()).padStart(2, '0');
    
    const relogioElemento = document.getElementById('relogio');
    if (relogioElemento) {
        relogioElemento.textContent = `${horas}:${minutos}:${segundos}`;
    }
}
setInterval(atualizarRelogio, 1000);
atualizarRelogio();

// 2. EFEITO MATRIX (Usando seu padrão MAC)
const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');

const resize = () => { 
    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight; 
};
window.addEventListener('resize', resize);
resize();

const letters = "MAC0123456789".split("");
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + "px monospace";
    
    drops.forEach((y, i) => {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillStyle = (text === 'M' || text === 'A' || text === 'C') ? "#fff" : "#0f0";
        ctx.fillText(text, i * fontSize, y * fontSize);
        if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    });
}
setInterval(drawMatrix, 60);

// 3. CARREGAMENTO DE FEEDS E NOTÍCIAS
async function carregarFeed(url, containerId) {
    const feedDiv = document.getElementById(containerId);
    if (!feedDiv) return;

    try {
        const resposta = await fetch(url);
        const texto = await resposta.text();
        const xml = new DOMParser().parseFromString(texto, "application/xml");
        const items = xml.querySelectorAll("item");

        feedDiv.innerHTML = ""; 
        items.forEach((item, i) => {
            if (i < 6) {
                const titulo = item.querySelector("title")?.textContent || "Sem título";
                const link = item.querySelector("link")?.textContent || "#";
                const bloco = document.createElement("div");
                bloco.className = "post";
                bloco.innerHTML = `<h3><a href="javascript:void(0)" onclick="abrirNoticia('${link}')">${titulo}</a></h3>`;
                feedDiv.appendChild(bloco);
            }
        });
    } catch (erro) {
        feedDiv.innerHTML = `<p style="color: #555;">Sistema offline ou erro no feed.</p>`;
    }
}

function abrirNoticia(url) {
    const largura = 900;
    const altura = 700;
    const esquerda = (window.screen.width / 2) - (largura / 2);
    const topo = (window.screen.height / 2) - (altura / 2);
    const configuracoes = `width=${largura},height=${altura},left=${esquerda},top=${topo},scrollbars=yes`;
    window.open(url, 'MAC_NEWS', configuracoes);
}

// 4. INICIALIZAÇÃO AO CARREGAR PÁGINA
window.addEventListener("load", () => {
    carregarFeed("/rss-google", "feed-google");
    carregarFeed("/rss-portal", "feed-portal");
    carregarFeed("/rss-cointelegraph", "feed-cointelegraph");
    carregarFeed("/rss-financas", "feed-financas");
    carregarFeed("/rss-mundo", "feed-mundo");

    // Contador de Acessos
    fetch('/api/contador')
        .then(res => res.json())
        .then(data => {
            const painel = document.getElementById('contador-num');
            if (painel) painel.innerText = data.total.toString().padStart(5, '0');
        }).catch(e => console.log("Contador offline"));
});