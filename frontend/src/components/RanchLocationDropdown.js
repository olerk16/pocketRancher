export default class RanchLocationDropdown {
    constructor(scene, player) {
      this.scene = scene;
      this.player = player;
      this.createDropdown();
    }
  
    createDropdown() {
      // Create a dropdown (select element) for ranch location selection
      this.locationDropdown = document.createElement('select');
      this.locationDropdown.style.position = 'absolute';
      this.locationDropdown.style.top = '250px';
      this.locationDropdown.style.left = '400px';
      this.locationDropdown.style.transform = 'translate(-50%, -50%)';
      this.locationDropdown.style.fontSize = '16px';
  
      // Define ranch location options
      const locations = [
        { value: "grassLand", text: "Grassland" },
        { value: "desert", text: "Desert" },
        { value: "mountain", text: "Mountain" },
      ];
  
      // Populate the dropdown with options
      locations.forEach((location) => {
        const option = document.createElement('option');
        option.value = location.value;
        option.text = location.text;
        this.locationDropdown.appendChild(option);
      });
  
      // Handle selection change
      this.locationDropdown.addEventListener('change', (event) => {
        this.player.updateRanchLocation(event.target.value); // Update ranch location in the Player class
        console.log(`Selected Ranch Location: ${this.player.ranchLocation}`);
      });
  
      // Append the dropdown to the body
      document.body.appendChild(this.locationDropdown);
  
      // Remove dropdown when the scene shuts down
      this.scene.events.on('shutdown', () => {
        this.locationDropdown.remove();
      });
    }
  }
  