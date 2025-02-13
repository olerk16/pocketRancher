import Diseases from '../models/Diseases.js';
import DialogComponent from '../components/DialogComponent.js';

class DiseaseManager {
    static getRandomDisease(monster, scene) {
        const roll = Math.random() * 100;
        
        // 25% chance of getting sick from journey
        if (roll > 25) return null;

        // Get all available diseases
        const diseaseList = Object.values(Diseases);
        
        // Different probabilities for different diseases based on monster's current state
        const weightedDiseases = diseaseList.map(disease => {
            let weight = 1;

            // Increase chance of diseases based on monster's current stats
            if (monster.hygiene < 50) weight *= 1.5;  // More likely when dirty
            if (monster.energy < 30) weight *= 1.3;   // More likely when tired
            if (monster.happiness < 40) weight *= 1.2; // More likely when unhappy

            return { disease, weight };
        });

        // Calculate total weight
        const totalWeight = weightedDiseases.reduce((sum, { weight }) => sum + weight, 0);
        
        let random = Math.random() * totalWeight;
        
        // Select disease based on weights
        for (const { disease, weight } of weightedDiseases) {
            random -= weight;
            if (random <= 0) {
                return {
                    ...disease,
                    apply: () => {
                        // Apply disease effects
                        Object.entries(disease.effects).forEach(([stat, value]) => {
                            monster.updateStat(stat, value);
                        });
                        
                        // Set active disease on monster
                        monster.setActiveDisease(disease);

                        // Create and show dialog
                        const message = `Oh no! ${monster.name} contracted ${disease.name}!\n\n${disease.description}`;
                        const dialog = new DialogComponent(
                            scene,
                            400,
                            300,
                            400,
                            200,
                            message,
                            'trainerDave'
                        );
                        
                        dialog.showDialog();

                        // Auto-hide dialog after 5 seconds
                        scene.time.delayedCall(5000, () => {
                            dialog.hideDialog();
                            dialog.destroy();
                        });

                        // Set timer to clear disease
                        scene.time.delayedCall(disease.duration, () => {
                            monster.clearDisease();
                        });

                        return message;
                    }
                };
            }
        }

        return null;
    }
}

export default DiseaseManager; 