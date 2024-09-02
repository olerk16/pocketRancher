// src/components/MonsterStatsComponent.js
class DisplayStatsComponent {
  constructor(scene, monster, playerCoins, x, y) {
    this.scene = scene;
    this.monster = monster;
    this.playerCoins = playerCoins; // Store player coins

    // Create text objects for each stat
    this.hungerText = scene.add.text(x, y, `Hunger: ${monster.hunger}`, { fontSize: '16px', fill: '#FFF' });
    this.happinessText = scene.add.text(x, y + 20, `Happiness: ${monster.happiness}`, { fontSize: '16px', fill: '#FFF' });
    this.energyText = scene.add.text(x, y + 40, `Energy: ${monster.energy}`, { fontSize: '16px', fill: '#FFF' });
    this.hygieneText = scene.add.text(x, y + 60, `Hygiene: ${monster.hygiene}`, { fontSize: '16px', fill: '#FFF' });
    this.lifeSpanText = scene.add.text(x, y + 80, `Life Span: ${monster.lifeSpan}`, { fontSize: '16px', fill: '#FFF' });
    this.diseaseText = scene.add.text(x, y + 100, `Diseases: None`, { fontSize: '16px', fill: '#FFF' });

    // Add player coins text
    this.coinsText = scene.add.text(x, y + 120, `Coins: ${this.playerCoins}`, { fontSize: '16px', fill: '#FFF' });

    // Initial update of the disease display
    this.updateDisplay();
  }

  updateDisplay() {
    // Ensure all text objects are valid before updating them
    if (this.hungerText) this.hungerText.setText(`Hunger: ${this.monster.hunger}`);
    if (this.happinessText) this.happinessText.setText(`Happiness: ${this.monster.happiness}`);
    if (this.energyText) this.energyText.setText(`Energy: ${this.monster.energy}`);
    if (this.hygieneText) this.hygieneText.setText(`Hygiene: ${this.monster.hygiene}`);
    if (this.lifeSpanText) this.lifeSpanText.setText(`Life Span: ${this.monster.lifeSpan}`);
    if (this.diseaseText) {
      const diseasesList = this.monster.diseases.length > 0 ? this.monster.diseases.map(d => d.name).join(', ') : 'None';
      this.diseaseText.setText(`Diseases: ${diseasesList}`);
    }
    if (this.coinsText) this.coinsText.setText(`Coins: ${this.playerCoins}`); // Update coins text
  }

  setCoins(coins) {
    this.playerCoins = coins; // Update player coins value
    this.updateDisplay(); // Update the display to reflect the new coin value
  }

  destroy() {
    // Destroy all text objects when the component is no longer needed
    if (this.hungerText) this.hungerText.destroy();
    if (this.happinessText) this.happinessText.destroy();
    if (this.energyText) this.energyText.destroy();
    if (this.hygieneText) this.hygieneText.destroy();
    if (this.lifeSpanText) this.lifeSpanText.destroy();
    if (this.diseaseText) this.diseaseText.destroy();
    if (this.coinsText) this.coinsText.destroy();
  }
}

export default DisplayStatsComponent;
