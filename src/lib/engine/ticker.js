import { writable } from 'svelte/store';
import { gameState } from '../stores/gameState.js';

/**
 * requestAnimationFrame game loop with pause/resume support.
 * Provides a steady tick for resource generation and game updates.
 */

/** Whether the ticker is currently running */
export const isRunning = writable(false);

/** Current ticks per second (for debug display) */
export const tickRate = writable(0);

let animFrameId = null;
let lastTimestamp = 0;
let accumulatedTime = 0;
let tickCount = 0;
let lastTickRateUpdate = 0;

/** Callbacks registered for each tick */
const tickCallbacks = [];

/** Target tick interval in ms (~4 ticks/second for an idle game) */
const TICK_INTERVAL = 250;

/**
 * Register a callback to be called each game tick.
 * @param {(deltaSeconds: number) => void} callback
 * @returns {() => void} unsubscribe function
 */
export function onTick(callback) {
	tickCallbacks.push(callback);
	return () => {
		const idx = tickCallbacks.indexOf(callback);
		if (idx !== -1) tickCallbacks.splice(idx, 1);
	};
}

/** Internal frame loop */
function frame(timestamp) {
	if (!lastTimestamp) {
		lastTimestamp = timestamp;
	}

	const deltaMs = timestamp - lastTimestamp;
	lastTimestamp = timestamp;

	// Clamp delta to avoid spiral of death after tab-away
	const clampedDelta = Math.min(deltaMs, 1000);
	accumulatedTime += clampedDelta;

	while (accumulatedTime >= TICK_INTERVAL) {
		accumulatedTime -= TICK_INTERVAL;
		const deltaSeconds = TICK_INTERVAL / 1000;

		// Run all registered tick callbacks
		for (const cb of tickCallbacks) {
			cb(deltaSeconds);
		}

		// Track play time
		gameState.addStat('timePlayedSeconds', deltaSeconds);

		tickCount++;
	}

	// Update tick rate display once per second
	if (timestamp - lastTickRateUpdate >= 1000) {
		tickRate.set(tickCount);
		tickCount = 0;
		lastTickRateUpdate = timestamp;
	}

	animFrameId = requestAnimationFrame(frame);
}

/** Start the game ticker */
export function startTicker() {
	if (animFrameId != null) return;

	lastTimestamp = 0;
	accumulatedTime = 0;
	animFrameId = requestAnimationFrame(frame);
	isRunning.set(true);
}

/** Pause the game ticker */
export function pauseTicker() {
	if (animFrameId != null) {
		cancelAnimationFrame(animFrameId);
		animFrameId = null;
	}
	isRunning.set(false);
}

/** Resume after pause */
export function resumeTicker() {
	if (animFrameId != null) return;
	lastTimestamp = 0;
	accumulatedTime = 0;
	animFrameId = requestAnimationFrame(frame);
	isRunning.set(true);
}

/** Stop and clean up */
export function stopTicker() {
	pauseTicker();
	tickCallbacks.length = 0;
}
