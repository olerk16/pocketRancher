class Player {
  constructor(name, ranchName, coins, inventory, ranchLocation) {
    this.name = name;
    this.ranchName = ranchName;
    this.coins = coins;
    this.inventory = inventory || []; // Initialize with empty array if not provided
    this.ranchLocation = ranchLocation;
    this.monster = null; // Player starts with no monster
  }

  addCoins(amount) {
    this.coins += amount;
  }

  spendCoins(amount) {
    if (this.coins >= amount) {
      this.coins -= amount;
      return true;
    }
    return false;
  }

  addItem(item) {
    this.inventory.push(item);
  }

  removeItem(itemName) {
    const index = this.inventory.findIndex(item => item.name === itemName);
    if (index !== -1) {
      return this.inventory.splice(index, 1)[0]; // Remove and return the item
    }
    return null;
  }

  setRanchLocation(location) {
    this.ranchLocation = location;
  }

  setMonster(monster) {
    this.monster = monster;
  }

  getMonster() {
    return this.monster;
  }

  getInventory() {
    return this.inventory;
  }
}

export default Player;
