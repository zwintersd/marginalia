<script>
	import { brianna, mood } from '../stores/brianna.js';
	import DialogueBox from './ui/DialogueBox.svelte';

	/** Sprite placeholder - will be replaced with actual sprites */
	const MOOD_SYMBOLS = {
		idle: '(@_@)',
		writing: '(@.@)~',
		happy: '(^_^)',
		sad: '(;_;)',
		surprised: '(O_O)!',
		thinking: '(@~@)...'
	};
</script>

<div class="brianna-container">
	<div class="brianna-sprite" title="Brianna the Witch - {$mood}">
		<div class="sprite-placeholder">
			{MOOD_SYMBOLS[$mood] || MOOD_SYMBOLS.idle}
		</div>
		<div class="brianna-label">Brianna</div>
	</div>
	<div class="dialogue-area">
		<DialogueBox />
	</div>
</div>

<style>
	.brianna-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}

	.brianna-sprite {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}

	.sprite-placeholder {
		width: 64px;
		height: 64px;
		background-color: var(--color-surface);
		border: var(--border);
		box-shadow: var(--shadow-sm);
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-body);
		font-size: var(--font-size-md);
		color: var(--color-text-accent);
	}

	.brianna-label {
		font-family: var(--font-pixel);
		font-size: var(--font-size-xs);
		color: var(--color-text-dim);
		text-align: center;
	}

	.dialogue-area {
		width: 100%;
		max-width: 400px;
	}
</style>
