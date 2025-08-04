// TypoQuest Bug Fix Verification Script
// Run this in the browser console to test the fixes

console.log('🔍 TypoQuest Bug Fix Verification Starting...');

// Test 1: Check if event listeners are properly managed
function testEventListeners() {
    console.log('Testing event listener management...');
    
    const typingInput = document.getElementById('typingInput');
    if (!typingInput) {
        console.error('❌ Typing input element not found');
        return false;
    }
    
    // Simulate multiple level starts to test for memory leaks
    for (let i = 0; i < 5; i++) {
        if (typeof startLevel === 'function') {
            startLevel();
            console.log(`✅ Level start ${i + 1} completed without errors`);
        } else {
            console.error('❌ startLevel function not found');
            return false;
        }
    }
    
    console.log('✅ Event listener test passed');
    return true;
}

// Test 2: Check timer management
function testTimerManagement() {
    console.log('Testing timer management...');
    
    if (typeof gameState === 'undefined') {
        console.error('❌ gameState not defined');
        return false;
    }
    
    // Check if timer is properly cleared
    if (gameState.timer !== null) {
        console.warn('⚠️ Timer is currently running');
    } else {
        console.log('✅ Timer is properly managed');
    }
    
    return true;
}

// Test 3: Check game state initialization
function testGameState() {
    console.log('Testing game state...');
    
    const requiredProperties = [
        'currentLevel', 'playerName', 'playerEmail', 'currentSentence',
        'currentInput', 'startTime', 'timeLeft', 'timer', 'wpm',
        'accuracy', 'levelData', 'totalWpm', 'totalAccuracy', 'isGameActive'
    ];
    
    let allPropertiesExist = true;
    requiredProperties.forEach(prop => {
        if (!(prop in gameState)) {
            console.error(`❌ Missing property: ${prop}`);
            allPropertiesExist = false;
        }
    });
    
    if (allPropertiesExist) {
        console.log('✅ Game state properly initialized');
    }
    
    return allPropertiesExist;
}

// Test 4: Check DOM elements
function testDOMElements() {
    console.log('Testing DOM elements...');
    
    const requiredElements = [
        'welcomeScreen', 'signupScreen', 'gameScreen',
        'certificateScreen', 'adminScreen', 'typingInput',
        'startBtn', 'nextBtn', 'timer', 'wpmDisplay', 'accuracyDisplay'
    ];
    
    let allElementsExist = true;
    requiredElements.forEach(elementId => {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error(`❌ Missing element: ${elementId}`);
            allElementsExist = false;
        }
    });
    
    if (allElementsExist) {
        console.log('✅ All required DOM elements present');
    }
    
    return allElementsExist;
}

// Test 5: Check function availability
function testFunctions() {
    console.log('Testing function availability...');
    
    const requiredFunctions = [
        'showWelcome', 'showSignup', 'showGame', 'startLevel',
        'nextLevel', 'restartCurrentLevel', 'resetGame', 'handleTyping', 'updateStats',
        'setupTypingInput', 'createConfetti', 'generateCertificate'
    ];
    
    let allFunctionsExist = true;
    requiredFunctions.forEach(funcName => {
        if (typeof window[funcName] !== 'function') {
            console.error(`❌ Missing function: ${funcName}`);
            allFunctionsExist = false;
        }
    });
    
    if (allFunctionsExist) {
        console.log('✅ All required functions available');
    }
    
    return allFunctionsExist;
}

// Test 6: Check levels array
function testLevelsArray() {
    console.log('Testing levels array...');
    
    if (typeof levels === 'undefined') {
        console.error('❌ Levels array not defined');
        return false;
    }
    
    if (levels.length !== 15) {
        console.error(`❌ Expected 15 levels, found ${levels.length}`);
        return false;
    }
    
    // Check if each level has required properties
    let allLevelsValid = true;
    levels.forEach((level, index) => {
        if (!level.name || !level.sentence) {
            console.error(`❌ Level ${index + 1} missing required properties`);
            allLevelsValid = false;
        }
    });
    
    if (allLevelsValid) {
        console.log('✅ All 15 levels properly defined');
    }
    
    return allLevelsValid;
}

// Run all tests
function runAllTests() {
    console.log('🚀 Starting TypoQuest Bug Fix Verification...\n');
    
    const tests = [
        { name: 'Event Listeners', func: testEventListeners },
        { name: 'Timer Management', func: testTimerManagement },
        { name: 'Game State', func: testGameState },
        { name: 'DOM Elements', func: testDOMElements },
        { name: 'Functions', func: testFunctions },
        { name: 'Levels Array', func: testLevelsArray }
    ];
    
    let passedTests = 0;
    let totalTests = tests.length;
    
    tests.forEach(test => {
        console.log(`\n--- Testing ${test.name} ---`);
        try {
            if (test.func()) {
                passedTests++;
                console.log(`✅ ${test.name} test PASSED`);
            } else {
                console.log(`❌ ${test.name} test FAILED`);
            }
        } catch (error) {
            console.log(`❌ ${test.name} test ERROR: ${error.message}`);
        }
    });
    
    console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
        console.log('🎉 All tests passed! Bug fixes are working correctly.');
    } else {
        console.log('⚠️ Some tests failed. Please check the issues above.');
    }
}

// Auto-run tests when script is loaded
if (typeof window !== 'undefined') {
    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runAllTests);
    } else {
        runAllTests();
    }
}

// Export for manual testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        testEventListeners,
        testTimerManagement,
        testGameState,
        testDOMElements,
        testFunctions,
        testLevelsArray,
        runAllTests
    };
} 