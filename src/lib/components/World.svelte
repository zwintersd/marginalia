<script>
	import Zone from './Zone.svelte';
	import { zones, gameState } from '../stores/gameState.js';
</script>

<div class="world">
	<div class="world-header">
		<h2>~ The Written World ~</h2>
	</div>
	<div class="world-grid">
		{#each $zones as zone (zone.id)}
			<Zone {zone} creatures={$gameState?.creatures || []} />
		{/each}
	</div>
</div>

<style>
	.world {
		width: 100%;
	}

	.world-header {
		text-align: center;
		padding: 8px;
		border-bottom: var(--border);
		margin-bottom: 8px;
	}

	.world-header h2 {
		font-size: var(--font-size-sm);
		color: var(--color-text-accent);
		letter-spacing: 2px;
	}

	.world-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 8px;
		padding: 8px;
	}

	@media (max-width: 768px) {
		.world-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 480px) {
		.world-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
