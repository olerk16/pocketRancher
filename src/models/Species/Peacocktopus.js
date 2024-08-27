// src/models/Peacocktopus.js

import Monster from '../Monster.js'; // Import the base Monster class

class Peacocktopus extends Monster {
    constructor(scene, x, y) {
        super(scene, x, y); // Call the constructor of the parent class (Monster)

        // Set unique properties for Peacocktopus
        this.species = 'Peacocktopus'; // Unique species name
    }

    // Optional: Override the update method if Peacocktopus has unique behaviors
    update() {
        super.update(); // Call the parent class's update method
        // Add any additional behavior specific to Peacocktopus here
    }
}

export default Peacocktopus;
