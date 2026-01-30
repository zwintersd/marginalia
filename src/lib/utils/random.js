/**
 * Seeded random number generator for deterministic events.
 * Uses a simple mulberry32 algorithm.
 */

/**
 * Create a seeded random number generator.
 * @param {number} seed
 * @returns {() => number} function returning 0-1 range
 */
export function seededRandom(seed) {
	let state = seed | 0;
	return function () {
		state = (state + 0x6d2b79f5) | 0;
		let t = Math.imul(state ^ (state >>> 15), 1 | state);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/**
 * Pick a random item from an array using a RNG function.
 * @template T
 * @param {T[]} array
 * @param {() => number} rng
 * @returns {T}
 */
export function pickRandom(array, rng = Math.random) {
	return array[Math.floor(rng() * array.length)];
}

/**
 * Weighted random selection.
 * @param {{ weight: number }[]} items
 * @param {() => number} rng
 * @returns {number} index of selected item
 */
export function weightedRandom(items, rng = Math.random) {
	const total = items.reduce((sum, item) => sum + item.weight, 0);
	let roll = rng() * total;

	for (let i = 0; i < items.length; i++) {
		roll -= items[i].weight;
		if (roll <= 0) return i;
	}
	return items.length - 1;
}

/**
 * Generate a simple unique ID.
 * @returns {string}
 */
export function generateId() {
	return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}
