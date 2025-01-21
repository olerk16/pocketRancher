import Offerings from './Offerings';

const Items = {
  POTATO: {
    name: "Potato",
    spriteKey: "potato",
    price: 5,
    description: "Potato: 5 gold 40 hunger -10 happiness",
    hungerAmount: 40,
    happinessAmount: -10,
    energyAmount: 0,
    lifeSpanAmount: 0,
  },

  STEAK: {
    name: "Steak",
    spriteKey: "steak",
    price: 100,
    description: "Steak: 100 gold 100 hunger 40 happiness",
    hungerAmount: 100,
    happinessAmount: 40,
    energyAmount: 0,
    lifeSpanAmount: 0,
  },
  TOY: {
    name: "Toy",
    spriteKey: "toy",
    price: 20,
    description: "Toy Shaker: 20 gold 40 happiness",
    hungerAmount: 0,
    happinessAmount: 40,
    energyAmount: 0,
    lifeSpanAmount: 0,
  },
  FLOWERS: {
    name: "Flowers",
    spriteKey: "flowers",
    price: 40,
    description: "Flowers: 40 gold 80 happiness",
    hungerAmount: 0,
    happinessAmount: 80,
    energyAmount: 0,
    lifeSpanAmount: 0,
  },
  HEALTH_POTION: {
    name: "Health Potion",
    spriteKey: "healthPotion",
    price: 100,
    description: "Medic Bag: 100 gold will cure disease",
    hungerAmount: 0,
    happinessAmount: 0,
    energyAmount: 0,
    lifeSpanAmount: 0,
  },
  MAGIC_BERRIES: {
    name: "Magic Berries",
    spriteKey: "magicBerries",
    price: 100,
    description: "Magic Berries: 100 gold 100 happiness",
    hungerAmount: 50,
    happinessAmount: 100,
    energyAmount: 0,
    lifeSpanAmount: 0,
  },
  
  // Add offerings to items
  ...Offerings
};

export default Items;