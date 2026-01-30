import { seededRandom } from '../utils/random.js';
import { brianna } from '../stores/brianna.js';
import { gameState } from '../stores/gameState.js';

/**
 * Random event system.
 * Periodically triggers small flavor events to add variety.
 */

/** @typedef {{ id: string, name: string, description: string, weight: number, condition?: (state: object) => boolean, effect: (state: object) => void }} GameEvent */

/** @type {GameEvent[]} */
const EVENTS = [
	{
		id: 'ink_well_overflow',
		name: 'Ink Well Overflow',
		description: 'The ink well bubbles over with fresh ink!',
		weight: 10,
		effect: () => {
			gameState.addResource('ink', 5);
			brianna.speak('Oh! The ink well is overflowing... how delightful.');
			brianna.setMood('surprised');
		}
	},
	{
		id: 'wandering_thought',
		name: 'A Wandering Thought',
		description: 'A stray thought drifts in from beyond the margins...',
		weight: 10,
		effect: () => {
			gameState.addResource('imagination', 3);
			brianna.speak('A thought wandered in... I wonder where it came from.');
			brianna.setMood('thinking');
		}
	},
	{
		id: 'quiet_moment',
		name: 'A Quiet Moment',
		description: 'The world settles into a comfortable silence.',
		weight: 15,
		effect: () => {
			brianna.speak('It\'s nice here, isn\'t it? Just... being.');
			brianna.setMood('idle');
		}
	},
	{
		id: 'word_bloom',
		name: 'Word Bloom',
		description: 'Words sprout like flowers from the margins!',
		weight: 8,
		condition: (state) => state.stats.totalWordsWritten >= 10,
		effect: () => {
			gameState.addResource('words', 4);
			brianna.speak('Words are blooming! The world is finding its voice.');
			brianna.setMood('happy');
		}
	},
	{
		id: 'melancholy_rain',
		name: 'Melancholy Rain',
		description: 'A soft rain falls across the written world.',
		weight: 6,
		effect: () => {
			gameState.addResource('ink', 2);
			gameState.addResource('imagination', 2);
			brianna.speak('Rain... even sad things can nourish a world.');
			brianna.setMood('sad');
		}
	}
];

let eventRng = seededRandom(Date.now());
let lastEventTime = 0;

/** Minimum seconds between random events */
const MIN_EVENT_INTERVAL = 60;
/** Maximum seconds between random events */
const MAX_EVENT_INTERVAL = 180;

let nextEventIn = MIN_EVENT_INTERVAL;

/**
 * Check if a random event should fire this tick.
 * @param {number} deltaSeconds
 * @param {object} state - current game state
 */
export function tickEvents(deltaSeconds, state) {
	lastEventTime += deltaSeconds;

	if (lastEventTime < nextEventIn) return;

	// Time for an event
	lastEventTime = 0;
	nextEventIn = MIN_EVENT_INTERVAL + eventRng() * (MAX_EVENT_INTERVAL - MIN_EVENT_INTERVAL);

	// Filter eligible events
	const eligible = EVENTS.filter(e => !e.condition || e.condition(state));
	if (eligible.length === 0) return;

	// Weighted random selection
	const totalWeight = eligible.reduce((sum, e) => sum + e.weight, 0);
	let roll = eventRng() * totalWeight;

	for (const event of eligible) {
		roll -= event.weight;
		if (roll <= 0) {
			event.effect(state);
			return;
		}
	}
}

/** Reset event timer (e.g., on game load) */
export function resetEventTimer() {
	lastEventTime = 0;
	nextEventIn = MIN_EVENT_INTERVAL;
	eventRng = seededRandom(Date.now());
}
