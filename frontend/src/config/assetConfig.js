export const AssetConfig = {
    backgrounds: {
        bazaar: '/assets/images/Backgrounds/bazaar.webp',
        freezer: '/assets/images/Backgrounds/freezer.webp',
        portal: '/assets/images/Backgrounds/portalBackground.webp',
        cemetery: '/assets/images/Backgrounds/cemetery.webp',
        map: '/assets/images/Backgrounds/map.webp',
        grassLandRanch: '/assets/images/Backgrounds/grasslandRanch.webp',
        desertRanch: '/assets/images/Backgrounds/desertRanch.webp',
        mountainRanch: '/assets/images/Backgrounds/mountainRanch.webp', 
        shadowRanch: '/assets/images/Backgrounds/shadowRanch.webp'

    },
    items: {
        potato: 'assets/images/Items/potato.png',
        steak: 'assets/images/Items/steak.png',
        toy: 'assets/images/Items/toy.png',
        flowers: 'assets/images/Items/flowers.png',
        healthPotion: 'assets/images/Items/healthPotion.png',
        magicBerries: 'assets/images/Items/magicBerries.png'
    },
    offerings: {
        stormEgg: '/assets/images/Offerings/stormEgg.png',
        dragonScale: '/assets/images/Offerings/dragonScale.png',
        mysticGem: '/assets/images/Offerings/mysticGem.png',
        ancientRelic: '/assets/images/Offerings/ancientRelic.png',
        starterEgg: '/assets/images/Offerings/starterEgg.png'
    },
    icons: {
        battle: 'assets/images/icons/battleButton.png',
        exit: 'assets/images/icons/exitButton.webp'
    },
    characters: {
        trainerDave: 'assets/images/Characters/trainerDave.png'
    }
};

// Helper function to preload assets by category
export function loadAssetsByCategory(scene, category) {
    const assets = AssetConfig[category];
    Object.entries(assets).forEach(([key, path]) => {
        console.log(`🔄 Loading ${key} from ${path}`);
        scene.load.image(key, path);
    });
}

// Helper function to preload all assets
export function loadAllAssets(scene) {
    Object.entries(AssetConfig).forEach(([category, assets]) => {
        console.log(`📁 Loading ${category} assets...`);
        Object.entries(assets).forEach(([key, path]) => {
            console.log(`🔄 Loading ${key} from ${path}`);
            scene.load.image(key, path);
        });
    });
} 