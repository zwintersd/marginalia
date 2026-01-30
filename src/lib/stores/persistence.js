import { get } from 'svelte/store';
import { gameState } from './gameState.js';
import { brianna } from './brianna.js';

/**
 * IndexedDB persistence layer using idb-keyval.
 * Auto-saves every 30 seconds, with manual save/load support.
 */

const SAVE_KEY = 'marginalia-save';
const SAVE_VERSION = 1;
const AUTO_SAVE_INTERVAL = 30_000; // 30 seconds

let autoSaveTimer = null;
let idbKeyval = null;

/** Lazy-load idb-keyval (only available in browser) */
async function getIdb() {
	if (!idbKeyval) {
		idbKeyval = await import('idb-keyval');
	}
	return idbKeyval;
}

/** Build save data from current state */
function buildSaveData() {
	const state = get(gameState);
	const witch = get(brianna);

	return {
		version: SAVE_VERSION,
		timestamp: Date.now(),
		brianna: {
			mood: witch.mood,
			currentDialogue: witch.currentDialogue
		},
		resources: { ...state.resources },
		zones: structuredClone(state.zones),
		creatures: structuredClone(state.creatures),
		unlocks: [...state.unlocks],
		stats: { ...state.stats }
	};
}

/** Save game state to IndexedDB */
export async function saveGame() {
	try {
		const idb = await getIdb();
		const data = buildSaveData();
		await idb.set(SAVE_KEY, data);
		return true;
	} catch (err) {
		console.error('[Marginalia] Save failed:', err);
		return false;
	}
}

/** Load game state from IndexedDB */
export async function loadGame() {
	try {
		const idb = await getIdb();
		const data = await idb.get(SAVE_KEY);

		if (!data || data.version !== SAVE_VERSION) {
			return null;
		}

		// Restore stores
		gameState.load({
			resources: data.resources,
			zones: data.zones,
			creatures: data.creatures,
			unlocks: data.unlocks,
			stats: data.stats
		});

		brianna.load(data.brianna);

		return data;
	} catch (err) {
		console.error('[Marginalia] Load failed:', err);
		return null;
	}
}

/** Delete saved game */
export async function deleteSave() {
	try {
		const idb = await getIdb();
		await idb.del(SAVE_KEY);
		return true;
	} catch (err) {
		console.error('[Marginalia] Delete save failed:', err);
		return false;
	}
}

/** Start auto-save timer */
export function startAutoSave() {
	stopAutoSave();
	autoSaveTimer = setInterval(() => {
		saveGame();
	}, AUTO_SAVE_INTERVAL);
}

/** Stop auto-save timer */
export function stopAutoSave() {
	if (autoSaveTimer) {
		clearInterval(autoSaveTimer);
		autoSaveTimer = null;
	}
}

/** Check if a save exists */
export async function hasSave() {
	try {
		const idb = await getIdb();
		const data = await idb.get(SAVE_KEY);
		return data != null;
	} catch {
		return false;
	}
}
