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

// Botão "Não" foge do mouse
function moveNoButton() {
    const btnNo = document.getElementById('btnNo');
    const container = document.querySelector('.question-box');
    const containerRect = container.getBoundingClientRect();
    
    // Gerar posição aleatória dentro da caixa da pergunta
    const maxX = containerRect.width - btnNo.offsetWidth;
    const maxY = containerRect.height - btnNo.offsetHeight;
    
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    
    btnNo.style.position = 'absolute';
    btnNo.style.left = `${randomX}px`;
    btnNo.style.top = `${randomY}px`;
}

// Clique acidental no "Não" - vai para tela de brincadeira
document.getElementById('btnNo').addEventListener('click', function() {
    document.getElementById('screen2').classList.add('hidden');
    document.getElementById('screen4').classList.remove('hidden');
});

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
};