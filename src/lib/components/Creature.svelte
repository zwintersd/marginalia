<script>
	import { CREATURES } from '../data/creatures.js';

	/** @type {{ creature: object }} */
	let { creature } = $props();

	let def = $derived(CREATURES[creature.type]);

	/** Simple wandering animation offset */
	let wanderX = $state(0);
	let wanderY = $state(0);

	$effect(() => {
		const interval = setInterval(() => {
			wanderX = Math.sin(Date.now() / 2000 + creature.id.charCodeAt(0)) * 8;
			wanderY = Math.cos(Date.now() / 1500 + creature.id.charCodeAt(1)) * 4;
		}, 200);
		return () => clearInterval(interval);
	});
</script>

{#if def}
	<div
		class="creature"
		title="{def.name} - {def.description}"
		style="transform: translate({wanderX}px, {wanderY}px);"
	>
		<div class="creature-sprite">
			<span class="creature-char">
				{#if def.rarity === 'rare'}&#9733;{:else if def.rarity === 'uncommon'}&#9672;{:else}&#9675;{/if}
			</span>
		</div>
		<div class="creature-name">{def.name}</div>
	</div>
{/if}

<style>
	.creature {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		transition: none;
	}

	.creature-sprite {
		width: 24px;
		height: 24px;
		background-color: var(--color-surface);
		border: var(--border);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.creature-char {
		font-size: var(--font-size-md);
		color: var(--color-teal);
	}

	.creature-name {
		font-family: var(--font-pixel);
		font-size: 6px;
		color: var(--color-text-dim);
		white-space: nowrap;
	}
</style>
