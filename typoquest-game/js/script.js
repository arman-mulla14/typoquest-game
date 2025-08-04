// --- TypoQuest Game State ---
let gameState = {
    currentLevel: 1,
    playerName: '',
    playerEmail: '',
    currentSentence: '',
    currentInput: '',
    startTime: 0,
    timeLeft: 60,
    timer: null,
    wpm: 0,
    accuracy: 100,
    levelData: [],
    totalWpm: 0,
    totalAccuracy: 0,
    isGameActive: false
};

// --- Level Data ---
const levels = [
    { name: "Musashi", sentence: "I love typing fast." },
    { name: "Tomoe", sentence: "The quick brown fox jumps over the lazy dog with incredible speed." },
    { name: "Yoshitsune", sentence: "Technology advances rapidly in our modern world, bringing new opportunities for everyone." },
    { name: "Benkei", sentence: "Mastering the art of typing requires dedication, practice, and consistent effort over extended periods." },
    { name: "Siro", sentence: "The ancient wisdom teaches us that persistence and patience are the fundamental keys to achieving mastery in any skill." }, // unchanged
    { name: "Kenshin", sentence: "In the digital age, effective communication through writing has become an essential skill for personal and professional success." },
    { name: "Shingen", sentence: "The symphony of keystrokes creates a rhythmic melody that resonates with the focused mind of a dedicated typist." },
    { name: "Masamune", sentence: "Speed without accuracy is meaningless, just as accuracy without reasonable speed limits productivity and efficiency in our fast-paced world." },
    { name: "Hanzo", sentence: "The art of touch typing transforms the keyboard into an extension of thought, allowing ideas to flow seamlessly from mind to screen." },
    { name: "Ethic", sentence: "Professional excellence demands not only technical proficiency but also unwavering commitment to quality, attention to detail, and continuous improvement." }, // unchanged
    { name: "Takeda", sentence: "Advanced typing skills unlock new dimensions of productivity, enabling complex thoughts and ideas to be captured and communicated with remarkable efficiency." },
    { name: "Ieyasu", sentence: "The journey from novice to expert typist involves countless hours of deliberate practice, muscle memory development, and the cultivation of sustained concentration." },
    { name: "Nobunaga", sentence: "True typing mastery represents the seamless integration of cognitive processing, motor skills, and technological interface, creating an almost telepathic connection between thought and text." },
    { name: "Hideyoshi", sentence: "The pinnacle of typing achievement is reached when the mechanical act of pressing keys disappears entirely, leaving only the pure expression of ideas flowing unimpeded from consciousness to digital reality." },
    { name: "Hicari", sentence: "In the final analysis, the master typist transcends mere mechanical proficiency to achieve a state of effortless flow where technology becomes invisible and communication becomes art, embodying the perfect synthesis of human creativity and digital precision." } // unchanged
];
// ...rest

// --- UI Navigation ---
function hideAllScreens() {
    ['welcomeScreen', 'signupScreen', 'gameScreen', 'certificateScreen', 'adminScreen'].forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
}
function showWelcome() {
    hideAllScreens();
    document.getElementById('welcomeScreen').classList.remove('hidden');
}
function showSignup() {
    hideAllScreens();
    document.getElementById('signupScreen').classList.remove('hidden');
}
function showDemo() {
    gameState.playerName = 'Demo Player';
    gameState.playerEmail = 'demo@typoquest.com';
    showGame();
}
function showGame() {
    hideAllScreens();
    document.getElementById('gameScreen').classList.remove('hidden');
    initializeLevel();
}
function showCertificate() {
    hideAllScreens();
    document.getElementById('certificateScreen').classList.remove('hidden');
    generateCertificate();
}
function showAdmin() {
    hideAllScreens();
    document.getElementById('adminScreen').classList.remove('hidden');
    loadAdminData();
}

// --- Game Logic ---
function startGame(event) {
    event.preventDefault();
    gameState.playerName = document.getElementById('playerName').value;
    gameState.playerEmail = document.getElementById('playerEmail').value;
    showGame();
}
function initializeLevel() {
    const level = levels[gameState.currentLevel - 1];
    gameState.currentSentence = level.sentence;
    gameState.timeLeft = Math.max(30, 90 - (gameState.currentLevel * 2));
    document.getElementById('levelTitle').textContent = `Level ${gameState.currentLevel}: "${level.name}"`;
    document.getElementById('currentLevel').textContent = gameState.currentLevel;
    document.getElementById('progressFill').style.width = (gameState.currentLevel / 15 * 100) + '%';
    document.getElementById('timer').textContent = gameState.timeLeft;
    document.getElementById('timer').classList.remove('warning');
    
    // Change background color based on level
    changeLevelBackground(gameState.currentLevel);
    
    displaySentence();
    resetInput();
    updateStats();
    document.getElementById('startBtn').disabled = false;
    document.getElementById('nextBtn').disabled = true;
    document.getElementById('restartBtn').style.display = 'none';
    document.getElementById('typingInput').disabled = true;
}
function displaySentence() {
    const sentenceDisplay = document.getElementById('sentenceDisplay');
    const chars = gameState.currentSentence.split('');
    sentenceDisplay.innerHTML = chars.map((char, idx) => `<span class="char" id="char-${idx}">${char}</span>`).join('');
}
function startLevel() {
    gameState.isGameActive = true;
    gameState.startTime = Date.now();
    document.getElementById('startBtn').disabled = true;
    document.getElementById('restartBtn').style.display = 'none';
    document.getElementById('typingInput').disabled = false;
    document.getElementById('typingInput').focus();
    startTimer();
    resetInput();
    setupTypingInput();
}
function startTimer() {
    clearInterval(gameState.timer);
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        document.getElementById('timer').textContent = gameState.timeLeft;
        
        // Add warning class when time is running low
        if (gameState.timeLeft <= 10) {
            document.getElementById('timer').classList.add('warning');
        }
        
        // End level when time runs out
        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timer);
            endLevel(false); // false = not completed, timeout occurred
        }
    }, 1000);
}
function handleTyping(event) {
    if (!gameState.isGameActive) return;
    gameState.currentInput = event.target.value;
    updateCharacterDisplay();
    updateStats();
    if (gameState.currentInput === gameState.currentSentence) endLevel(true);
}
function updateCharacterDisplay() {
    const chars = document.querySelectorAll('.char');
    const input = gameState.currentInput;
    chars.forEach((char, idx) => {
        char.classList.remove('correct', 'incorrect', 'current');
        if (idx < input.length) {
            char.classList.add(input[idx] === gameState.currentSentence[idx] ? 'correct' : 'incorrect');
        } else if (idx === input.length) {
            char.classList.add('current');
        }
    });
}
function updateStats() {
    if (!gameState.isGameActive) return;
    const timeElapsed = (Date.now() - gameState.startTime) / 1000 / 60;
    const wordsTyped = gameState.currentInput.length / 5;
    gameState.wpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
    let correctChars = 0;
    for (let i = 0; i < gameState.currentInput.length; i++) {
        if (gameState.currentInput[i] === gameState.currentSentence[i]) correctChars++;
    }
    gameState.accuracy = gameState.currentInput.length > 0 ?
        Math.round((correctChars / gameState.currentInput.length) * 100) : 100;
    document.getElementById('wpmDisplay').textContent = gameState.wpm;
    document.getElementById('accuracyDisplay').textContent = gameState.accuracy;
}
function endLevel(completed = false) {
    gameState.isGameActive = false;
    clearInterval(gameState.timer);
    document.getElementById('typingInput').disabled = true;
    
    // Check if it's a timeout scenario
    const isTimeout = gameState.timeLeft <= 0;
    
    // Only add to level data if completed or if it's a valid attempt
    if (completed || gameState.currentInput.length > 0) {
        gameState.levelData.push({
            level: gameState.currentLevel,
            wpm: gameState.wpm,
            accuracy: gameState.accuracy,
            completed: completed,
            completedSentence: gameState.currentInput === gameState.currentSentence,
            isTimeout: isTimeout
        });
    }
    
    if (completed && gameState.accuracy >= 85) {
        createConfetti();
        document.getElementById('nextBtn').disabled = false;
        if (gameState.currentLevel === 15) {
            setTimeout(() => {
                saveUserData();
                showCertificate();
            }, 2000);
        }
    } else {
        // Different messages for timeout vs low accuracy
        let message;
        if (isTimeout) {
            message = `⏰ Time's Up!\n\nLevel ${gameState.currentLevel} - Timeout\n\nWPM: ${gameState.wpm}\nAccuracy: ${gameState.accuracy}%\n\nDon't worry! You can retry this level.`;
        } else {
            message = `Level ${gameState.currentLevel} Complete!\n\nWPM: ${gameState.wpm}\nAccuracy: ${gameState.accuracy}%\n\n${gameState.accuracy >= 85 ? 'Great job! Ready for next level.' : 'Need 85%+ accuracy to proceed. Try again!'}`;
        }
        
        alert(message);
        document.getElementById('startBtn').disabled = false;
        document.getElementById('restartBtn').style.display = 'inline-block';
        
        // Automatically restart the current level after a short delay
        setTimeout(() => {
            restartCurrentLevel();
        }, 1500);
    }
}
function nextLevel() {
    if (gameState.currentLevel < 15) {
        gameState.currentLevel++;
        initializeLevel();
    }
}

function restartCurrentLevel() {
    // Reset the current level without changing the level number
    initializeLevel();
    // Automatically start the level
    startLevel();
    // Hide the retry button since we're starting fresh
    document.getElementById('restartBtn').style.display = 'none';
}
function resetGame() {
    clearInterval(gameState.timer);
    gameState = {
        currentLevel: 1,
        playerName: '',
        playerEmail: '',
        currentSentence: '',
        currentInput: '',
        startTime: 0,
        timeLeft: 60,
        timer: null,
        wpm: 0,
        accuracy: 100,
        levelData: [],
        totalWpm: 0,
        totalAccuracy: 0,
        isGameActive: false
    };
    showWelcome();
}
function resetInput() {
    const typingInput = document.getElementById('typingInput');
    typingInput.value = '';
    gameState.currentInput = '';
    const chars = document.querySelectorAll('.char');
    chars.forEach(char => char.classList.remove('correct', 'incorrect', 'current'));
    if (chars.length > 0) chars[0].classList.add('current');
}

function setupTypingInput() {
    const typingInput = document.getElementById('typingInput');
    // Remove any existing listeners to prevent duplicates
    typingInput.removeEventListener('input', handleTyping);
    typingInput.addEventListener('input', handleTyping);
}

function changeLevelBackground(level) {
    const body = document.body;
    const container = document.querySelector('.container');
    
    // Japanese samurai location backgrounds for each level
    const levelBackgrounds = {
        1: { // Musashi - Mount Fuji Dawn
            image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            overlay: 'rgba(255, 215, 0, 0.3)',
            accent: '#FF8C00'
        },
        2: { // Tomoe - Cherry Blossom Garden
            image: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            overlay: 'rgba(255, 182, 193, 0.2)',
            accent: '#FF69B4'
        },
        3: { // Yoshitsune - Bamboo Forest
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            overlay: 'rgba(34, 139, 34, 0.3)',
            accent: '#228B22'
        },
        4: { // Benkei - Japanese Temple
            image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            overlay: 'rgba(65, 105, 225, 0.3)',
            accent: '#0000CD'
        },
        5: { // Siro - Kyoto Streets
            image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            overlay: 'rgba(138, 43, 226, 0.3)',
            accent: '#8A2BE2'
        },
        6: { // Kenshin - Battlefield
            image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            overlay: 'rgba(139, 0, 0, 0.4)',
            accent: '#8B0000'
        },
        7: { // Shingen - Moonlit Castle
            image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            overlay: 'rgba(105, 105, 105, 0.3)',
            accent: '#696969'
        },
        8: { // Masamune - Forge Workshop
            image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            overlay: 'rgba(70, 130, 180, 0.3)',
            accent: '#1C1C1C'
        },
        9: { // Hanzo - Ninja Village
            image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            overlay: 'rgba(0, 0, 0, 0.5)',
            accent: '#000000'
        },
        10: { // Ethic - Golden Temple
            image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            overlay: 'rgba(255, 215, 0, 0.3)',
            accent: '#FF8C00'
        },
        11: { // Takeda - Autumn Mountains
            image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            overlay: 'rgba(255, 69, 0, 0.3)',
            accent: '#FF4500'
        },
        12: { // Ieyasu - Imperial Palace
            image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            overlay: 'rgba(255, 215, 0, 0.3)',
            accent: '#B8860B'
        },
        13: { // Nobunaga - Fire Festival
            image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            overlay: 'rgba(255, 69, 0, 0.4)',
            accent: '#B22222'
        },
        14: { // Hideyoshi - Snow Temple
            image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            overlay: 'rgba(255, 255, 255, 0.3)',
            accent: '#E6E6FA'
        },
        15: { // Hicari - Master's Garden
            image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            overlay: 'rgba(255, 107, 107, 0.2)',
            accent: '#FFEAA7'
        }
    };
    
    const background = levelBackgrounds[level] || levelBackgrounds[1];
    
    // Apply the background image with overlay
    body.style.background = `linear-gradient(${background.overlay}, ${background.overlay}), url('${background.image}')`;
    body.style.backgroundSize = 'cover';
    body.style.backgroundPosition = 'center';
    body.style.backgroundAttachment = 'fixed';
    
    // Update typing area background
    const typingArea = document.querySelector('.typing-area');
    if (typingArea) {
        typingArea.style.background = 'rgba(255, 255, 255, 0.1)';
        typingArea.style.backdropFilter = 'blur(10px)';
        typingArea.style.borderColor = background.accent;
    }
    
    // Update level info background
    const levelInfo = document.querySelector('.level-info');
    if (levelInfo) {
        levelInfo.style.background = 'rgba(255, 255, 255, 0.1)';
        levelInfo.style.backdropFilter = 'blur(10px)';
        levelInfo.style.borderColor = background.accent;
    }
    
    // Update timer color
    const timer = document.getElementById('timer');
    if (timer) {
        timer.style.color = background.accent;
    }
    
    // Update stat values color
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(stat => {
        stat.style.color = background.accent;
    });
    
    // Add a subtle animation
    body.style.transition = 'background 1s ease-in-out';
}

// --- Certificate & Confetti ---
function createConfetti() {
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 3 + 's';
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 3000);
        }, i * 50);
    }
}
function generateCertificate() {
    const totalLevels = gameState.levelData.length;
    gameState.totalWpm = Math.round(gameState.levelData.reduce((sum, level) => sum + level.wpm, 0) / totalLevels);
    gameState.totalAccuracy = Math.round(gameState.levelData.reduce((sum, level) => sum + level.accuracy, 0) / totalLevels);
    
    // Calculate additional stats
    const completedLevels = gameState.levelData.filter(level => level.completed).length;
    const perfectLevels = gameState.levelData.filter(level => level.accuracy === 100).length;
    const totalTimeSpent = gameState.levelData.reduce((sum, level) => sum + (level.timeSpent || 0), 0);
    
    // Set certificate data
    document.getElementById('certificateName').textContent = gameState.playerName;
    document.getElementById('avgWpm').textContent = gameState.totalWpm;
    document.getElementById('avgAccuracy').textContent = gameState.totalAccuracy;
    document.getElementById('completedLevels').textContent = completedLevels;
    
    // Generate unique certificate ID with timestamp
    const certificateId = 'TQ-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    document.getElementById('certificateId').textContent = certificateId;
    document.getElementById('certificateDate').textContent = new Date().toLocaleDateString();
    
    // Add achievement details if available (for backward compatibility)
    const achievementElement = document.getElementById('achievementDetails');
    if (achievementElement) {
        let achievementText = `Completed ${completedLevels}/15 levels`;
        if (perfectLevels > 0) {
            achievementText += ` | ${perfectLevels} perfect scores`;
        }
        if (gameState.totalWpm >= 80) {
            achievementText += ` | Speed Master`;
        }
        if (gameState.totalAccuracy >= 95) {
            achievementText += ` | Accuracy Master`;
        }
        achievementElement.textContent = achievementText;
    }
}
function downloadCertificate() {
    const completedLevels = gameState.levelData.filter(level => level.completed).length;
    const perfectLevels = gameState.levelData.filter(level => level.accuracy === 100).length;
    
    const certificateContent = `
╔══════════════════════════════════════════════════════════════╗
║                    TYPOQUEST CERTIFICATE                     ║
║                    OF EXCELLENCE                             ║
╚══════════════════════════════════════════════════════════════╝

This is to certify that ${gameState.playerName} has successfully 
completed all 15 levels of TypoQuest and demonstrated exceptional 
typing mastery.

╔══════════════════════════════════════════════════════════════╗
║                    FINAL ACHIEVEMENT                         ║
║                    Level 15 "Hicari" - The Master           ║
║                                                              ║
║  Average WPM: ${gameState.totalWpm}                                ║
║  Average Accuracy: ${gameState.totalAccuracy}%                       ║
║  Levels Completed: ${completedLevels}/15                          ║
║  Perfect Scores: ${perfectLevels}                                 ║
╚══════════════════════════════════════════════════════════════╝

Certificate ID: ${document.getElementById('certificateId').textContent}
Date: ${document.getElementById('certificateDate').textContent}

Congratulations on achieving typing mastery!
    `;
    const blob = new Blob([certificateContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TypoQuest_Certificate_${gameState.playerName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// --- Admin & Data ---
function saveUserData() {
    const userData = {
        name: gameState.playerName,
        email: gameState.playerEmail,
        levelReached: gameState.currentLevel,
        avgWpm: gameState.totalWpm,
        avgAccuracy: gameState.totalAccuracy,
        completionDate: new Date().toISOString(),
        levelData: gameState.levelData
    };
    let users = JSON.parse(localStorage.getItem('typoquestUsers') || '[]');
    users.push(userData);
    localStorage.setItem('typoquestUsers', JSON.stringify(users));
}
function loadAdminData() {
    const users = JSON.parse(localStorage.getItem('typoquestUsers') || '[]');
    const tableBody = document.getElementById('adminTableBody');
    if (users.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; opacity: 0.7;">No user data available</td></tr>';
        return;
    }
    tableBody.innerHTML = users.map(user => `
        <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.levelReached}</td>
            <td>${user.avgWpm}</td>
            <td>${user.avgAccuracy}%</td>
            <td>${new Date(user.completionDate).toLocaleDateString()}</td>
        </tr>
    `).join('');
}
function exportData() {
    const users = JSON.parse(localStorage.getItem('typoquestUsers') || '[]');
    if (users.length === 0) {
        alert('No data to export');
        return;
    }
    const csvContent = [
        ['Name', 'Email', 'Level Reached', 'Avg WPM', 'Avg Accuracy', 'Completion Date'].join(','),
        ...users.map(user => [
            user.name,
            user.email,
            user.levelReached,
            user.avgWpm,
            user.avgAccuracy + '%',
            new Date(user.completionDate).toLocaleDateString()
        ].join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'TypoQuest_User_Data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// --- Particles ---
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    particlesContainer.innerHTML = '';
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        particlesContainer.appendChild(particle);
    }
}

// --- Admin Access ---
function checkAdminAccess() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'track-secret-panel') {
        showAdmin();
        return true;
    }
    return false;
}

// --- Sample Data for Admin Demo ---
function addSampleData() {
    const sampleUsers = [
        {
            name: 'Alice Johnson',
            email: 'alice@example.com',
            levelReached: 15,
            avgWpm: 78,
            avgAccuracy: 94,
            completionDate: new Date(Date.now() - 86400000).toISOString(),
            levelData: []
        },
        {
            name: 'Bob Smith',
            email: 'bob@example.com',
            levelReached: 10,
            avgWpm: 65,
            avgAccuracy: 88,
            completionDate: new Date(Date.now() - 172800000).toISOString(),
            levelData: []
        },
        {
            name: 'Carol Davis',
            email: 'carol@example.com',
            levelReached: 15,
            avgWpm: 82,
            avgAccuracy: 96,
            completionDate: new Date(Date.now() - 259200000).toISOString(),
            levelData: []
        }
    ];
    const existingUsers = JSON.parse(localStorage.getItem('typoquestUsers') || '[]');
    if (existingUsers.length === 0) {
        localStorage.setItem('typoquestUsers', JSON.stringify(sampleUsers));
    }
}

// --- Event Listeners ---
window.addEventListener('load', function() {
    createParticles();
    addSampleData();
    if (!checkAdminAccess()) showWelcome();
});
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && !gameState.isGameActive) showWelcome();
    if (event.key === 'Enter' && !document.getElementById('startBtn').disabled && !gameState.isGameActive) startLevel();
});

// --- Expose functions for HTML buttons ---
window.showWelcome = showWelcome;
window.showSignup = showSignup;
window.showDemo = showDemo;
window.startGame = startGame;
window.startLevel = startLevel;
window.nextLevel = nextLevel;
window.restartCurrentLevel = restartCurrentLevel;
window.resetGame = resetGame;
window.downloadCertificate = downloadCertificate;
window.exportData = exportData;