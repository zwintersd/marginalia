<script>
	import { resources } from '../../stores/gameState.js';
	import { formatNumber } from '../../utils/time.js';
</script>

<div class="resource-bar">
	<div class="resource ink" title="Ink - the essence of creation">
		<span class="resource-icon">&#9998;</span>
		<span class="resource-label">INK</span>
		<span class="resource-value">{formatNumber($resources.ink)}</span>
	</div>
	<div class="resource imagination" title="Imagination - the fuel of possibility">
		<span class="resource-icon">&#10025;</span>
		<span class="resource-label">IMAG</span>
		<span class="resource-value">{formatNumber($resources.imagination)}</span>
	</div>
	<div class="resource words" title="Words - the building blocks of worlds">
		<span class="resource-icon">&#9997;</span>
		<span class="resource-label">WORDS</span>
		<span class="resource-value">{formatNumber($resources.words)}</span>
	</div>
</div>

<style>
	.resource-bar {
		display: flex;
		gap: 2px;
		background-color: var(--color-bg);
		border: var(--border);
		box-shadow: var(--shadow-sm);
		padding: 4px;
	}

	.resource {
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 4px 8px;
		border: var(--border);
		font-family: var(--font-pixel);
		font-size: var(--font-size-xs);
	}

	.resource-icon {
		font-size: var(--font-size-lg);
	}

	.resource-label {
		color: var(--color-text-dim);
		letter-spacing: 1px;
	}

	.resource-value {
		color: var(--color-text-bright);
		min-width: 40px;
		text-align: right;
	}

	.ink {
		background-color: var(--color-ink);
	}

	.imagination {
		background-color: #2a1840;
	}

	.words {
		background-color: #1a3030;
	}
</style>
