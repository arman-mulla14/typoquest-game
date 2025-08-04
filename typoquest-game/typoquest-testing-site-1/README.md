# TypoQuest Testing Site

## Overview
The TypoQuest Testing Site is designed to facilitate testing of the TypoQuest application. It includes a main HTML document, JavaScript for testing functionalities, and CSS for styling the testing interface.

## Project Structure
```
typoquest-testing-site
├── src
│   ├── index.html          # Main HTML document for the testing site
│   ├── js
│   │   └── test.js        # JavaScript code for testing functionalities
│   └── css
│       └── test-styles.css # CSS styles for the testing site
```

## Instructions for Running Tests
1. Open `src/index.html` in a web browser.
2. The testing interface will load, allowing you to interact with the TypoQuest application.
3. Use the buttons and inputs provided to simulate user interactions and test various functionalities.

## Known Bugs and Non-Working Functions
- **Bug 1**: The "Export Data (CSV)" button does not trigger any action. This functionality needs to be implemented.
- **Bug 2**: The admin dashboard does not populate the table with user data. Ensure that the data fetching logic is correctly implemented in `test.js`.
- **Non-working Function**: The "Back to Game" button does not navigate back to the game screen. This requires debugging in the navigation logic.

## Future Improvements
- Implement the missing functionalities for exporting data and populating the admin table.
- Enhance the testing scripts to cover more user interactions and edge cases.
- Improve the styling in `test-styles.css` for better user experience.

## Contribution
Feel free to contribute by reporting bugs or suggesting improvements. Your feedback is valuable for enhancing the TypoQuest Testing Site.