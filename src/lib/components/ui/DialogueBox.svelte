<script>
	import { brianna, isSpeaking } from '../../stores/brianna.js';
	import { onMount } from 'svelte';

	let displayedText = $state('');
	let typewriterIndex = $state(0);
	let typewriterInterval = null;

	// Typewriter effect
	$effect(() => {
		const fullText = $brianna.currentDialogue;
		const visible = $isSpeaking;

		if (typewriterInterval) {
			clearInterval(typewriterInterval);
			typewriterInterval = null;
		}

		if (visible && fullText) {
			displayedText = '';
			typewriterIndex = 0;

			typewriterInterval = setInterval(() => {
				if (typewriterIndex < fullText.length) {
					displayedText = fullText.slice(0, typewriterIndex + 1);
					typewriterIndex++;
				} else {
					clearInterval(typewriterInterval);
					typewriterInterval = null;
				}
			}, 30);
		} else {
			displayedText = '';
		}
	});

	function dismiss() {
		brianna.dismissDialogue();
	}

	onMount(() => {
		return () => {
			if (typewriterInterval) clearInterval(typewriterInterval);
		};
	});
</script>

{#if $isSpeaking}
	<div class="dialogue-box" role="dialog" aria-label="Brianna speaks">
		<div class="dialogue-header">
			<span class="dialogue-name">~ Brianna ~</span>
			<button class="dialogue-close" onclick={dismiss} aria-label="Close">&times;</button>
		</div>
		<div class="dialogue-text">
			{displayedText}<span class="cursor">|</span>
		</div>
	</div>
{/if}

<style>
	.dialogue-box {
		background-color: var(--color-surface);
		border: var(--border-accent);
		box-shadow: var(--shadow-md);
		padding: 0;
		max-width: 400px;
		width: 100%;
	}

	.dialogue-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 4px 8px;
		background-color: var(--color-purple-dim);
		border-bottom: var(--border-accent);
	}

	.dialogue-name {
		font-family: var(--font-pixel);
		font-size: var(--font-size-xs);
		color: var(--color-text-bright);
		letter-spacing: 1px;
	}

	.dialogue-close {
		background: none;
		border: none;
		color: var(--color-text-dim);
		font-size: var(--font-size-lg);
		padding: 0 4px;
		box-shadow: none;
	}

	.dialogue-close:hover {
		color: var(--color-text-bright);
		background: none;
	}

	.dialogue-text {
		padding: 12px;
		font-family: var(--font-body);
		font-size: var(--font-size-md);
		color: var(--color-text);
		line-height: 1.8;
		min-height: 48px;
	}

	.cursor {
		animation: blink 0.6s step-end infinite;
		color: var(--color-text-accent);
	}

	@keyframes blink {
		50% { opacity: 0; }
	}
</style>
