import { createButton } from '../utils/uiUtils.js';

export class OfferingSelection {
    constructor(scene, offerings, onOfferingSelected) {
        this.scene = scene;
        this.offerings = offerings;
        this.onOfferingSelected = onOfferingSelected;
        this.container = null;
        
        this.createOfferingWindow();
    }

    createOfferingWindow() {
        this.container = this.scene.add.container(400, 200);
        
        // Create background
        const bg = this.scene.add.rectangle(0, 0, 300, 150, 0x000000, 0.7)
            .setOrigin(0.5);
        this.container.add(bg);

        // Add title
        const title = this.scene.add.text(0, -60, 'Use Special Offering?', { 
            fontSize: '20px', 
            fill: '#FFF',
            align: 'center'
        }).setOrigin(0.5);
        this.container.add(title);

        // Add offering buttons
        this.offerings.forEach((offering, index) => {
            this.createOfferingButton(offering, index);
        });
    }

    createOfferingButton(offering, index) {
        const button = createButton(
            this.scene,
            0,
            -20 + (index * 40),
            offering.name,
            () => {
                this.handleOfferingSelected(offering);
                this.container.destroy();
            }
        );
        this.container.add(button);

        // Add tooltip with offering description
        const tooltip = this.scene.add.text(
            button.x + 100,
            button.y,
            offering.description || `A ${offering.name} offering`,
            {
                fontSize: '14px',
                fill: '#FFF',
                wordWrap: { width: 150 }
            }
        ).setOrigin(0, 0.5);
        this.container.add(tooltip);
        tooltip.setVisible(false);

        // Add hover effects
        button.on('pointerover', () => tooltip.setVisible(true));
        button.on('pointerout', () => tooltip.setVisible(false));
    }

    handleOfferingSelected(offering) {
        // Make sure we're passing the full offering object
        const selectedOffering = this.offerings.find(o => o.name === offering.name);
        if (selectedOffering) {
            this.onOfferingSelected(selectedOffering);
        }
    }

    destroy() {
        if (this.container) {
            this.container.destroy();
            this.container = null;
        }
    }
} 