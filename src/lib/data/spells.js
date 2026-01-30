/**
 * Spell (writing/creation) definitions.
 * Spells are what Brianna uses to create and shape the world.
 */

/** @typedef {{ name: string, description: string, cost: Record<string, number>, effect: string, unlockCondition?: string }} SpellDef */

/** @type {Record<string, SpellDef>} */
export const SPELLS = {
	writeWord: {
		name: 'Write a Word',
		description: 'Put pen to paper. The simplest act of creation.',
		cost: { ink: 1 },
		effect: 'produce_words',
		produces: { words: 1 }
	},
	dreamSketch: {
		name: 'Dream Sketch',
		description: 'Sketch an idea from the edges of imagination.',
		cost: { imagination: 3 },
		effect: 'produce_ink',
		produces: { ink: 2 }
	},
	inkVerse: {
		name: 'Ink Verse',
		description: 'Write a verse in deep ink. Words flow from meaning.',
		cost: { ink: 3, imagination: 2 },
		effect: 'produce_words',
		produces: { words: 4 },
		unlockCondition: 'first_building'
	},
	summonCreature: {
		name: 'Summon Creature',
		description: 'Write a creature into being. It may stay, or it may wander.',
		cost: { words: 5, imagination: 5 },
		effect: 'spawn_creature',
		unlockCondition: 'zone_2_unlocked'
	},
	expandMargins: {
		name: 'Expand the Margins',
		description: 'Push the edges of the world outward. New land appears.',
		cost: { ink: 20, imagination: 20, words: 15 },
		effect: 'unlock_zone',
		unlockCondition: 'first_building'
	},
	deepReverie: {
		name: 'Deep Reverie',
		description: 'Brianna closes her eyes and dreams deeply. Imagination overflows.',
		cost: { ink: 5, words: 3 },
		effect: 'produce_imagination',
		produces: { imagination: 8 },
		unlockCondition: 'zone_2_unlocked'
	}
};

/**
 * Check if the player can afford a spell.
 * @param {string} spellId
 * @param {Record<string, number>} resources
 * @returns {boolean}
 */
export function canCastSpell(spellId, resources) {
	const spell = SPELLS[spellId];
	if (!spell) return false;

	return Object.entries(spell.cost).every(
		([resource, amount]) => (resources[resource] || 0) >= amount
	);
}
