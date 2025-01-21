export const AssetConfig = {
    backgrounds: {
        bazaar: '/assets/images/backGrounds/bazaar.webp',
        freezer: '/assets/images/backGrounds/freezer.webp',
        portal: '/assets/images/backGrounds/portalBackground.webp',
        cemetery: '/assets/images/backGrounds/cemetery.webp',
        map: '/assets/images/backGrounds/map.webp',
        grassLandRanch: '/assets/images/backGrounds/grassLandRanch.webp',
        desertRanch: '/assets/images/backGrounds/desertRanch.webp',
        mountainRanch: '/assets/images/backGrounds/mountainRanch.webp'
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
        magicBerries: '/assets/images/Offerings/magicBerries.png'
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