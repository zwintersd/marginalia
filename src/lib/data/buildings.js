/**
 * Building definitions.
 * Each building has 12 upgrade stages, production rates, and costs.
 */

/** @typedef {{ name: string, description: string, production: Record<string, number>, baseCost: Record<string, number>, costMultiplier: number, maxStage: number, spritePrefix: string }} BuildingDef */

/** @type {Record<string, BuildingDef>} */
export const BUILDINGS = {
	cottage: {
		name: 'Ink Cottage',
		description: 'A small dwelling where ink gathers in quiet pools beneath the floorboards.',
		production: { ink: 0.1 },
		baseCost: { imagination: 10 },
		costMultiplier: 1.5,
		maxStage: 12,
		spritePrefix: 'building_cottage'
	},
	garden: {
		name: 'Thought Garden',
		description: 'A garden where ideas take root and bloom into imagination.',
		production: { imagination: 0.15 },
		baseCost: { ink: 8 },
		costMultiplier: 1.5,
		maxStage: 12,
		spritePrefix: 'building_garden'
	},
	library: {
		name: 'Whispering Library',
		description: 'Shelves of unwritten books that hum with potential words.',
		production: { words: 0.08, ink: 0.05 },
		baseCost: { ink: 15, imagination: 15 },
		costMultiplier: 1.6,
		maxStage: 12,
		spritePrefix: 'building_library'
	},
	well: {
		name: 'Deep Ink Well',
		description: 'A well that reaches down into the darkest, richest ink.',
		production: { ink: 0.25 },
		baseCost: { imagination: 20, words: 5 },
		costMultiplier: 1.7,
		maxStage: 12,
		spritePrefix: 'building_well'
	},
	observatory: {
		name: 'Star Observatory',
		description: 'From here, Brianna watches the constellations she has written into being.',
		production: { imagination: 0.3, words: 0.05 },
		baseCost: { ink: 30, imagination: 25, words: 10 },
		costMultiplier: 1.8,
		maxStage: 12,
		spritePrefix: 'building_observatory'
	},
	shrine: {
		name: 'Margin Shrine',
		description: 'A sacred place in the margins where all three essences converge.',
		production: { ink: 0.1, imagination: 0.1, words: 0.15 },
		baseCost: { ink: 40, imagination: 40, words: 20 },
		costMultiplier: 2.0,
		maxStage: 12,
		spritePrefix: 'building_shrine'
	}
};

/**
 * Calculate the cost to upgrade a building to the next stage.
 * @param {string} buildingType
 * @param {number} currentStage
 * @returns {Record<string, number>}
 */
export function getUpgradeCost(buildingType, currentStage) {
	const def = BUILDINGS[buildingType];
	if (!def) return {};

	const cost = {};
	for (const [resource, base] of Object.entries(def.baseCost)) {
		cost[resource] = Math.floor(base * Math.pow(def.costMultiplier, currentStage));
	}
	return cost;
}

/**
 * Calculate the placement cost (stage 1 cost).
 * @param {string} buildingType
 * @returns {Record<string, number>}
 */
export function getPlacementCost(buildingType) {
	const def = BUILDINGS[buildingType];
	if (!def) return {};
	return { ...def.baseCost };
}
