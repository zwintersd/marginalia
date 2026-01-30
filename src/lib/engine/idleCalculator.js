import { gameState } from '../stores/gameState.js';
import { BUILDINGS } from '../data/buildings.js';

/**
 * Offline progress calculator.
 * When the game loads, calculates what happened while the player was away.
 */

/** Maximum offline time to calculate (8 hours in seconds) */
const MAX_OFFLINE_SECONDS = 8 * 60 * 60;

/** Offline efficiency multiplier (resources generate slightly slower offline) */
const OFFLINE_EFFICIENCY = 0.5;

/**
 * Calculate resource production rate per second for a given state.
 * @param {object} state - The game state snapshot
 * @returns {{ ink: number, imagination: number, words: number }}
 */
export function calculateProductionRates(state) {
	const rates = { ink: 0, imagination: 0, words: 0 };

	for (const zone of state.zones) {
		if (!zone.unlocked) continue;

		for (const building of zone.buildings) {
			const def = BUILDINGS[building.type];
			if (!def || !def.production) continue;

			const stageMultiplier = 1 + (building.stage - 1) * 0.25;

			for (const [resource, baseRate] of Object.entries(def.production)) {
				if (resource in rates) {
					rates[resource] += baseRate * stageMultiplier;
				}
			}
		}
	}

	return rates;
}

/**
 * Apply offline progress to the game state.
 * @param {object} savedState - The loaded save data
 * @param {number} secondsAway - How many seconds the player was away
 * @returns {{ secondsCalculated: number, resourcesGained: { ink: number, imagination: number, words: number } }}
 */
export function applyOfflineProgress(savedState, secondsAway) {
	const cappedSeconds = Math.min(secondsAway, MAX_OFFLINE_SECONDS);

	if (cappedSeconds < 10) {
		return { secondsCalculated: 0, resourcesGained: { ink: 0, imagination: 0, words: 0 } };
	}

	const rates = calculateProductionRates(savedState);

	const gained = {
		ink: Math.floor(rates.ink * cappedSeconds * OFFLINE_EFFICIENCY),
		imagination: Math.floor(rates.imagination * cappedSeconds * OFFLINE_EFFICIENCY),
		words: Math.floor(rates.words * cappedSeconds * OFFLINE_EFFICIENCY)
	};

	// Apply to game state
	if (gained.ink > 0) gameState.addResource('ink', gained.ink);
	if (gained.imagination > 0) gameState.addResource('imagination', gained.imagination);
	if (gained.words > 0) gameState.addResource('words', gained.words);

	return {
		secondsCalculated: cappedSeconds,
		resourcesGained: gained
	};
}
