/**
 * DG8WA (Seb's) CW Arcade ICR Trainer
 * Developed with AI Assistance
 * Version 1.8.1
 */

function toggleHelpModal(show) {
    document.getElementById('help-modal').style.display = show ? 'flex' : 'none';
}

function updateVal(type) {
    const wpm = parseInt(document.getElementById('wpm').value);
    let keyhit = parseInt(document.getElementById('keyhit-delay').value);

    if (type === 'wpm') {
        document.getElementById('wpm-val').innerText = wpm;

        let autoIcr = Math.round(3600 / wpm);
        let autoTts = autoIcr + keyhit + 150;

        document.getElementById('icr-target').value = autoIcr;
        document.getElementById('icr-val').innerText = autoIcr;

        document.getElementById('tts-delay').value = autoTts;
        document.getElementById('tts-val').innerText = autoTts;
    }

    if (type === 'keyhit') {
        document.getElementById('keyhit-val').innerText = keyhit;

        let icr = parseInt(document.getElementById('icr-target').value);
        let autoTts = icr + keyhit + 150;

        document.getElementById('tts-delay').value = autoTts;
        document.getElementById('tts-val').innerText = autoTts;
    }

    if (type === 'pitch') document.getElementById('pitch-val').innerText = document.getElementById('pitch').value;
    if (type === 'duration') document.getElementById('duration-val').innerText = document.getElementById('run-duration').value;
    if (type === 'icr') document.getElementById('icr-val').innerText = document.getElementById('icr-target').value;
    if (type === 'tts') document.getElementById('tts-val').innerText = document.getElementById('tts-delay').value;
    if (type === 'noise') document.getElementById('noise-val').innerText = document.getElementById('noise-vol').value;
    saveSettings();
}

const langSpecialChars = {
    'de-DE': ["Ä", "Ö", "Ü", "CH"],
    'en-US': [],
    'es-ES': ["Ñ", "¿", "¡"],
    'fr-FR': ["À", "É", "Ç"]
};

const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
const numbers = ["0","1","2","3","4","5","6","7","8","9"];
const standardSigns = [".", ",", "?", "=", "/", "!", "_", "@", "-", "+"];

function renderCharacterCheckboxes(preserveState = false) {
    const lang = document.getElementById('tts-lang') ? document.getElementById('tts-lang').value : 'de-DE';
    const specials = langSpecialChars[lang] || [];

    let checkedStates = {};
    if (preserveState) {
        document.querySelectorAll('#setup-screen input[type="checkbox"]').forEach(cb => {
            checkedStates[cb.value] = cb.checked;
        });
    }

    const groupAlpha = document.getElementById('group-alpha');
    groupAlpha.innerHTML = alphabet.map(char => `
        <label class="checkbox-label">
            <input type="checkbox" value="${char}" ${preserveState && checkedStates[char] !== undefined ? (checkedStates[char] ? 'checked' : '') : (/^[A-Z]$/.test(char) ? 'checked' : '')}> ${char}
        </label>
    `).join('');

    const groupNum = document.getElementById('group-num');
    groupNum.innerHTML = numbers.map(char => `
        <label class="checkbox-label">
            <input type="checkbox" value="${char}" ${preserveState && checkedStates[char] !== undefined ? (checkedStates[char] ? 'checked' : '') : ''}> ${char}
        </label>
    `).join('');

    const groupSigns = document.getElementById('group-signs');
    groupSigns.innerHTML = standardSigns.map(char => `
        <label class="checkbox-label">
            <input type="checkbox" value="${char}" ${preserveState && checkedStates[char] !== undefined ? (checkedStates[char] ? 'checked' : '') : ''}> ${char}
        </label>
    `).join('');

    const groupLang = document.getElementById('group-lang');
    if (specials.length > 0) {
        groupLang.parentElement.style.display = 'block';
        groupLang.innerHTML = specials.map(char => `
            <label class="checkbox-label">
                <input type="checkbox" value="${char}" ${preserveState && checkedStates[char] !== undefined ? (checkedStates[char] ? 'checked' : '') : ''}> ${char}
            </label>
        `).join('');
    } else {
        groupLang.parentElement.style.display = 'none';
    }
}

function changeLanguage() {
    renderCharacterCheckboxes(true);
    saveSettings();
}

function setPreset(type) {
    clearAll(); // Exclusive selection!
    const checkboxes = document.querySelectorAll('#setup-screen input[type="checkbox"]');
    
    if (type === 'koch') {
        const kochList = ['K', 'M', 'R', 'S', 'U', 'A', 'P', 'T', 'L', 'O', 'W', 'I', '.', 'N', 'J', 'E', 'F', '0', 'Y', 'V', 'G', '5', '/', 'Q', '9', 'Z', 'H', '3', '8', 'B', '?', '4', '2', '7', 'C', '1', 'D', '6', 'X'];
        checkboxes.forEach(cb => {
            if (kochList.includes(cb.value)) cb.checked = true;
        });
    } else {
        checkboxes.forEach(cb => {
            const val = cb.value;
            if (type === 'alpha' && alphabet.includes(val)) cb.checked = true;
            if (type === 'num' && numbers.includes(val)) cb.checked = true;
            if (type === 'signs' && standardSigns.includes(val)) cb.checked = true;
            if (type === 'lang' && !alphabet.includes(val) && !numbers.includes(val) && !standardSigns.includes(val)) cb.checked = true;
        });
    }
    saveSettings();
}

function clearAll() {
    document.querySelectorAll('#setup-screen input[type="checkbox"]').forEach(cb => cb.checked = false);
    saveSettings();
}

function handleModeChange() {
    const mode = document.getElementById('game-mode').value;
    const durationSec = document.getElementById('duration-section');
    durationSec.style.display = (mode === 'time' || mode === 'listen') ? 'flex' : 'none';
    saveSettings();
}

function saveSettings() {
    const allBoxes = Array.from(document.querySelectorAll('#setup-screen input[type="checkbox"]'));
    const settings = {
        gameMode: document.getElementById('game-mode').value,
        ttsLang: document.getElementById('tts-lang').value,
        wpm: document.getElementById('wpm').value,
        pitch: document.getElementById('pitch').value,
        duration: document.getElementById('run-duration').value,
        icr: document.getElementById('icr-target').value,
        keyhit: document.getElementById('keyhit-delay').value,
        tts: document.getElementById('tts-delay').value,
        noise: document.getElementById('noise-vol').value,
        chars: allBoxes.map(cb => ({ val: cb.value, checked: cb.checked }))
    };
    localStorage.setItem('cw_arcade_settings', JSON.stringify(settings));
}

function loadSettings() {
    const saved = localStorage.getItem('cw_arcade_settings');
    if (!saved) {
        const navLang = navigator.language || navigator.userLanguage || 'de';
        let matchedLang = 'en-US';
        if (navLang.startsWith('de')) matchedLang = 'de-DE';
        else if (navLang.startsWith('es')) matchedLang = 'es-ES';
        else if (navLang.startsWith('fr')) matchedLang = 'fr-FR';
        document.getElementById('tts-lang').value = matchedLang;
        renderCharacterCheckboxes(false);
        return;
    }
    try {
        const s = JSON.parse(saved);
        if (s.gameMode) { document.getElementById('game-mode').value = s.gameMode; handleModeChange(); }
        if (s.ttsLang) { document.getElementById('tts-lang').value = s.ttsLang; }
        
        renderCharacterCheckboxes(false);

        if (s.wpm) { document.getElementById('wpm').value = s.wpm; document.getElementById('wpm-val').innerText = s.wpm; }
        if (s.pitch) { document.getElementById('pitch').value = s.pitch; document.getElementById('pitch-val').innerText = s.pitch; }
        if (s.duration) { document.getElementById('run-duration').value = s.duration; document.getElementById('duration-val').innerText = s.duration; }
        if (s.icr) { document.getElementById('icr-target').value = s.icr; document.getElementById('icr-val').innerText = s.icr; }
        if (s.keyhit) { document.getElementById('keyhit-delay').value = s.keyhit; document.getElementById('keyhit-val').innerText = s.keyhit; }
        if (s.tts) { document.getElementById('tts-delay').value = s.tts; document.getElementById('tts-val').innerText = s.tts; }
        if (s.noise !== undefined) { document.getElementById('noise-vol').value = s.noise; document.getElementById('noise-val').innerText = s.noise; }
        
        if (s.chars) {
            const allBoxes = document.querySelectorAll('#setup-screen input[type="checkbox"]');
            s.chars.forEach(item => {
                const targetVal = (typeof item === 'object') ? item.val : item;
                const targetChecked = (typeof item === 'object') ? item.checked : true;
                allBoxes.forEach(cb => {
                    if (cb.value === targetVal) {
                        cb.checked = targetChecked;
                    }
                });
            });
        }
    } catch(e) {
        console.error("Settings load error:", e);
    }
}

// Global Web Audio Context & Mobile Unlock Setup
let audioCtx = null;
let noiseNode = null;
let noiseGainNode = null;

function unlockAudio() {
    if (!audioCtx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) audioCtx = new AudioCtx();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    if (audioCtx) {
        try {
            const buffer = audioCtx.createBuffer(1, 1, 22050);
            const source = audioCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(audioCtx.destination);
            source.start(0);
        } catch(e) {}
    }
}

document.addEventListener('touchstart', unlockAudio, { once: true });
document.addEventListener('click', unlockAudio, { once: true });

async function initAudio() {
    unlockAudio();
}

let cachedVoices = [];
function initVoices() {
    if ('speechSynthesis' in window) {
        cachedVoices = window.speechSynthesis.getVoices();
    }
}

if ('speechSynthesis' in window) {
    initVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = initVoices;
    }
}

function getBestVoiceForLang(langCode) {
    let voices = ('speechSynthesis' in window) ? window.speechSynthesis.getVoices() : [];
    if (!voices || voices.length === 0) voices = cachedVoices;
    if (!voices || voices.length === 0) return null;

    const targetFull = langCode.toLowerCase().replace('_', '-');
    const targetPrefix = targetFull.split('-')[0];

    let match = voices.find(v => v.lang.toLowerCase().replace('_', '-') === targetFull && v.localService) ||
                voices.find(v => v.lang.toLowerCase().replace('_', '-') === targetFull) ||
                voices.find(v => v.lang.toLowerCase().startsWith(targetPrefix) && v.localService) ||
                voices.find(v => v.lang.toLowerCase().startsWith(targetPrefix));

    return match || null;
}

async function startWhiteNoise(volumePercent) {
    if (volumePercent <= 0) {
        stopWhiteNoise();
        return;
    }
    await initAudio();
    stopWhiteNoise();

    if (!audioCtx) return;

    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }

    noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = noiseBuffer;
    noiseNode.loop = true;

    noiseGainNode = audioCtx.createGain();
    const normalizedGain = (volumePercent / 100) * 0.08;
    noiseGainNode.gain.setValueAtTime(normalizedGain, audioCtx.currentTime);

    noiseNode.connect(noiseGainNode);
    noiseGainNode.connect(audioCtx.destination);
    noiseNode.start();
}

function stopWhiteNoise() {
    if (noiseNode) {
        try { noiseNode.stop(); } catch(e){}
        noiseNode.disconnect();
        noiseNode = null;
    }
    if (noiseGainNode) {
        noiseGainNode.disconnect();
        noiseGainNode = null;
    }
}

const morseDict = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', 
    'Ä': '.-.-', 'Ö': '---.', 'Ü': '..--', 'CH': '----', 'Ñ': '--.--', '¿': '..-.-', '¡': '--.--', 'À': '.--.-', 'É': '..-..', 'Ç': '-.-..',
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', 
    '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
    '.': '.-.-.-', ',': '--..--', '?': '..--..', '=': '-...-', '/': '-..-.', 
    '!': '-.-.--', '_': '..--.-', '@': '.--.-.', '-': '-....-', '+': '.-.-.'
};

function getMorseDurationMs(char, wpm) {
    const code = morseDict[char];
    if (!code) return 500;
    const dotDuration = 1.2 / wpm; 
    let seconds = 0;
    code.split('').forEach(sym => {
        seconds += (sym === '.' ? dotDuration : dotDuration * 3) + dotDuration;
    });
    seconds += dotDuration * 2;
    return seconds * 1000;
}

async function playTone(freq, durationMs) {
    await initAudio();
    if (!audioCtx) {
        await new Promise(r => setTimeout(r, durationMs));
        return;
    }

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.005);
    gain.gain.linearRampToValueAtTime(0.25, now + (durationMs / 1000) - 0.005);
    gain.gain.linearRampToValueAtTime(0, now + (durationMs / 1000));

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + (durationMs / 1000));

    await new Promise(resolve => setTimeout(resolve, durationMs));
}

async function playMorseSequence(text, wpm, pitch) {
    await initAudio();
    if (!audioCtx) {
        await new Promise(r => setTimeout(r, 500));
        return;
    }

    const dotDuration = 1.2 / wpm; 
    let time = audioCtx.currentTime + 0.05;

    text.toUpperCase().split('').forEach(char => {
        if (char === ' ') {
            time += dotDuration * 7;
            return;
        }
        const code = morseDict[char];
        if (!code) return;

        code.split('').forEach(symbol => {
            const dur = symbol === '.' ? dotDuration : dotDuration * 3;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.value = pitch;

            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.25, time + 0.005);
            gain.gain.linearRampToValueAtTime(0.25, time + dur - 0.005);
            gain.gain.linearRampToValueAtTime(0, time + dur);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(time);
            osc.stop(time + dur);

            time += dur + dotDuration;
        });
        time += dotDuration * 2;
    });

    const totalDurationMs = Math.max(0, (time - audioCtx.currentTime) * 1000);
    await new Promise(resolve => setTimeout(resolve, totalDurationMs));
}

function playMorse(char, wpm, pitch) {
    return playMorseSequence(char, wpm, pitch);
}

function speakCharacter(char) {
    return new Promise((resolve) => {
        if (!('speechSynthesis' in window)) {
            resolve();
            return;
        }

        window.speechSynthesis.cancel();
        
        const selectedLang = document.getElementById('tts-lang').value;
        
        const localizedNames = {
            'de-DE': { 
                'A': 'A', 'B': 'Be', 'C': 'Ce', 'D': 'De', 'E': 'E', 'F': 'Ef', 'G': 'Ge', 'H': 'Ha', 
                'I': 'I', 'J': 'Yott', 'K': 'Ka', 'L': 'El', 'M': 'Em', 'N': 'En', 'O': 'O', 'P': 'Pe', 
                'Q': 'Ku', 'R': 'Er', 'S': 'Es', 'T': 'Te', 'U': 'U', 'V': 'Vau', 'W': 'We', 'X': 'Iks', 
                'Y': 'Ypsilon', 'Z': 'Zet', 'Ä': 'Ä', 'Ö': 'Ö', 'Ü': 'Ü', 'CH': 'C H',
                '@': 'At-Zeichen', '-': 'Bindestrich', '+': 'Plus', '.': 'Punkt', ',': 'Komma', 
                '?': 'Fragezeichen', '=': 'Gleich', '/': 'Schrägstrich', '!': 'Ausrufezeichen', '_': 'Unterstrich'
            },
            'en-US': { 
                'A': 'A', 'B': 'B', 'C': 'C', 'D': 'D', 'E': 'E', 'F': 'F', 'G': 'G', 'H': 'H',
                'I': 'I', 'J': 'J', 'K': 'K', 'L': 'L', 'M': 'M', 'N': 'N', 'O': 'O', 'P': 'P',
                'Q': 'Q', 'R': 'R', 'S': 'S', 'T': 'T', 'U': 'U', 'V': 'V', 'W': 'W', 'X': 'X',
                'Y': 'Y', 'Z': 'Z', 'CH': 'C H',
                '@': 'At symbol', '-': 'Hyphen', '+': 'Plus', '.': 'Period', ',': 'Comma',
                '?': 'Question mark', '=': 'Equals', '/': 'Slash', '!': 'Exclamation mark', '_': 'Underscore'
            },
            'es-ES': { 
                'Y': 'I griega', 'V': 'Uve', 'W': 'Doble ve', 'Z': 'Zeta', 'CH': 'C H',
                '@': 'Arroba', '-': 'Guion', '+': 'Más'
            },
            'fr-FR': { 
                'Y': 'I grec', 'W': 'Double v', 'Z': 'Zède', 'CH': 'C H',
                '@': 'Arobase', '-': 'Tiret', '+': 'Plus'
            }
        };

        let textToSpeak = (localizedNames[selectedLang] && localizedNames[selectedLang][char]) ? localizedNames[selectedLang][char] : char;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = selectedLang; // Robust lang assignment for iframe / html-preview

        const chosenVoice = getBestVoiceForLang(selectedLang);
        if (chosenVoice) {
            utterance.voice = chosenVoice;
            utterance.lang = chosenVoice.lang;
        }

        utterance.rate = 1.0;

        let resolved = false;
        const complete = () => {
            if (!resolved) {
                resolved = true;
                resolve();
            }
        };

        utterance.onend = complete;
        utterance.onerror = complete;
        
        setTimeout(complete, 1200);

        window.speechSynthesis.speak(utterance);
    });
}

async function playPositiveSound() {
    await initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1000, now + 0.12);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
    await new Promise(r => setTimeout(r, 250));
}

async function playNegativeSound() {
    await initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.3);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
    await new Promise(r => setTimeout(r, 350));
}

let isPlaying = false;
let isPaused = false;
let currentGameMode = "time";
let currentTargetChar = "";
let startTime = 0;
let score = 0;
let streak = 0;
let lives = 5;
let timeLeft = 120;
let timerInterval = null;
let waitingForInput = false;
let ttsTimeoutHandle = null;

let sessionStats = {};
let badCharsMode = false;
let lastSessionBadChars = [];
let totalCompletedCharsCount = 0;
let targetMetCount = 0;
let totalElapsedActiveMs = 0;
let showAllLeaderboard = false;
let activeLbTab = "time";

async function startGame(withBadChars = false) {
    try {
        await initAudio();
    } catch(e) {}

    const checked = document.querySelectorAll('#setup-screen input[type="checkbox"]:checked');
    if (checked.length === 0) {
        alert("Please select at least one character set!");
        return;
    }

    saveSettings();

    if (timerInterval) clearInterval(timerInterval);
    if (ttsTimeoutHandle) clearTimeout(ttsTimeoutHandle);

    document.getElementById('setup-screen').style.display = 'none';
    document.getElementById('summary-screen').style.display = 'none';
    document.getElementById('trainer-screen').style.display = 'block';

    currentGameMode = document.getElementById('game-mode').value;
    const durationMins = parseInt(document.getElementById('run-duration').value || "2");
    const wpm = parseInt(document.getElementById('wpm').value || "35");
    const pitch = parseInt(document.getElementById('pitch').value || "600");
    const noiseVol = parseInt(document.getElementById('noise-vol').value || "0");

    startWhiteNoise(noiseVol);

    const modeTxt = document.getElementById('hud-txt-mode');
    const hintTxt = document.getElementById('hud-hint');

    if (currentGameMode === 'time' || currentGameMode === 'listen') {
        timeLeft = durationMins * 60;
        if (modeTxt) modeTxt.innerText = currentGameMode === 'listen' ? "Listen" : "Time";
        document.getElementById('hud-time').innerText = `${timeLeft}s`;
    } else {
        lives = 5;
        if (modeTxt) modeTxt.innerText = "Battle";
        updateLivesDisplay();
    }

    if (hintTxt) {
        hintTxt.innerText = currentGameMode === 'listen' 
            ? "Listen Mode: Relax & Listen (Spacebar = Pause)" 
            : "Type recognized character (Spacebar = Pause)";
    }

    isPlaying = true;
    isPaused = false;
    document.getElementById('pause-btn').innerText = "Pause";
    score = 0;
    streak = 0;
    sessionStats = {};
    badCharsMode = withBadChars;
    totalCompletedCharsCount = 0;
    targetMetCount = 0;
    totalElapsedActiveMs = 0;

    document.getElementById('hud-score').innerText = "0";
    document.getElementById('hud-streak').innerText = "0 🔥";

    const display = document.getElementById('display-box');
    display.style.color = '#fff';

    display.innerText = "BENS BEST BENT WIRE";
    await playMorseSequence("BENS BEST BENT WIRE", wpm, pitch);
    if (!isPlaying) return;

    await new Promise(r => setTimeout(r, 400));
    if (!isPlaying) return;

    const countdownTones = [
        { num: "3", freq: pitch },
        { num: "2", freq: pitch },
        { num: "1", freq: pitch * 0.7 }
    ];

    for (let step of countdownTones) {
        if (!isPlaying) return;
        display.innerText = step.num;
        await playTone(step.freq, 180);
        await new Promise(r => setTimeout(r, 600));
    }

    if (!isPlaying) return;
    display.innerText = "GO!";
    await new Promise(r => setTimeout(r, 400));

    timerInterval = setInterval(() => {
        if (!isPaused && isPlaying) {
            totalElapsedActiveMs += 1000;
            if (currentGameMode === 'time' || currentGameMode === 'listen') {
                timeLeft--;
                document.getElementById('hud-time').innerText = `${timeLeft}s`;
                if (timeLeft <= 0) {
                    stopGame(false);
                }
            }
        }
    }, 1000);

    nextRound();
}

function togglePause() {
    if (!isPlaying) return;
    isPaused = !isPaused;
    const btn = document.getElementById('pause-btn');
    const display = document.getElementById('display-box');
    
    if (isPaused) {
        btn.innerText = "Resume";
        display.innerText = "PAUSE";
        clearTimeout(ttsTimeoutHandle);
    } else {
        btn.innerText = "Pause";
        display.innerText = "*";
        startTime = performance.now();
        nextRound();
    }
}

async function stopGame(aborted = false) {
    isPlaying = false;
    isPaused = false;
    clearInterval(timerInterval);
    clearTimeout(ttsTimeoutHandle);
    stopWhiteNoise();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    if (aborted || currentGameMode === 'listen') {
        document.getElementById('trainer-screen').style.display = 'none';
        document.getElementById('setup-screen').style.display = 'block';
        return;
    }

    const callsign = document.getElementById('callsign').value.trim() || 'DG8WA';
    saveScore(callsign, score);
    showSummary();
}

function returnToSetup() {
    document.getElementById('summary-screen').style.display = 'none';
    document.getElementById('setup-screen').style.display = 'block';
}

function showSummary() {
    document.getElementById('trainer-screen').style.display = 'none';
    document.getElementById('summary-screen').style.display = 'block';

    document.getElementById('sum-score').innerText = score;

    let totalTimes = [];
    let detailsHtml = '';
    lastSessionBadChars = [];

    let charEntries = Object.keys(sessionStats).map(char => {
        let data = sessionStats[char];
        let avgTime = data.times.length ? Math.round(data.times.reduce((a,b)=>a+b,0) / data.times.length) : 9999;
        data.times.forEach(t => totalTimes.push(t));
        return { char, avgTime, count: data.times.length, errors: data.errors };
    });

    charEntries.sort((a, b) => b.avgTime - a.avgTime);

    let overallAvg = totalTimes.length ? Math.round(totalTimes.reduce((a,b)=>a+b,0) / totalTimes.length) : 0;
    document.getElementById('sum-count').innerText = totalCompletedCharsCount;
    document.getElementById('sum-avg').innerText = `${overallAvg} ms`;

    const wpm = parseInt(document.getElementById('wpm').value);
    const icrTargetMs = parseInt(document.getElementById('icr-target').value);
    const keyHitDelayMs = parseInt(document.getElementById('keyhit-delay').value || "200");
    const combinedTargetMs = icrTargetMs + keyHitDelayMs;

    let avgCharDurationMs = 700;
    if (totalCompletedCharsCount > 0 && totalTimes.length > 0) {
        const sampleChar = charEntries[0] ? charEntries[0].char : 'A';
        avgCharDurationMs = getMorseDurationMs(sampleChar, wpm) + combinedTargetMs;
    }
    const theoreticalMaxChars = Math.round(totalElapsedActiveMs / avgCharDurationMs);
    const icrEfficiency = theoreticalMaxChars > 0 ? Math.round((totalCompletedCharsCount / theoreticalMaxChars) * 100) : 0;
    const targetPercent = totalCompletedCharsCount > 0 ? Math.round((targetMetCount / totalCompletedCharsCount) * 100) : 0;

    document.getElementById('sum-icr-ratio').innerText = `${totalCompletedCharsCount} completed (Theoretical maximum: ~${theoreticalMaxChars})`;
    document.getElementById('sum-icr-percent').innerText = `ICR Efficiency: ${icrEfficiency}%`;
    document.getElementById('sum-target-percent').innerText = `Within Target Time (${combinedTargetMs} ms): ${targetPercent}% (${targetMetCount}/${totalCompletedCharsCount})`;

    if (charEntries.length === 0) {
        detailsHtml = `<div style="color:#666; text-align:center;">No runs recorded yet.</div>`;
    } else {
        detailsHtml = charEntries.map(entry => {
            if (entry.avgTime > overallAvg + 150 || entry.errors > 0) {
                lastSessionBadChars.push(entry.char);
            }
            const color = entry.avgTime > overallAvg + 150 ? 'var(--warning)' : (entry.errors > 0 ? 'var(--error)' : 'var(--success)');
            return `
                <div class="stat-row">
                    <span>Character: <strong style="color:#fff">${entry.char}</strong></span>
                    <span>Correct: ${entry.count} | Errors: ${entry.errors}</span>
                    <span style="color:${color}">Ø ${entry.avgTime} ms</span>
                </div>
            `;
        }).join('');
    }

    document.getElementById('sum-details').innerHTML = detailsHtml;
}

async function nextRound() {
    if (!isPlaying || isPaused) return;
    waitingForInput = false;
    clearTimeout(ttsTimeoutHandle);

    const checked = document.querySelectorAll('#setup-screen input[type="checkbox"]:checked');
    const baseChars = Array.from(checked).map(cb => cb.value);

    if (baseChars.length === 0) {
        stopGame(true);
        return;
    }

    let pool = [...baseChars];
    if (badCharsMode && lastSessionBadChars.length > 0) {
        baseChars.forEach(c => {
            if (lastSessionBadChars.includes(c)) {
                pool.push(c, c, c);
            }
        });
    }

    currentTargetChar = pool[Math.floor(Math.random() * pool.length)];

    if (!sessionStats[currentTargetChar]) {
        sessionStats[currentTargetChar] = { times: [], errors: 0 };
    }

    const display = document.getElementById('display-box');
    display.innerText = "*";
    display.style.color = '#fff';

    const wpm = parseInt(document.getElementById('wpm').value);
    const pitch = parseInt(document.getElementById('pitch').value);
    const ttsDelayMs = parseInt(document.getElementById('tts-delay').value);

    await playMorse(currentTargetChar, wpm, pitch);
    if (!isPlaying || isPaused) return;

    if (currentGameMode === 'listen') {
        const icrTargetMs = parseInt(document.getElementById('icr-target').value);
        const keyHitDelayMs = parseInt(document.getElementById('keyhit-delay').value || "200");
        const recognitionPauseMs = icrTargetMs + keyHitDelayMs;

        await new Promise(r => setTimeout(r, recognitionPauseMs));
        if (!isPlaying || isPaused) return;

        display.innerText = currentTargetChar;
        totalCompletedCharsCount++;
        await speakCharacter(currentTargetChar);
        await new Promise(r => setTimeout(r, 400));
        if (isPlaying && !isPaused) nextRound();
        return;
    }

    startTime = performance.now();
    waitingForInput = true;

    ttsTimeoutHandle = setTimeout(async () => {
        if (isPlaying && !isPaused && waitingForInput) {
            waitingForInput = false;
            display.innerText = currentTargetChar;
            streak = 0;
            document.getElementById('hud-streak').innerText = `${streak} 🔥`;
            sessionStats[currentTargetChar].errors++;

            if (currentGameMode === 'lives') {
                lives--;
                updateLivesDisplay();
                if (lives <= 0) {
                    await playNegativeSound();
                    await speakCharacter(currentTargetChar);
                    stopGame(false);
                    return;
                }
            }

            await playNegativeSound();
            await speakCharacter(currentTargetChar);

            if (isPlaying && !isPaused) nextRound();
        }
    }, ttsDelayMs);
}

function updateLivesDisplay() {
    const hudTime = document.getElementById('hud-time');
    if (hudTime && currentGameMode === 'lives') {
        let hearts = "";
        for (let i = 0; i < lives; i++) hearts += "❤️";
        for (let i = lives; i < 5; i++) hearts += "🖤";
        hudTime.innerHTML = hearts;
    }
}

window.addEventListener('keydown', async (e) => {
    const summaryVisible = document.getElementById('summary-screen').style.display === 'block';
    if (summaryVisible) {
        if (e.key === 'Enter') {
            e.preventDefault();
            startGame(false);
            return;
        }
        if (e.key === ' ') {
            e.preventDefault();
            startGame(true);
            return;
        }
    }

    if (!isPlaying) return;

    if (e.key === '/' || e.key === "'") {
        e.preventDefault();
    }

    if (e.key === ' ') {
        e.preventDefault();
        togglePause();
        return;
    }

    if (isPaused || !waitingForInput || currentGameMode === 'listen') return;

    if (e.key === 'Enter') {
        e.preventDefault();
        waitingForInput = false;
        clearTimeout(ttsTimeoutHandle);
        document.getElementById('display-box').innerText = currentTargetChar;
        streak = 0;
        document.getElementById('hud-streak').innerText = `${streak} 🔥`;
        
        sessionStats[currentTargetChar].errors++;

        if (currentGameMode === 'lives') {
            lives--;
            updateLivesDisplay();
            if (lives <= 0) {
                await playNegativeSound();
                await speakCharacter(currentTargetChar);
                stopGame(false);
                return;
            }
        }

        await playNegativeSound();
        await speakCharacter(currentTargetChar);
        if (isPlaying && !isPaused) nextRound();
        return;
    }

    let typedKey = e.key.toUpperCase();
    if (e.key === '.') typedKey = '.';
    if (e.key === ',') typedKey = ',';
    if (e.key === '?') typedKey = '?';
    if (e.key === '=') typedKey = '=';
    if (e.key === '/') typedKey = '/';
    if (e.key === '!') typedKey = '!';
    if (e.key === '_') typedKey = '_';
    if (e.key === '@') typedKey = '@';
    if (e.key === '-') typedKey = '-';
    if (e.key === '+') typedKey = '+';

    const checked = document.querySelectorAll('#setup-screen input[type="checkbox"]:checked');
    const activeChars = Array.from(checked).map(cb => cb.value);

    if (activeChars.includes(typedKey)) {
        e.preventDefault();
        waitingForInput = false;
        clearTimeout(ttsTimeoutHandle);
        const duration = performance.now() - startTime;
        document.getElementById('display-box').innerText = currentTargetChar;

        const icrTargetMs = parseInt(document.getElementById('icr-target').value);
        const keyHitDelayMs = parseInt(document.getElementById('keyhit-delay').value || "200");
        const combinedTargetMs = icrTargetMs + keyHitDelayMs;
        const ttsDelayMs = parseInt(document.getElementById('tts-delay').value);

        if (typedKey === currentTargetChar) {
            totalCompletedCharsCount++;
            sessionStats[currentTargetChar].times.push(duration);

            let basePoints = 1;
            if (duration <= combinedTargetMs) {
                targetMetCount++;
                const speedRatio = 1 - (duration / combinedTargetMs);
                basePoints = 4 + Math.round(speedRatio * 2);
            } else if (duration <= ttsDelayMs) {
                const marginRatio = 1 - ((duration - combinedTargetMs) / (ttsDelayMs - combinedTargetMs));
                basePoints = 1 + Math.round(marginRatio * 2);
            } else {
                basePoints = 1;
            }

            streak++;
            const streakMultiplier = Math.min(3.0, 1.0 + (Math.floor(streak / 5) * 0.5));
            const earnedPoints = Math.round(basePoints * streakMultiplier);

            score += earnedPoints;
            document.getElementById('hud-score').innerText = score;
            document.getElementById('hud-streak').innerText = `${streak} 🔥`;

            await playPositiveSound();
        } else {
            sessionStats[currentTargetChar].errors++;
            streak = 0;
            document.getElementById('hud-streak').innerText = `${streak} 🔥`;
            const display = document.getElementById('display-box');
            display.style.color = 'var(--error)';

            if (currentGameMode === 'lives') {
                lives--;
                updateLivesDisplay();
                if (lives <= 0) {
                    await playNegativeSound();
                    await speakCharacter(currentTargetChar);
                    stopGame(false);
                    return;
                }
            }

            await playNegativeSound();
            await speakCharacter(currentTargetChar);
        }

        if (isPlaying && !isPaused) nextRound();
    }
});

function saveScore(callsign, finalScore) {
    const wpm = document.getElementById('wpm').value;
    const pitch = document.getElementById('pitch').value;
    const duration = document.getElementById('run-duration').value;
    const icr = document.getElementById('icr-target').value;
    const keyhit = document.getElementById('keyhit-delay').value;
    const checked = document.querySelectorAll('#setup-screen input[type="checkbox"]:checked');
    const charCount = checked.length;
    
    let settingsDesc = "";
    let storageKey = "";

    if (currentGameMode === 'time') {
        storageKey = 'cw_arcade_lb_time';
        settingsDesc = `${duration} Min, ${wpm}WPM, ${pitch}Hz, ICR:${icr}+${keyhit}ms, ${charCount} Chars`;
    } else {
        storageKey = 'cw_arcade_lb_lives';
        settingsDesc = `Battle (5 Lives), ${wpm}WPM, ${pitch}Hz, ICR:${icr}+${keyhit}ms, ${charCount} Chars`;
    }

    let lb = JSON.parse(localStorage.getItem(storageKey) || '[]');
    lb.push({ callsign: callsign, score: finalScore, settings: settingsDesc, date: new Date().toLocaleDateString() });
    lb.sort((a, b) => b.score - a.score);
    localStorage.setItem(storageKey, JSON.stringify(lb));
    
    activeLbTab = currentGameMode;
    updateLbTabUI();
    renderLeaderboard();

    const mode = document.getElementById('backend-mode').value;
    if (mode === 'php') {
        const fd = new FormData();
        fd.append('callsign', callsign);
        fd.append('score', finalScore);
        fd.append('mode', currentGameMode);
        fd.append('settings', settingsDesc);
        fetch('', { method: 'POST', body: fd }).catch(e => {});
    }
}

function switchLbTab(tab) {
    activeLbTab = tab;
    showAllLeaderboard = false;
    updateLbTabUI();
    renderLeaderboard();
}

function updateLbTabUI() {
    const btnTime = document.getElementById('lb-tab-time');
    const btnLives = document.getElementById('lb-tab-lives');
    if (activeLbTab === 'time') {
        btnTime.style.background = 'var(--accent)';
        btnTime.style.color = '#000';
        btnLives.style.background = '#333';
        btnLives.style.color = 'var(--text)';
    } else {
        btnLives.style.background = 'var(--accent)';
        btnLives.style.color = '#000';
        btnTime.style.background = '#333';
        btnTime.style.color = 'var(--text)';
    }
}

function toggleLeaderboardView() {
    showAllLeaderboard = !showAllLeaderboard;
    renderLeaderboard();
}

function resetLeaderboard() {
    if (confirm("Do you really want to reset the local leaderboard for this mode?")) {
        const storageKey = activeLbTab === 'time' ? 'cw_arcade_lb_time' : 'cw_arcade_lb_lives';
        localStorage.removeItem(storageKey);
        showAllLeaderboard = false;
        renderLeaderboard();
    }
}

function renderLeaderboard() {
    const content = document.getElementById('lb-content');
    const controlsContainer = document.getElementById('lb-controls');
    const toggleBtn = document.getElementById('lb-toggle-btn');

    const storageKey = activeLbTab === 'time' ? 'cw_arcade_lb_time' : 'cw_arcade_lb_lives';
    const lb = JSON.parse(localStorage.getItem(storageKey) || '[]');

    if (lb.length === 0) {
        content.innerHTML = `<span style="color:#666">No runs recorded yet.</span>`;
        controlsContainer.style.display = 'none';
        return;
    }

    controlsContainer.style.display = 'flex';

    if (lb.length > 5) {
        toggleBtn.style.display = 'block';
        toggleBtn.innerText = showAllLeaderboard ? "Top 5" : `Show All (${lb.length})`;
    } else {
        toggleBtn.style.display = 'none';
    }

    const displayList = showAllLeaderboard ? lb : lb.slice(0, 5);

    content.innerHTML = displayList.map((item, idx) => `
        <div class="lb-item">
            <div class="lb-top">
                <span>#${idx+1} <strong>${item.callsign}</strong></span>
                <span style="color:var(--success)">${item.score} Pkts.</span>
            </div>
            <div class="lb-details">${item.settings || '-'} | ${item.date || ''}</div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
});
