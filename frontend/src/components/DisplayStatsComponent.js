// src/components/MonsterStatsComponent.js
export default class DisplayStatsComponent {
  constructor(scene, monster, coins, x = 10, y = 10, alwaysShow = false) {
    this.scene = scene;
    this.monster = monster;
    this.x = x;
    this.y = y;
    this.alwaysShow = alwaysShow;
    this.barWidth = 160;  // Slightly smaller bars
    this.barHeight = 12;
    this.padding = 20;    // Reduced padding
    this.visible = false; // Start hidden by default, unless alwaysShow is true
    
    // Define theme colors
    this.colors = {
      background: 0x1a1a1a,
      border: 0x3498db,
      text: '#ECF0F1',
      bars: {
        hunger: 0xff4757,     // Red
        happiness: 0xffd32a,  // Yellow
        energy: 0x2ecc71,     // Green
        hygiene: 0x3498db,    // Blue
        life: 0xe056fd,       // Purple
      },
      status: {
        good: 0x2ecc71,
        warning: 0xf1c40f,
        danger: 0xe74c3c
      }
    };

    this.createDisplayBars();
    this.updateDisplay();
  }

  createDisplayBars() {
    // Main container with background
    this.container = this.scene.add.container(this.x, this.y);
    
    // Add panel background with rounded corners
    const bg = this.scene.add.graphics();
    bg.fillStyle(this.colors.background, 0.8);
    bg.lineStyle(2, this.colors.border, 1);
    bg.fillRoundedRect(0, 0, this.barWidth + 140, this.padding * 8, 10);  // Reduced height
    bg.strokeRoundedRect(0, 0, this.barWidth + 140, this.padding * 8, 10);
    this.container.add(bg);

    // Add title with smaller font
    const title = this.scene.add.text(10, 8, 'MONSTER STATUS', {
        fontSize: '14px',
        fontFamily: 'monospace',
        fill: this.colors.text,
        fontStyle: 'bold'
    });
    this.container.add(title);

    // Create stat bars with adjusted spacing
    const startY = 30;  // Reduced starting Y
    this.hungerBar = this.createStatBar(10, startY, 'HUNGER', this.colors.bars.hunger);
    this.happinessBar = this.createStatBar(10, startY + this.padding * 1.2, 'HAPPINESS', this.colors.bars.happiness);
    this.energyBar = this.createStatBar(10, startY + this.padding * 2.4, 'ENERGY', this.colors.bars.energy);
    this.hygieneBar = this.createStatBar(10, startY + this.padding * 3.6, 'HYGIENE', this.colors.bars.hygiene);
    this.lifeSpanBar = this.createStatBar(10, startY + this.padding * 4.8, 'LIFE', this.colors.bars.life);

    // Status effects panel
    this.statusEffects = this.scene.add.text(10, startY + this.padding * 6, '', {
      fontSize: '14px',
      fontFamily: 'monospace',
      fill: this.colors.text,
      backgroundColor: this.colors.background
    });
    this.container.add(this.statusEffects);

    // Set initial visibility based on alwaysShow or default hidden
    this.container.setVisible(this.alwaysShow ? true : this.visible);
  }

  createStatBar(x, y, label, color) {
    const container = this.scene.add.container(x, y);
    
    // Label with custom font
    const text = this.scene.add.text(0, 0, label, {
      fontSize: '12px',
      fontFamily: 'monospace',
      fill: this.colors.text
    });
    container.add(text);

    // Background bar with gradient and rounded corners
    const bgBar = this.scene.add.graphics();
    bgBar.fillStyle(0x2d3436, 0.8);
    bgBar.fillRoundedRect(70, 0, this.barWidth, this.barHeight, 6);
    container.add(bgBar);

    // Progress bar with gradient
    const bar = this.scene.add.graphics();
    container.add(bar);

    // Value text with shadow
    const valueText = this.scene.add.text(this.barWidth + 80, -2, '100%', {
      fontSize: '12px',
      fontFamily: 'monospace',
      fill: this.colors.text
    });
    valueText.setShadow(1, 1, 'rgba(0,0,0,0.5)', 2);
    container.add(valueText);

    this.container.add(container);
    return { bar, valueText, bgBar };
  }

  updateStatBar(statBar, value, max) {
    const percentage = (value / max) * 100;
    
    statBar.bar.clear();
    
    // Get color based on percentage
    let color;
    if (percentage > 66) color = this.colors.status.good;
    else if (percentage > 33) color = this.colors.status.warning;
    else color = this.colors.status.danger;

    // Draw bar with rounded corners and gradient
    statBar.bar.fillStyle(color, 1);
    statBar.bar.fillRoundedRect(70, 0, (this.barWidth * percentage) / 100, this.barHeight, 6);

    // Add shine effect
    if (percentage > 0) {
      statBar.bar.fillStyle(0xffffff, 0.1);
      statBar.bar.fillRoundedRect(70, 0, (this.barWidth * percentage) / 100, this.barHeight / 2, 6);
    }

    // Update text with animation if value changed significantly
    const newText = `${Math.round(percentage)}%`;
    if (statBar.valueText.text !== newText) {
      statBar.valueText.setText(newText);
      this.scene.tweens.add({
        targets: statBar.valueText,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 100,
        yoyo: true
      });
    }
  }

  updateDisplay() {
    if (!this.monster || !this.scene) return;

    try {
      this.updateStatBar(this.hungerBar, this.monster.hunger, 100);
      this.updateStatBar(this.happinessBar, this.monster.happiness, 100);
      this.updateStatBar(this.energyBar, this.monster.energy, 100);
      this.updateStatBar(this.hygieneBar, this.monster.hygiene, 100);
      this.updateStatBar(this.lifeSpanBar, this.monster.lifeSpan, 100);
    } catch (error) {
      console.warn('Error updating display stats:', error);
    }
  }

  destroy() {
    try {
      if (this.container) {
        this.container.destroy();
      }
    } catch (error) {
      console.warn('Error destroying display stats:', error);
    }
  }

  toggle() {
    this.visible = !this.visible;
    this.container.setVisible(this.visible);
  }

  setVisible(visible) {
    this.visible = visible;
    this.container.setVisible(visible);
  }
}
