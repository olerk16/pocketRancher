const Monsters = [
  {
    name: "bobby",
    type: "fungiGolem",
    imageURL: "backend/data/Assets/monsterImages/fungiGolem.png", // Lowercase `u`
    favoriteFood: "spicy pepper",
    initialStats: {
      hunger: 60,
      happiness: 70,
      energy: 80,
      hygiene: 50,
      lifeSpan: 90
    }
  },
  {
    name: "tom",
    type: "runeScarub",
    imageURL: "backend/data/Assets/monsterImages/runeScarub.png",
    favoriteFood: "watermelon",
    initialStats: {
      hunger: 50,
      happiness: 60,
      energy: 90,
      hygiene: 80,
      lifeSpan: 120
    }
  },
  {
    name: "fred",
    type: "coreGolem",
    imageURL: "https://portal-monsters.s3.us-east-2.amazonaws.com/monsters/coreGolem.png",
    favoriteFood: "rock candy",
    initialStats: {
      hunger: 50,
      happiness: 60,
      energy: 90,
      hygiene: 80,
      lifeSpan: 120
    }
  },
  {
    name: "rose",
    type: "shadowHound",
    imageURL: "backend/data/Assets/monsterImages/shadowHound.png",
    favoriteFood: "rock candy",
    initialStats: {
      hunger: 70,
      happiness: 50,
      energy: 60,
      hygiene: 40,
      lifeSpan: 150
    }
  },
  {
    name: "greg",
    type: "shepardKing",
    imageURL: "backend/data/Assets/monsterImages/shepardKing.png",
    favoriteFood: "rock candy",
    initialStats: {
      hunger: 70,
      happiness: 50,
      energy: 60,
      hygiene: 40,
      lifeSpan: 150
    }
  }
];

module.exports = Monsters;
