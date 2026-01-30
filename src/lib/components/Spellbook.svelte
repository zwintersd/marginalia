<script>
	import { get } from 'svelte/store';
	import { SPELLS, canCastSpell } from '../data/spells.js';
	import { gameState, resources } from '../stores/gameState.js';
	import { brianna } from '../stores/brianna.js';
	import { generateId } from '../utils/random.js';
	import { getSpawnableCreatures } from '../data/creatures.js';
	import { weightedRandom } from '../utils/random.js';
	import { formatNumber } from '../utils/time.js';

	/** @type {{ unlocks?: string[] }} */
	let { unlocks = [] } = $props();

	function isUnlocked(spell) {
		if (!spell.unlockCondition) return true;
		return unlocks.includes(spell.unlockCondition);
	}

	function castSpell(spellId) {
		const spell = SPELLS[spellId];
		const currentResources = get(resources);
		if (!spell || !canCastSpell(spellId, currentResources)) return;

		// Spend costs
		for (const [resource, amount] of Object.entries(spell.cost)) {
			gameState.spendResource(resource, amount);
		}

		// Apply effect
		switch (spell.effect) {
			case 'produce_words':
			case 'produce_ink':
			case 'produce_imagination':
				if (spell.produces) {
					for (const [resource, amount] of Object.entries(spell.produces)) {
						gameState.addResource(resource, amount);
					}
				}
				break;

			case 'spawn_creature': {
				const currentState = get(gameState);
				const unlockedZones = currentState.zones.filter(z => z.unlocked);
				if (unlockedZones.length > 0) {
					const zone = unlockedZones[Math.floor(Math.random() * unlockedZones.length)];
					const spawnable = getSpawnableCreatures(zone.id);
					if (spawnable.length > 0) {
						const idx = weightedRandom(spawnable);
						gameState.addCreature({
							id: generateId(),
							type: spawnable[idx].type,
							zoneId: zone.id
						});
					}
				}
				break;
			}

			case 'unlock_zone': {
				const currentState = get(gameState);
				const locked = currentState.zones.find(z => !z.unlocked);
				if (locked) {
					gameState.unlockZone(locked.id);
				}
				break;
			}
		}

		// Update stats and Brianna
		gameState.addStat('totalWordsWritten', spell.produces?.words || 0);
		brianna.onSpellCast();
	}
</script>

<div class="spellbook">
	<div class="spellbook-header">
		<h2>&#9998; Spellbook</h2>
	</div>
	<div class="spellbook-content">
		{#each Object.entries(SPELLS) as [id, spell]}
			{#if isUnlocked(spell)}
				{@const affordable = canCastSpell(id, $resources)}
				<button
					class="spell"
					class:affordable
					onclick={() => castSpell(id)}
					disabled={!affordable}
					title={spell.description}
				>
					<div class="spell-name">{spell.name}</div>
					<div class="spell-cost">
						{#each Object.entries(spell.cost) as [resource, amount]}
							<span class="cost-item" class:insufficient={($resources[resource] || 0) < amount}>
								{formatNumber(amount)} {resource}
							</span>
						{/each}
					</div>
				</button>
			{/if}
		{/each}
	</div>
</div>

<style>
	.spellbook {
		background-color: var(--color-surface);
		border: var(--border-accent);
		box-shadow: var(--shadow-md);
	}

	.spellbook-header {
		padding: 4px 8px;
		background-color: var(--color-ink);
		border-bottom: var(--border-accent);
	}

	.spellbook-header h2 {
		font-size: var(--font-size-sm);
		letter-spacing: 2px;
	}

	.spellbook-content {
		padding: 8px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.spell {
		display: flex;
		flex-direction: column;
		gap: 2px;
		text-align: left;
		padding: 6px 8px;
		background-color: var(--color-bg);
	}

	.spell.affordable {
		background-color: var(--color-surface-raised);
		color: var(--color-text-bright);
	}

	.spell.affordable:hover {
		background-color: var(--color-purple-dim);
	}

	.spell-name {
		font-size: var(--font-size-xs);
	}

	.spell-cost {
		display: flex;
		gap: 6px;
		font-size: var(--font-size-xs);
	}

	.cost-item {
		color: var(--color-text-dim);
	}

	.cost-item.insufficient {
		color: #884444;
	}
</style>
