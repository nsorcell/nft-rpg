export type StatsInput = {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wit: number;
  luck: number;
};

export type LocationInput = {
  x: number;
  y: number;
};

export enum PrimaryClass {
  Warrior,
  Mage,
  Rogue,
  Guardian,
  Enchanter,
  None,
}

export enum SecondaryClass {
  Reaper,
  Duelist,
  Harlequin,
  Arcanist,
  Battlemage,
  Dreamweaver,
  Stalker,
  Trickster,
  Explorer,
  Titan,
  Spellbreaker,
  Hexer,
  Voidwalker,
  Prophet,
  None,
}

export const classCombinations: [
  PrimaryClass,
  SecondaryClass,
  keyof StatsInput,
  keyof StatsInput
][] = [
  [PrimaryClass.Warrior, SecondaryClass.Reaper, "strength", "dexterity"],
  [PrimaryClass.Warrior, SecondaryClass.Duelist, "strength", "constitution"],
  [PrimaryClass.Warrior, SecondaryClass.Harlequin, "strength", "luck"],
  [PrimaryClass.Mage, SecondaryClass.Arcanist, "intelligence", "wit"],
  [PrimaryClass.Mage, SecondaryClass.Battlemage, "intelligence", "strength"],
  [PrimaryClass.Mage, SecondaryClass.Dreamweaver, "intelligence", "luck"],
  [PrimaryClass.Rogue, SecondaryClass.Stalker, "dexterity", "strength"],
  [PrimaryClass.Rogue, SecondaryClass.Trickster, "dexterity", "wit"],
  [PrimaryClass.Rogue, SecondaryClass.Explorer, "dexterity", "luck"],
  [PrimaryClass.Guardian, SecondaryClass.Titan, "constitution", "strength"],
  [
    PrimaryClass.Guardian,
    SecondaryClass.Spellbreaker,
    "constitution",
    "intelligence",
  ],
  [PrimaryClass.Enchanter, SecondaryClass.Hexer, "wit", "strength"],
  [PrimaryClass.Enchanter, SecondaryClass.Voidwalker, "wit", "intelligence"],
  [PrimaryClass.Enchanter, SecondaryClass.Prophet, "wit", "luck"],
];

export type AttributesInput = {
  level: number;
  experience: number;
  primaryClass: PrimaryClass;
  secondaryClass: SecondaryClass;
  location: LocationInput;
  speed: number;
};

export const createStatsArray = (from: StatsInput) => [
  from.strength,
  from.dexterity,
  from.constitution,
  from.intelligence,
  from.wit,
  from.luck,
];

export const createAttributesArray = (from: AttributesInput) => [
  from.level,
  from.experience,
  from.primaryClass,
  from.secondaryClass,
  from.location.x,
  from.location.y,
  from.speed,
];
