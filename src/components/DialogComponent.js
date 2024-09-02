class DialogComponent {
  constructor(scene, x, y, width, height, message, imageKey) {
    this.scene = scene; // Reference to the scene
    this.x = x; // X position of the dialog box
    this.y = y; // Y position of the dialog box
    this.width = width; // Width of the dialog box
    this.height = height; // Height of the dialog box
    this.message = message; // The message to display
    this.imageKey = imageKey; // Key for the character image

    // Initialize properties as null
    this.graphics = null;
    this.text = null;
    this.closeButton = null;
    this.characterImage = null;

    // Create dialog elements
    this.createDialog();
  }

  createDialog() {
    // Create a graphics object for the dialog background
    this.graphics = this.scene.add.graphics();

    // Draw a rounded rectangle for the dialog background
    this.graphics.fillStyle(0x000000, 0.8); // Semi-transparent black
    this.graphics.fillRoundedRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height,
      20
    );
    this.graphics.lineStyle(2, 0xffffff, 1); // White border
    this.graphics.strokeRoundedRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height,
      20
    );

    // Create the text object for the message
    this.text = this.scene.add
      .text(this.x, this.y, this.message, {
        fontSize: "18px",
        fill: "#ffffff",
        wordWrap: { width: this.width - 20 },
      })
      .setOrigin(0.5)
      .setDepth(1); // Ensure the text is above the background

    // Add a close button to hide the dialog
    this.closeButton = this.scene.add
      .text(
        this.x + this.width / 2 - 20,
        this.y - this.height / 2 + 20,
        "X",
        {
          fontSize: "20px",
          fill: "#ffffff",
        }
      )
      .setInteractive()
      .on("pointerdown", () => this.hideDialog())
      .setDepth(1)
      .setOrigin(0.5)
      .setVisible(false); // Hide initially

    // Add the character image to the left of the dialog box, outside of it
    this.characterImage = this.scene.add
      .image(this.x - this.width / 2 - 80, this.y, this.imageKey) // Position outside to the left
      .setDisplaySize(200, 200) // Increase size for a bigger image
      .setOrigin(0.5)
      .setDepth(1); // Ensure the image is above the background

    // Initially hide the dialog and image
    this.hideDialog();
  }

  showDialog(message) {
    if (message) {
      this.message = message; // Update the message if provided
      this.text.setText(this.message);
    }
    this.graphics.setVisible(true);
    this.text.setVisible(true);
    this.closeButton.setVisible(true);
    this.characterImage.setVisible(true); // Show the image as well
  }

  hideDialog() {
    if (this.graphics && this.text && this.closeButton && this.characterImage) {
      this.graphics.setVisible(false);
      this.text.setVisible(false);
      this.closeButton.setVisible(false);
      this.characterImage.setVisible(false); // Hide the image as well
    } else {
      console.error("DialogComponent elements are not initialized correctly.");
    }
  }

  destroy() {
    if (this.graphics) this.graphics.destroy();
    if (this.text) this.text.destroy();
    if (this.closeButton) this.closeButton.destroy();
    if (this.characterImage) this.characterImage.destroy();
  }
}

export default DialogComponent;
