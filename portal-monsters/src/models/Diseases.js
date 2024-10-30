const Diseases = {
    "Shadow Plague": {
      name: "Shadow Plague",
      effects: { happiness: -10, energy: -15 },
      duration: 10000, // 10 seconds
      description: "A dark, creeping illness that saps the energy of the monster, causing extreme fatigue and weakness."
    },
    "Frostbane Fever": {
      name: "Frostbane Fever",
      effects: { hunger: -20, energy: -10, hygiene: -15 },
      duration: 15000, // 15 seconds
      description: "A chilling ailment that lowers the body temperature of the monster to dangerous levels. It begins with a mild shiver but progresses to severe frostbite on extremities, hallucinations of cold landscapes, and eventual paralysis if left untreated."
    },
    "Crimson Blight": {
      name: "Crimson Blight",
      effects: { energy: -30, happiness: -5 },
      duration: 20000, // 20 seconds
      description: "This disease causes the monster's skin to develop painful red sores that ooze a glowing crimson fluid. The blight spreads rapidly and causes intense burning sensations, eventually leading to a loss of vitality and strength."
    },
    "Ashen Sickness": {
      name: "Ashen Sickness",
      effects: { hygiene: -20, happiness: -10 },
      duration: 12000, // 12 seconds
      description: "A respiratory disease caused by inhaling the remains of a cursed volcano or magic fire. The affected monster coughs up ash and embers, their lungs burn like a furnace, and their skin starts to crack and peel like burnt wood, making breathing difficult and painful."
    },
  };
  
  export default Diseases;
  