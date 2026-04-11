// 1. SYNTHETIC AUDIO ENGINE
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

function playBeep(freq = 500) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
}

// 2. BOOT SEQUENCE LOGIC
const bootScreen = document.getElementById('boot-screen');
const bootText = document.getElementById('boot-text');
const bootLines = [
    "Initializing K8BH Kernel...",
    "Mounting file systems... [OK]",
    "Loading biometric drivers... [OK]",
    "Decrypting K8BH_Archive.sys...",
    "Welcome back, Kaustubh Patil."
];

let bootDelay = 0;
bootLines.forEach((line, index) => {
    setTimeout(() => {
        const p = document.createElement('p');
        p.className = 'boot-line';
        p.innerText = "> " + line;
        bootText.appendChild(p);
        setTimeout(() => p.style.opacity = 1, 50);
        playBeep(800 + (index * 100)); // Beep on load
    }, bootDelay);
    bootDelay += 400; 
});

setTimeout(() => {
    bootScreen.style.opacity = 0;
    setTimeout(() => bootScreen.style.display = 'none', 800);
}, bootDelay + 500);

// 3. MATRIX RAIN CANVAS LOGIC
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = [];
for(let x = 0; x < columns; x++) drops[x] = 1;
let matrixInterval;

function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0F0";
    ctx.font = fontSize + "px monospace";
    
    for(let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}

// 4. DOSSIER DECRYPTION MODAL
const dModal = document.getElementById('dossierModal');
const dTitle = document.getElementById('dossierTitle');
const dText = document.getElementById('dossierText');
let decryptInterval;

function openDossier(title, text) {
    playBeep(800); 
    dModal.showModal(); 
    dTitle.innerText = "SYS_LOG: " + title.toUpperCase();
    
    let iterations = 0;
    clearInterval(decryptInterval);
    
    decryptInterval = setInterval(() => {
        dText.innerHTML = text.split('').map((char, index) => {
            if(char === '<' || char === '>' || char === 'b' || char === 'r') return char; 
            if(index < iterations) return char;
            return chars[Math.floor(Math.random() * chars.length)];
        }).join('');
        
        if(iterations >= text.length) clearInterval(decryptInterval);
        iterations += 1; 
    }, 10);
}

function closeDossier() {
    playBeep(300);
    dModal.close();
    clearInterval(decryptInterval);
}

dModal.addEventListener('click', (e) => {
    const dim = dModal.getBoundingClientRect();
    if (e.clientX < dim.left || e.clientX > dim.right || e.clientY < dim.top || e.clientY > dim.bottom) closeDossier();
});

// 5. WARGAMES ENGINE
const gameModal = document.getElementById('gameModal');
const gameContainer = document.getElementById('gameContainer');
const gameTitle = document.getElementById('gameTitle');

function openGame(type) {
    playBeep(900);
    gameModal.showModal();
    gameContainer.innerHTML = ''; 
    
    if (type === 'tictactoe') {
        gameTitle.innerText = "SYS_OP: TIC-TAC-TOE";
        initTicTacToe();
    } else if (type === 'rps') {
        gameTitle.innerText = "SYS_OP: RPS_PROTOCOL";
        initRPS();
    }
}

function closeGame() {
    playBeep(300);
    gameModal.close();
}

gameModal.addEventListener('click', (e) => {
    const dim = gameModal.getBoundingClientRect();
    if (e.clientX < dim.left || e.clientX > dim.right || e.clientY < dim.top || e.clientY > dim.bottom) closeGame();
});

let tttBoard = ['', '', '', '', '', '', '', '', ''];
let tttPlayer = 'X';

function initTicTacToe() {
    tttBoard = ['', '', '', '', '', '', '', '', ''];
    tttPlayer = 'X';
    let html = '<div class="ttt-grid">';
    for(let i=0; i<9; i++) {
        html += `<div class="ttt-cell" onclick="tttMove(${i})" id="ttt-${i}"></div>`;
    }
    html += '</div><div id="gameStatus">> Awaiting Input: Entity X...</div>';
    html += '<button class="rps-btn" style="margin-top:20px; border-color:var(--alert-red); color:var(--alert-red);" onclick="initTicTacToe()">WIPE_BOARD</button>';
    gameContainer.innerHTML = html;
}

function tttMove(idx) {
    if (tttBoard[idx] !== '') return;
    playBeep(600);
    tttBoard[idx] = tttPlayer;
    document.getElementById(`ttt-${idx}`).innerText = tttPlayer;
    
    if (checkTTTWin()) {
        document.getElementById('gameStatus').innerText = `// FATAL ERROR: ENTITY ${tttPlayer} DOMINATES`;
        playBeep(1200);
        tttBoard = tttBoard.map(x => x || ' '); 
        return;
    }
    if (!tttBoard.includes('')) {
        document.getElementById('gameStatus').innerText = `// MUTUAL DESTRUCTION [DRAW]`;
        return;
    }
    tttPlayer = tttPlayer === 'X' ? 'O' : 'X';
    document.getElementById('gameStatus').innerText = `> Awaiting Input: Entity ${tttPlayer}...`;
}

function checkTTTWin() {
    const wins = [ [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6] ];
    return wins.some(comb => tttBoard[comb[0]] !== '' && tttBoard[comb[0]] === tttBoard[comb[1]] && tttBoard[comb[1]] === tttBoard[comb[2]]);
}

function initRPS() {
    gameContainer.innerHTML = `
        <div style="margin-bottom: 20px; color: var(--text-muted);">> Select weapon handshake:</div>
        <button class="rps-btn" onclick="playRPS('ROCK')">ROCK</button>
        <button class="rps-btn" onclick="playRPS('PAPER')">PAPER</button>
        <button class="rps-btn" onclick="playRPS('SCISSORS')">SCISSORS</button>
        <div id="gameStatus" style="margin-top: 30px; font-family: 'Special Elite', monospace; color: var(--accent-cyan); font-size: 1.5rem;"></div>
    `;
}

function playRPS(playerMove) {
    const moves = ['ROCK', 'PAPER', 'SCISSORS'];
    const compMove = moves[Math.floor(Math.random() * moves.length)];
    let result = '';
    
    if (playerMove === compMove) result = 'COLLISION [DRAW]';
    else if (
        (playerMove === 'ROCK' && compMove === 'SCISSORS') ||
        (playerMove === 'PAPER' && compMove === 'ROCK') ||
        (playerMove === 'SCISSORS' && compMove === 'PAPER')
    ) {
        result = 'USER BYPASS SUCCESS [WIN]';
        playBeep(1000);
    } else {
        result = 'SYSTEM OVERRIDE [LOSE]';
        playBeep(200);
    }
    
    document.getElementById('gameStatus').innerHTML = `
        USER_REQ: [${playerMove}]<br>
        SYS_RESP: [${compMove}]<br><br>
        <span style="color: var(--text-primary);">> ${result} <</span>
    `;
}

// 6. CUSTOM CURSOR TRACKING & INTERACTION
const cursor = document.getElementById('terminal-cursor');

document.addEventListener('mousemove', (e) => {
    requestAnimationFrame(() => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
});

// Event Delegation for hover effects (works on dynamically created game buttons too)
document.addEventListener('mouseover', (e) => {
    if (e.target.closest('.nav-card, .info-card, button, .ttt-cell, ion-icon, .close-btn')) {
        cursor.classList.add('active');
    }
});
document.addEventListener('mouseout', (e) => {
    if (e.target.closest('.nav-card, .info-card, button, .ttt-cell, ion-icon, .close-btn')) {
        cursor.classList.remove('active');
    }
});

// 7. UTILITY & OMEGA OVERRIDE (SHIFT + K)
function scrollToSection(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

let isHackerMode = false;
document.addEventListener('keydown', (event) => {
    if (event.shiftKey && event.key.toLowerCase() === 'k') {
        isHackerMode = !isHackerMode; 
        playBeep(isHackerMode ? 1200 : 300); 
        
        document.body.classList.toggle('hacker-mode');
        document.getElementById('standard-ops').classList.toggle('hidden-state');
        document.getElementById('black-ops').classList.toggle('hidden-state');

        if (isHackerMode) {
            document.getElementById('main-title').innerHTML = "SYSTEM<br>COMPROMISED";
            document.getElementById('main-subtitle').innerHTML = "// ROOT ACCESS GRANTED // BLACK SITE SECURED";
            document.getElementById('footer-text').innerHTML = "UNAUTHORIZED ACCESS DETECTED // LOCATION PINGED";
            matrixInterval = setInterval(drawMatrix, 33); 
        } else {
            document.getElementById('main-title').innerHTML = "K8BH<br>SYS_ARCHIVE";
            document.getElementById('main-subtitle').innerHTML = "// AKA KAUSTUBH PATIL // AGE: 14 // DEV & R&D<br>Status: Compiling the Future...";
            document.getElementById('footer-text').innerHTML = "K8BH_DEV (KAUSTUBH PATIL) &copy; 2026 // SYSTEM SECURE";
            clearInterval(matrixInterval); 
            ctx.clearRect(0, 0, canvas.width, canvas.height); 
        }
    }
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});