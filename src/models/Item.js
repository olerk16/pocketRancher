class Item {
  constructor(
    name,
    price,
    description,
    sprite,
    hungerAmount = 0,
    happinessAmount = 0,
    energyAmount = 0,
    lifeSpanAmount = 0
  ) {
    this.name = name;
    this.price = price;
    this.description = description;
    this.sprite = sprite;
    this.hungerAmount = hungerAmount;
    this.happinessAmount = happinessAmount;
    this.energyAmount = energyAmount;
    this.lifeSpanAmount = lifeSpanAmount;
  }
}
export default Item;