import { writable, derived } from 'svelte/store';

/**
 * Core game state store.
 * Manages resources, buildings, zones, creatures, unlocks, and stats.
 */

const DEFAULT_STATE = {
	resources: {
		ink: 0,
		imagination: 10,
		words: 0
	},
	zones: [
		{ id: 'meadow', name: 'The Meadow', unlocked: true, buildings: [] },
		{ id: 'forest', name: 'The Whispering Forest', unlocked: false, buildings: [] },
		{ id: 'lake', name: 'The Still Lake', unlocked: false, buildings: [] },
		{ id: 'mountain', name: 'The Dreaming Peak', unlocked: false, buildings: [] },
		{ id: 'ruins', name: 'The Old Ruins', unlocked: false, buildings: [] },
		{ id: 'sky', name: 'The Open Sky', unlocked: false, buildings: [] }
	],
	creatures: [],
	unlocks: [],
	stats: {
		totalWordsWritten: 0,
		worldsCreated: 0,
		timePlayedSeconds: 0
	}
};

function createGameState() {
	const { subscribe, set, update } = writable(structuredClone(DEFAULT_STATE));

	return {
		subscribe,
		set,

		/** Add resources by type and amount */
		addResource(type, amount) {
			update(state => {
				if (type in state.resources) {
					state.resources[type] += amount;
				}
				return state;
			});
		},

		/** Spend resources; returns false if insufficient */
		spendResource(type, amount) {
			let success = false;
			update(state => {
				if (type in state.resources && state.resources[type] >= amount) {
					state.resources[type] -= amount;
					success = true;
				}
				return state;
			});
			return success;
		},

		/** Place a building in a zone */
		placeBuilding(zoneId, building) {
			update(state => {
				const zone = state.zones.find(z => z.id === zoneId);
				if (zone && zone.unlocked) {
					zone.buildings.push({
						id: building.id,
						type: building.type,
						stage: 1,
						placedAt: Date.now()
					});
				}
				return state;
			});
		},

		/** Upgrade a building to the next stage */
		upgradeBuilding(zoneId, buildingId) {
			update(state => {
				const zone = state.zones.find(z => z.id === zoneId);
				if (zone) {
					const building = zone.buildings.find(b => b.id === buildingId);
					if (building && building.stage < 12) {
						building.stage += 1;
					}
				}
				return state;
			});
		},

		/** Unlock a zone by id */
		unlockZone(zoneId) {
			update(state => {
				const zone = state.zones.find(z => z.id === zoneId);
				if (zone) {
					zone.unlocked = true;
				}
				return state;
			});
		},

		/** Add a creature to the world */
		addCreature(creature) {
			update(state => {
				state.creatures.push({
					id: creature.id,
					type: creature.type,
					zoneId: creature.zoneId,
					spawnedAt: Date.now()
				});
				return state;
			});
		},

		/** Remove a creature by id */
		removeCreature(creatureId) {
			update(state => {
				state.creatures = state.creatures.filter(c => c.id !== creatureId);
				return state;
			});
		},

		/** Add an unlock flag */
		addUnlock(unlockId) {
			update(state => {
				if (!state.unlocks.includes(unlockId)) {
					state.unlocks.push(unlockId);
				}
				return state;
			});
		},

		/** Check if something is unlocked */
		hasUnlock(unlockId) {
			let result = false;
			const unsubscribe = subscribe(state => {
				result = state.unlocks.includes(unlockId);
			});
			unsubscribe();
			return result;
		},

		/** Update stats */
		addStat(key, amount) {
			update(state => {
				if (key in state.stats) {
					state.stats[key] += amount;
				}
				return state;
			});
		},

		/** Reset to default state */
		reset() {
			set(structuredClone(DEFAULT_STATE));
		},

		/** Load state from saved data */
		load(savedState) {
			set(savedState);
		}
	};
}

export const gameState = createGameState();

/** Derived store: just the resources */
export const resources = derived(gameState, $state => $state.resources);

/** Derived store: unlocked zones */
export const unlockedZones = derived(gameState, $state =>
	$state.zones.filter(z => z.unlocked)
);

/** Derived store: all zones */
export const zones = derived(gameState, $state => $state.zones);

/** Derived store: total building count */
export const totalBuildings = derived(gameState, $state =>
	$state.zones.reduce((sum, z) => sum + z.buildings.length, 0)
);
