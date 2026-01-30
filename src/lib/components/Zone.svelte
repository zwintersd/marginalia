<script>
	import Building from './Building.svelte';
	import Creature from './Creature.svelte';
	import { BUILDINGS, getPlacementCost } from '../data/buildings.js';
	import { gameState, resources } from '../stores/gameState.js';
	import { generateId } from '../utils/random.js';
	import { formatNumber } from '../utils/time.js';

	/** @type {{ zone: object, creatures: object[] }} */
	let { zone, creatures = [] } = $props();

	let showBuildMenu = $state(false);
	let zoneCreatures = $derived(creatures.filter(c => c.zoneId === zone.id));

	function canAfford(cost) {
		return Object.entries(cost).every(([r, amount]) => ($resources[r] || 0) >= amount);
	}

	function placeBuilding(type) {
		const cost = getPlacementCost(type);
		if (!canAfford(cost)) return;

		for (const [resource, amount] of Object.entries(cost)) {
			gameState.spendResource(resource, amount);
		}

		gameState.placeBuilding(zone.id, {
			id: generateId(),
			type
		});

		showBuildMenu = false;
	}
</script>

<div class="zone" class:locked={!zone.unlocked}>
	<div class="zone-header">
		<h3 class="zone-name">{zone.name}</h3>
		{#if !zone.unlocked}
			<span class="locked-badge">LOCKED</span>
		{/if}
	</div>

	{#if zone.unlocked}
		<div class="zone-content">
			<!-- Buildings -->
			<div class="buildings">
				{#each zone.buildings as building (building.id)}
					<Building {building} zoneId={zone.id} />
				{/each}
			</div>

			<!-- Creatures -->
			{#if zoneCreatures.length > 0}
				<div class="creatures">
					{#each zoneCreatures as creature (creature.id)}
						<Creature {creature} />
					{/each}
				</div>
			{/if}

			<!-- Build button -->
			<div class="zone-actions">
				<button onclick={() => showBuildMenu = !showBuildMenu}>
					{showBuildMenu ? 'CANCEL' : '+ BUILD'}
				</button>
			</div>

			<!-- Build menu -->
			{#if showBuildMenu}
				<div class="build-menu">
					{#each Object.entries(BUILDINGS) as [type, def]}
						{@const cost = getPlacementCost(type)}
						<button
							class="build-option"
							onclick={() => placeBuilding(type)}
							disabled={!canAfford(cost)}
						>
							<span class="build-name">{def.name}</span>
							<span class="build-cost">
								{#each Object.entries(cost) as [resource, amount]}
									{formatNumber(amount)} {resource}
								{/each}
							</span>
						</button>
					{/each}
				</div>
			{/if}
		</div>
	{:else}
		<div class="locked-message">
			<p>This land has not yet been written...</p>
		</div>
	{/if}
</div>

<style>
	.zone {
		background-color: var(--color-surface);
		border: var(--border);
		box-shadow: var(--shadow-md);
		padding: 0;
		min-height: 120px;
	}

	.zone.locked {
		opacity: 0.5;
	}

	.zone-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 4px 8px;
		background-color: var(--color-surface-raised);
		border-bottom: var(--border);
	}

	.zone-name {
		font-size: var(--font-size-xs);
		letter-spacing: 1px;
	}

	.locked-badge {
		font-family: var(--font-pixel);
		font-size: 6px;
		color: var(--color-text-dim);
		border: var(--border);
		padding: 1px 4px;
	}

	.zone-content {
		padding: 8px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.buildings {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.creatures {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		padding: 4px;
		border-top: var(--border);
	}

	.zone-actions {
		display: flex;
		justify-content: center;
	}

	.build-menu {
		display: flex;
		flex-direction: column;
		gap: 2px;
		border: var(--border);
		padding: 4px;
		background-color: var(--color-bg);
	}

	.build-option {
		display: flex;
		justify-content: space-between;
		align-items: center;
		text-align: left;
		padding: 4px 8px;
	}

	.build-name {
		font-size: var(--font-size-xs);
	}

	.build-cost {
		font-size: var(--font-size-xs);
		color: var(--color-text-dim);
	}

	.locked-message {
		padding: 16px;
		text-align: center;
		color: var(--color-text-dim);
		font-style: italic;
	}
</style>
