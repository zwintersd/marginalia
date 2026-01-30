<script>
	/** @type {{ text?: string, visible?: boolean, x?: number, y?: number }} */
	let { text = '', visible = false, x = 0, y = 0 } = $props();
</script>

{#if visible && text}
	<div class="tooltip" style="left: {x}px; top: {y}px;">
		{text}
	</div>
{/if}

<style>
	.tooltip {
		position: fixed;
		z-index: 1000;
		background-color: var(--color-tooltip-bg);
		color: var(--color-text);
		border: var(--border-light);
		box-shadow: var(--shadow-md);
		padding: 4px 8px;
		font-family: var(--font-body);
		font-size: var(--font-size-sm);
		max-width: 200px;
		pointer-events: none;
		white-space: pre-wrap;
	}
</style>
