export default class PlayerInfoComponent {
    constructor(scene, player, x = 16, y = 16) {
        this.scene = scene;
        this.player = player;
        this.x = x;
        this.y = y;

        // Create container
        this.container = this.scene.add.container(this.x, this.y);
        
        // Create background
        const bg = this.scene.add.graphics();
        bg.fillStyle(0x1a1a1a, 0.8);
        bg.lineStyle(2, 0x3498db, 1);
        bg.fillRoundedRect(0, 0, 150, 90, 10);
        bg.strokeRoundedRect(0, 0, 150, 90, 10);
        this.container.add(bg);

        // Add player info texts
        this.playerText = this.scene.add.text(10, 10, '', {
            fontSize: '14px',
            fontFamily: 'monospace',
            fill: '#ECF0F1'
        });
        
        this.ranchText = this.scene.add.text(10, 35, '', {
            fontSize: '14px',
            fontFamily: 'monospace',
            fill: '#ECF0F1'
        });
        
        this.coinsText = this.scene.add.text(10, 60, '', {
            fontSize: '14px',
            fontFamily: 'monospace',
            fill: '#FFD700'  // Gold color for coins
        });

        this.container.add(this.playerText);
        this.container.add(this.ranchText);
        this.container.add(this.coinsText);

        this.updateInfo();
    }

    updateInfo() {
        this.playerText.setText(`Player: ${this.player.name}`);
        this.ranchText.setText(`Ranch: ${this.player.ranchName}`);
        this.coinsText.setText(`Coins: ${this.player.coins} 🪙`);
    }

    destroy() {
        if (this.container) {
            this.container.destroy();
        }
    }
} 