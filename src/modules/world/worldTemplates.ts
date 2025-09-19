// src/modules/world/worldTemplates.ts

import { faker } from "@faker-js/faker";

export function generateCountry(seed: string) {
  faker.seed(hashSeed(seed));
  return {
    name: faker.location.country(),
    description: faker.lorem.sentence(),
    language: faker.helpers.arrayElement(["Auralian", "Thamari", "Durok", "Yggan", "Common"]),
  };
}

export function generateCity(seed: string, countryId: number) {
  faker.seed(hashSeed(seed + countryId));
  return {
    name: faker.location.city(),
    description: faker.lorem.sentences(2),
    population: faker.number.int({ min: 2000, max: 100000 }),
    countryId,
  };
}

export function generateWildArea(seed: string, countryId: number) {
  faker.seed(hashSeed(seed + "wild" + countryId));
  return {
    name: `Wilds of ${faker.word.noun()}`,
    type: faker.helpers.arrayElement(["forest", "desert", "mountain", "swamp"]),
    dangerLevel: faker.number.int({ min: 1, max: 10 }),
    countryId,
  };
}

export function generateDungeon(seed: string, countryId: number) {
  faker.seed(hashSeed(seed + "dungeon" + countryId));
  return {
    name: `Dungeon of ${faker.person.firstName()}`,
    levelRequirement: faker.number.int({ min: 5, max: 50 }),
    isRaid: faker.datatype.boolean(),
    countryId,
  };
}

function hashSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}
