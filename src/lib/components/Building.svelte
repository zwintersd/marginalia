<script>
	import { BUILDINGS, getUpgradeCost } from '../data/buildings.js';
	import { gameState, resources } from '../stores/gameState.js';
	import { formatNumber } from '../utils/time.js';

	/** @type {{ building: object, zoneId: string }} */
	let { building, zoneId } = $props();

	let def = $derived(BUILDINGS[building.type]);
	let upgradeCost = $derived(getUpgradeCost(building.type, building.stage));
	let canUpgrade = $derived(
		building.stage < 12 &&
		Object.entries(upgradeCost).every(([r, cost]) => ($resources[r] || 0) >= cost)
	);

	function upgrade() {
		if (!canUpgrade) return;
		for (const [resource, cost] of Object.entries(upgradeCost)) {
			gameState.spendResource(resource, cost);
		}
		gameState.upgradeBuilding(zoneId, building.id);
	}
</script>

{#if def}
	<div class="building" title="{def.description}">
		<div class="building-sprite">
			<div class="stage-badge">{building.stage}</div>
		</div>
		<div class="building-info">
			<div class="building-name">{def.name}</div>
			<div class="building-stage">Stage {building.stage}/12</div>
			{#if building.stage < 12}
				<button class="upgrade-btn" onclick={upgrade} disabled={!canUpgrade}>
					UPGRADE
					{#each Object.entries(upgradeCost) as [resource, cost]}
						<span class="cost">{formatNumber(cost)} {resource}</span>
					{/each}
				</button>
			{:else}
				<div class="max-stage">MAX</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.building {
		display: flex;
		gap: 8px;
		padding: 8px;
		background-color: var(--color-surface);
		border: var(--border);
		box-shadow: var(--shadow-sm);
	}

	.building-sprite {
		width: 48px;
		height: 48px;
		background-color: var(--color-bg);
		border: var(--border);
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		flex-shrink: 0;
	}

	.stage-badge {
		font-family: var(--font-pixel);
		font-size: var(--font-size-lg);
		color: var(--color-text-accent);
	}

	.building-info {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.building-name {
		font-family: var(--font-pixel);
		font-size: var(--font-size-xs);
		color: var(--color-text-bright);
	}

	.building-stage {
		font-size: var(--font-size-sm);
		color: var(--color-text-dim);
	}

	.upgrade-btn {
		font-size: var(--font-size-xs);
		padding: 2px 6px;
		display: flex;
		gap: 4px;
		align-items: center;
		flex-wrap: wrap;
	}

	.cost {
		color: var(--color-text-dim);
		font-size: var(--font-size-xs);
	}

	.max-stage {
		font-family: var(--font-pixel);
		font-size: var(--font-size-xs);
		color: var(--color-teal);
	}
</style>
