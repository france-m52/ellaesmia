// Controle das telas
function nextScreen() {
    document.getElementById('screen1').classList.add('hidden');
    document.getElementById('screen2').classList.remove('hidden');
}

function yesAnswer() {
    document.getElementById('screen2').classList.add('hidden');
    document.getElementById('screen3').classList.remove('hidden');
    startConfetti();
    playSuccessSound();
}

function showSurprise() {
    document.getElementById('dateMessage').classList.remove('hidden');
}

function tryAgain() {
    document.getElementById('screen4').classList.add('hidden');
    document.getElementById('screen2').classList.remove('hidden');
}

// Função para mover o botão "Não" - funciona para mouse e toque
function moveNoButton(event) {
    const btnNo = document.getElementById('btnNo');
    const container = document.querySelector('.question-box');
    const containerRect = container.getBoundingClientRect();
    
    // Prevenir comportamento padrão
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    // Garantir que o botão tenha posição absoluta
    btnNo.style.position = 'absolute';
    
    // Calcular limites
    const btnWidth = btnNo.offsetWidth;
    const btnHeight = btnNo.offsetHeight;
    const maxX = containerRect.width - btnWidth - 20; // Margem de 10px de cada lado
    const maxY = containerRect.height - btnHeight - 20;
    
    // Gerar nova posição aleatória
    let randomX, randomY;
    let attempts = 0;
    const maxAttempts = 10;
    
    do {
        randomX = Math.floor(Math.random() * maxX) + 10;
        randomY = Math.floor(Math.random() * maxY) + 10;
        attempts++;
        
        // Evitar posição muito próxima do centro (onde está o botão SIM)
        const centerX = containerRect.width / 2;
        const centerY = containerRect.height / 2;
        const distanceFromCenter = Math.sqrt(
            Math.pow(randomX + btnWidth/2 - centerX, 2) + 
            Math.pow(randomY + btnHeight/2 - centerY, 2)
        );
        
        // Se está longe o suficiente do centro, aceita a posição
        if (distanceFromCenter > 100 || attempts >= maxAttempts) {
            break;
        }
    } while (attempts < maxAttempts);
    
    // Aplicar nova posição com transição suave
    btnNo.style.transition = 'all 0.4s ease-out';
    btnNo.style.left = `${randomX}px`;
    btnNo.style.top = `${randomY}px`;
    
    // Adicionar efeito visual de movimento
    btnNo.style.transform = 'scale(1.05)';
    setTimeout(() => {
        btnNo.style.transform = 'scale(1)';
    }, 300);
    
    // Se for evento de toque, evitar clique acidental
    if (event && event.type === 'touchstart') {
        // Adicionar um pequeno delay antes de permitir clique novamente
        btnNo.style.pointerEvents = 'none';
        setTimeout(() => {
            btnNo.style.pointerEvents = 'auto';
        }, 500);
    }
}

// Contador para controlar a frequência dos movimentos no hover
let hoverTimeout;
let lastHoverMove = 0;
const HOVER_COOLDOWN = 300; // ms entre movimentos no hover

function handleHoverMove(event) {
    const now = Date.now();
    
    // Controlar frequência para não mover muito rápido
    if (now - lastHoverMove > HOVER_COOLDOWN) {
        moveNoButton(event);
        lastHoverMove = now;
    }
}

// Clique no "Não" - vai para tela de brincadeira
document.getElementById('btnNo').addEventListener('click', function(event) {
    // Verificar se o clique foi intencional (o botão não se moveu recentemente)
    const now = Date.now();
    if (now - lastHoverMove > 500) { // Se não houve movimento nos últimos 500ms
        document.getElementById('screen2').classList.add('hidden');
        document.getElementById('screen4').classList.remove('hidden');
    }
    // Se houve movimento recente, o clique é considerado acidental e não faz nada
});

// Configurar eventos para desktop (mouse) e mobile (toque)
function setupNoButtonEvents() {
    const btnNo = document.getElementById('btnNo');
    
    // Remover eventos anteriores para evitar duplicação
    btnNo.removeEventListener('mouseenter', handleHoverMove);
    btnNo.removeEventListener('touchstart', moveNoButton);
    btnNo.removeEventListener('click', moveNoButton);
    
    // Evento para mouse (desktop)
    btnNo.addEventListener('mouseenter', handleHoverMove);
    
    // Eventos para toque (mobile)
    btnNo.addEventListener('touchstart', function(event) {
        moveNoButton(event);
        // No mobile, também mover no clique para dificultar
    });
    
    // Mover também em alguns cliques (para dificultar mais)
    btnNo.addEventListener('click', function(event) {
        // 50% de chance de mover no clique também
        if (Math.random() > 0.5) {
            moveNoButton(event);
        }
    });
}

// Sistema de confetes
function startConfetti() {
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confettiPieces = [];
    const colors = ['#ff4d6d', '#36d1dc', '#5b86e5', '#ffd700', '#ff9500'];
    
    // Criar confetes
    for (let i = 0; i < 150; i++) {
        confettiPieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 10 + 5,
            d: Math.random() * 10 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.random() * 10 - 10,
            tiltAngleIncrement: Math.random() * 0.07 + 0.05,
            tiltAngle: 0
        });
    }
    
    function drawConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confettiPieces.forEach((p) => {
            ctx.beginPath();
            ctx.lineWidth = p.d / 2;
            ctx.strokeStyle = p.color;
            ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
            ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
            ctx.stroke();
            
            // Atualizar posição
            p.tiltAngle += p.tiltAngleIncrement;
            p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
            p.x += Math.sin(p.d);
            p.tilt = Math.sin(p.tiltAngle) * 15;
            
            // Se o confete sair da tela, reiniciar no topo
            if (p.y > canvas.height) {
                p.x = Math.random() * canvas.width;
                p.y = -20;
            }
        });
        
        requestAnimationFrame(drawConfetti);
    }
    
    drawConfetti();
    
    // Redimensionar canvas quando a janela mudar de tamanho
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Efeito sonoro simples (usando Web Audio API)
function playSuccessSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // Nota C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // Nota E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // Nota G5
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.log("Áudio não suportado ou bloqueado pelo navegador");
    }
}

// Efeito de digitação na primeira tela (opcional)
window.onload = function() {
    const text = "Tenho algo muito especial para te perguntar...";
    const element = document.querySelector('#screen1 p');
    let i = 0;
    
    function typeWriter() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }
    
    // Inicia efeito de digitação após um breve delay
    setTimeout(() => {
        element.innerHTML = "";
        typeWriter();
    }, 1000);
    
    // Configurar eventos do botão "Não" após carregar a página
    setTimeout(() => {
        setupNoButtonEvents();
    }, 1500);
};

// Detecta se é dispositivo móvel para ajustar comportamento
function isMobileDevice() {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
}

// Movimento aleatório ocasional mesmo sem interação (para dificultar mais)
function randomMovement() {
    const btnNo = document.getElementById('btnNo');
    if (btnNo && !btnNo.classList.contains('hidden')) {
        // 10% de chance de se mover sozinho a cada 3 segundos
        if (Math.random() > 0.9) {
            moveNoButton();
        }
    }
}

// Iniciar movimento aleatório ocasional
setInterval(randomMovement, 3000);

// Adicionar classe CSS para indicar que pode ser arrastado (opcional)
document.addEventListener('DOMContentLoaded', function() {
    const btnNo = document.getElementById('btnNo');
    if (btnNo) {
        // Adicionar indicador visual para mobile
        if (isMobileDevice()) {
            btnNo.title = "Toque para ver ele fugir!";
            btnNo.setAttribute('aria-label', 'Botão Não - toque e ele se move');
        } else {
            btnNo.title = "Passe o mouse para ver ele fugir!";
        }
    }
});