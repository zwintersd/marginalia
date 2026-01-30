/**
 * Creature definitions.
 * Creatures wander zones and provide passive bonuses or flavor.
 */

/** @typedef {{ name: string, description: string, rarity: 'common'|'uncommon'|'rare', zones: string[], bonus?: Record<string, number>, spritePrefix: string }} CreatureDef */

/** @type {Record<string, CreatureDef>} */
export const CREATURES = {
	inkMoth: {
		name: 'Ink Moth',
		description: 'A small moth whose wings leave trails of dark ink.',
		rarity: 'common',
		zones: ['meadow', 'forest', 'ruins'],
		bonus: { ink: 0.02 },
		spritePrefix: 'creature_inkmoth'
	},
	thoughtFox: {
		name: 'Thought Fox',
		description: 'A fox made of half-remembered ideas. It moves quietly.',
		rarity: 'uncommon',
		zones: ['forest', 'mountain'],
		bonus: { imagination: 0.03 },
		spritePrefix: 'creature_thoughtfox'
	},
	marginCat: {
		name: 'Margin Cat',
		description: 'A cat that lives in the spaces between words. It purrs in iambic pentameter.',
		rarity: 'common',
		zones: ['meadow', 'ruins', 'lake'],
		bonus: { words: 0.02 },
		spritePrefix: 'creature_margincat'
	},
	echoFish: {
		name: 'Echo Fish',
		description: 'A luminous fish that swims through still waters, repeating forgotten phrases.',
		rarity: 'uncommon',
		zones: ['lake'],
		bonus: { words: 0.04, imagination: 0.01 },
		spritePrefix: 'creature_echofish'
	},
	duskBird: {
		name: 'Dusk Bird',
		description: 'It only appears at twilight. Its song turns air into ink.',
		rarity: 'rare',
		zones: ['sky', 'mountain'],
		bonus: { ink: 0.05, imagination: 0.02 },
		spritePrefix: 'creature_duskbird'
	},
	pageWorm: {
		name: 'Page Worm',
		description: 'A tiny worm that burrows through pages, leaving tunnels of meaning.',
		rarity: 'common',
		zones: ['meadow', 'forest', 'ruins'],
		bonus: { words: 0.01 },
		spritePrefix: 'creature_pageworm'
	}
};

/** Spawn weights by rarity */
const RARITY_WEIGHTS = {
	common: 10,
	uncommon: 4,
	rare: 1
};

/**
 * Get eligible creatures for a zone, weighted by rarity.
 * @param {string} zoneId
 * @returns {{ type: string, weight: number }[]}
 */
export function getSpawnableCreatures(zoneId) {
	return Object.entries(CREATURES)
		.filter(([, def]) => def.zones.includes(zoneId))
		.map(([type, def]) => ({
			type,
			weight: RARITY_WEIGHTS[def.rarity] || 1
		}));
}
