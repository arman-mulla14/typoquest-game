// File: /typoquest-testing-site/typoquest-testing-site/src/js/test.js

// Function to simulate user input for the TypoQuest game
function simulateUserInput(playerName, playerEmail) {
    document.getElementById('playerName').value = playerName;
    document.getElementById('playerEmail').value = playerEmail;
    console.log(`Simulated input for player: ${playerName}, Email: ${playerEmail}`);
}

// Function to start the game and validate the signup process
function testSignup() {
    const playerName = "Test Player";
    const playerEmail = "test@example.com";
    
    simulateUserInput(playerName, playerEmail);
    
    const signupForm = document.querySelector('.signup-form');
    signupForm.dispatchEvent(new Event('submit'));
    
    console.log("Signup test completed.");
}

// Function to test the game level progression
function testLevelProgression() {
    const startButton = document.getElementById('startBtn');
    startButton.click();
    
    console.log("Level progression test started.");
    
    // Simulate typing and level completion
    setTimeout(() => {
        const nextButton = document.getElementById('nextBtn');
        nextButton.click();
        console.log("Level progression test completed.");
    }, 2000); // Simulate a delay for typing
}

// Function to validate the certificate generation
function testCertificateGeneration() {
    const certificateButton = document.querySelector('.certificate-screen .btn-primary');
    certificateButton.click();
    
    console.log("Certificate generation test completed.");
}

// Run all tests
function runTests() {
    testSignup();
    testLevelProgression();
    testCertificateGeneration();
}

// Execute tests when the document is fully loaded
document.addEventListener('DOMContentLoaded', runTests);