# Pocket Rancher

Welcome to **Pocket Rancher**, a fun and engaging game where you can take care of a monster on a ranch! Feed, play, train, and ensure your monster gets enough sleep to keep it happy and healthy. Watch out for its needs, as neglecting them might lead to negative moods or behaviors!

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [How to Play](#how-to-play)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Introduction

**Pocket Rancher** is a browser-based game built with JavaScript and the Phaser.js framework. It provides a unique experience where players manage a virtual ranch, taking care of their chosen monster by fulfilling its various needs, such as hunger, thirst, happiness, energy, and hygiene. The game introduces a needs and moods system, where the monster's mood is directly influenced by how well its needs are met.

## Features

- **Monster Care**: Feed, play, train, and let your monster sleep to maintain its stats.
- **Needs and Moods System**: Keep track of your monster's needs, such as hunger, thirst, energy, and hygiene.
- **Random Movement**: Monsters can move randomly around the ranch.
- **Egg Hatching System**: Hatch random monster types from eggs.
- **Multiple Ranch Locations**: Choose from various ranch locations, each affecting your monster's mood differently.
- **Currency and Inventory System**: Earn coins and buy items to take care of your monster.
- **Map and Market**: Navigate to different scenes like the market bazaar to buy items or view a map.
- **Responsive UI**: A user-friendly interface created with Bootstrap for buttons and menus.

## Installation

To set up the game locally, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/pocket-rancher.git
Navigate to the Project Directory:

bash
Copy code
cd pocket-rancher
Install Dependencies: Ensure you have Node.js and npm installed. Then, run:

bash
Copy code
npm install
Run the Game: Open index.html in your preferred web browser, or use a local server like VS Code Live Server extension or http-server:

bash
Copy code
npx http-server
Navigate to http://localhost:8080 (or your chosen port).

How to Play
Start the Game: Click on the 'Start Game' button on the main menu.
Setup Your Player: Choose your player name, ranch name, and starting monster.
Select a Ranch Location: Pick a ranch location from the dropdown menu. Each location affects your monster's mood differently.
Manage Your Monster: Use the dropdown menu to feed, play, train, and let your monster sleep. Keep an eye on its needs and moods.
Explore the Market: Use the in-game currency to buy items from the market that can help improve your monster's stats.
Keep Your Monster Happy: Ensure all needs are met to keep your monster in a positive mood. Avoid letting its stats drop too low, or your monster may become sad or even pass away.
Development
Technologies Used
JavaScript: Core programming language for game logic.
Phaser.js: A fast, free, and fun open-source framework for Canvas and WebGL powered browser games.
Bootstrap: For responsive UI components like buttons and dropdown menus.
HTML/CSS: For structuring and styling the game interface.
Project Structure
css
Copy code
pocket-rancher/
│
├── src/
│   ├── components/
│   │   └── dropDownMenu.js
│   ├── models/
│   │   └── Monster.js
│   ├── scenes/
│   │   ├── GameScene.js
│   │   ├── MapScene.js
│   │   └── PlayerSetupScene.js
│   └── utils/
│       └── uiUtils.js
├── assets/
│   ├── images/
│   └── sounds/
│
├── index.html
├── style.css
└── README.md
Key Classes and Files
Monster.js: Handles all the monster's properties, methods for actions, and needs decay.
GameScene.js: The main game loop, handles player interactions, and monster movements.
dropDownMenu.js: Manages the UI for actions using a dropdown menu.
PlayerSetupScene.js: Handles initial player setup, including monster selection and ranch customization.
Contributing
Contributions are welcome! Please follow these steps:

Fork the Repository: Click on the 'Fork' button at the top right corner of the repository page.
Clone the Forked Repository:
bash
Copy code
git clone https://github.com/yourusername/pocket-rancher.git
Create a New Branch:
bash
Copy code
git checkout -b feature/your-feature-name
Make Your Changes: Implement your feature or bug fix.
Commit and Push Your Changes:
bash
Copy code
git commit -m "Add your message here"
git push origin feature/your-feature-name
Create a Pull Request: Go to the repository on GitHub and click on 'Compare & pull request.'
