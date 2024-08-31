const Monsters = {
    "cactopus": {
      name: "Cactopus",
      favoriteFood: "spicy pepper",
      initialStats: { 
        hunger: 60, 
        happiness: 70, 
        energy: 80, 
        hygiene: 50, 
        lifeSpan: 90 
      },
      spriteKey: "cactopusSprite", // This is the key to load the sprite image in Phaser
    },
    "desertCrawler": {
      name: "Desert Crawler",
      favoriteFood: "watermelon",
      initialStats: { 
        hunger: 50, 
        happiness: 60, 
        energy: 90, 
        hygiene: 80, 
        lifeSpan: 120 
      },
      spriteKey: "desertCrawlerSprite", // This is the key to load the sprite image in Phaser
    },
    "crystaloctopus": {
      name: "Crystaloctopus",
      favoriteFood: "rock candy",
      initialStats: { 
        hunger: 70, 
        happiness: 50, 
        energy: 60, 
        hygiene: 40, 
        lifeSpan: 150 
      },
      spriteKey: "crystaloctopusSprite", // This is the key to load the sprite image in Phaser
    }
  };
  
  export default Monsters;
  