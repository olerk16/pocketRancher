const Moves = {
    "Scratch": {
      name: "Scratch",
      effects: 'bleeding',
      effectsChance: 30,
      duration: 3,
      power: 3,
      manaCost: 0,
      accuracy: 100,
      critChance: 5,
      elementTypes: ['physical'], 

      description: "Scratch the target for small dmg and a chance to cause bleeding to the target for 3 turns."
    },
    "ThunderPunch": {
      name: "Thunder Punch",
      effects: 'paralyze',
      effectsChance: 10,
      duration: 3,
      power: 5,
      manaCost: 10,
      accuracy: 95,
      critChance: 5,
      elementTypes: ['physical', 'electric'], 

      description: "Punch the target for med dmg and a chance to cause the target to be paralyzed for 3 turns."
    },
    
  };
  
  export default Diseases;