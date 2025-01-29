class AutoSave {
    constructor(scene, player, interval = 60000) {
      this.scene = scene; // The Phaser scene
      this.player = player; // The player object
      this.autosaveInterval = interval; // Autosave interval in milliseconds
      this.autosaveTimer = null; // Reference to the Phaser timer event
    }
  
    // Method to start autosaving at regular intervals
    startAutosave() {
      if (this.autosaveTimer) {
        // If autosave is already running, do nothing
        return;
      }
  
      // Automatically save the player data at the specified interval
      this.autosaveTimer = this.scene.time.addEvent({
        delay: this.autosaveInterval,
        callback: this.autosavePlayerData,
        callbackScope: this,
        loop: true
      });
  
      console.log('Autosave started.');
    }
  
    // Method to stop the autosaving process
    stopAutosave() {
      if (this.autosaveTimer) {
        this.scene.time.removeEvent(this.autosaveTimer);
        this.autosaveTimer = null;
        console.log('Autosave stopped.');
      }
    }
  
    // Method to manually trigger an autosave
    async autosavePlayerData() {
      const playerData = this.getPlayerData(); // Get the player's current data
    
      try {
        const response = await fetch('http://localhost:5000/api/players/autosave', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            playerId: playerData.id, // Use playerData.id which is this.player._id
            playerData: playerData,  // Send the player's data to be saved
          }),
        });
    
        if (!response.ok) {
          throw new Error('Failed to autosave player data');
        }
    
        console.log('Autosave successful');
      } catch (error) {
        console.error('Error during autosave:', error);
      }
    }
  
    // Helper method to get the player's data
    getPlayerData() {
      console.log('Preparing player data for autosave...');
      console.log('Current player.activeMonster:', this.player.activeMonster);

      return {
        id: this.player._id,
        name: this.player.name,
        ranchName: this.player.ranchName,
        coins: this.player.coins,
        inventory: this.player.inventory,
        monsters: this.player.monsters.map(monster => monster._id), // Just the IDs
        activeMonster: this.player.activeMonster ? this.player.activeMonster._id : null, // Just the ID
        ranchLocation: this.player.ranchLocation,
      };
    }
  }
  
  export default AutoSave;
  