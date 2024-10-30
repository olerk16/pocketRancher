class InputComponent {
    constructor(scene, options) {
      this.scene = scene; // Reference to the Phaser scene
      this.inputs = []; // Array to hold all input elements
  
      // Create input fields based on provided options
      options.forEach((opt) => {
        const input = this.createInputField(opt);
        this.inputs.push(input);
      });
  
      // Remove input fields when the scene shuts down
      this.scene.events.on("shutdown", () => {
        this.removeAllInputs();
      });
    }
  
    createInputField({ placeholder, top, left, onChange, fontSize = "16px" }) {
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = placeholder;
      input.style.position = "absolute";
      input.style.top = top;
      input.style.left = left;
      input.style.transform = "translate(-50%, -50%)";
      input.style.fontSize = fontSize;
      document.body.appendChild(input);
  
      // Add event listener for input changes
      input.addEventListener("input", (event) => {
        onChange(event.target.value);
      });
  
      return input;
    }
  
    removeAllInputs() {
      this.inputs.forEach((input) => input.remove());
      this.inputs = [];
    }
  }
  
  export default InputComponent;
  