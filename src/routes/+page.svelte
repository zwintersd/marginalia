<script>
	import { onMount, onDestroy } from 'svelte';
	import ResourceBar from '$lib/components/ui/ResourceBar.svelte';
	import Brianna from '$lib/components/Brianna.svelte';
	import World from '$lib/components/World.svelte';
	import Spellbook from '$lib/components/Spellbook.svelte';
	import { gameState } from '$lib/stores/gameState.js';
	import { brianna } from '$lib/stores/brianna.js';
	import { loadGame, saveGame, startAutoSave, stopAutoSave } from '$lib/stores/persistence.js';
	import { startTicker, stopTicker, onTick } from '$lib/engine/ticker.js';
	import { calculateProductionRates, applyOfflineProgress } from '$lib/engine/idleCalculator.js';
	import { tickEvents, resetEventTimer } from '$lib/engine/events.js';
	import { getDialogue } from '$lib/data/dialogue.js';
	import { formatDuration } from '$lib/utils/time.js';

	let loaded = $state(false);
	let offlineReport = $state(null);
	let unlocks = $state([]);

	// Subscribe to unlocks for Spellbook
	gameState.subscribe(s => unlocks = s.unlocks);

	onMount(async () => {
		// Load saved game
		const savedData = await loadGame();

		if (savedData) {
			// Calculate offline progress
			const secondsAway = (Date.now() - savedData.timestamp) / 1000;
			if (secondsAway > 10) {
				const report = applyOfflineProgress(savedData, secondsAway);
				if (report.secondsCalculated > 0) {
					offlineReport = {
						duration: formatDuration(report.secondsCalculated),
						resources: report.resourcesGained
					};
					brianna.speak(getDialogue('returnAfterAbsence'));
				}
			}
		} else {
			// First time playing
			brianna.speak(getDialogue('firstOpen'), 8000);
		}

		// Register tick callbacks
		onTick((delta) => {
			// Resource production from buildings
			let currentState;
			gameState.subscribe(s => currentState = s)();

			const rates = calculateProductionRates(currentState);
			if (rates.ink > 0) gameState.addResource('ink', rates.ink * delta);
			if (rates.imagination > 0) gameState.addResource('imagination', rates.imagination * delta);
			if (rates.words > 0) gameState.addResource('words', rates.words * delta);

			// Random events
			tickEvents(delta, currentState);
		});

		// Start systems
		resetEventTimer();
		startTicker();
		startAutoSave();

		loaded = true;
	});

	onDestroy(() => {
		stopTicker();
		stopAutoSave();
		saveGame();
	});

	function dismissOfflineReport() {
		offlineReport = null;
	}

	async function handleSave() {
		await saveGame();
		brianna.speak('Saved! The world remembers.', 3000);
	}
</script>

<svelte:head>
	<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
</svelte:head>

<div class="game-container">
	{#if !loaded}
		<div class="loading">
			<p class="glow-text">~ Loading the margins... ~</p>
		</div>
	{:else}
		<!-- Offline Report Modal -->
		{#if offlineReport}
			<div class="modal-overlay">
				<div class="modal panel">
					<h2>Welcome back!</h2>
					<p>You were away for {offlineReport.duration}.</p>
					<p>While you were gone:</p>
					<ul>
						{#if offlineReport.resources.ink > 0}
							<li>+{Math.floor(offlineReport.resources.ink)} Ink gathered</li>
						{/if}
						{#if offlineReport.resources.imagination > 0}
							<li>+{Math.floor(offlineReport.resources.imagination)} Imagination drifted in</li>
						{/if}
						{#if offlineReport.resources.words > 0}
							<li>+{Math.floor(offlineReport.resources.words)} Words written themselves</li>
						{/if}
					</ul>
					<button onclick={dismissOfflineReport}>Continue</button>
				</div>
			</div>
		{/if}

		<!-- Header -->
		<header class="game-header">
			<div class="title-area">
				<h1 class="game-title glow-text">~ Marginalia ~</h1>
				<p class="subtitle">a world in the margins</p>
			</div>
			<ResourceBar />
			<div class="header-actions">
				<button onclick={handleSave}>SAVE</button>
			</div>
		</header>

		<!-- Main Content -->
		<main class="game-main">
			<div class="sidebar-left">
				<Brianna />
				<Spellbook {unlocks} />
			</div>
			<div class="content-area">
				<World />
			</div>
		</main>

		<!-- Footer -->
		<footer class="game-footer">
			<p>~ Marginalia v0.1 ~ A world written in the margins ~</p>
		</footer>
	{/if}
</div>

<style>
	.game-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		max-width: 1024px;
		margin: 0 auto;
		border-left: var(--border);
		border-right: var(--border);
		background-color: var(--color-bg);
	}

	.loading {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		font-family: var(--font-pixel);
		font-size: var(--font-size-sm);
	}

	/* Header */
	.game-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		padding: 16px 8px 8px;
		border-bottom: var(--border);
		background-color: var(--color-surface);
	}

	.title-area {
		text-align: center;
	}

	.game-title {
		font-size: var(--font-size-xl);
		letter-spacing: 4px;
	}

	.subtitle {
		font-family: var(--font-body);
		font-size: var(--font-size-sm);
		color: var(--color-text-dim);
		margin-top: 4px;
	}

	.header-actions {
		display: flex;
		gap: 4px;
	}

	/* Main layout */
	.game-main {
		display: flex;
		flex: 1;
		gap: 0;
	}

	.sidebar-left {
		width: 260px;
		flex-shrink: 0;
		border-right: var(--border);
		padding: 8px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		background-color: var(--color-surface);
	}

	.content-area {
		flex: 1;
		padding: 8px;
	}

	/* Footer */
	.game-footer {
		text-align: center;
		padding: 8px;
		border-top: var(--border);
		font-family: var(--font-pixel);
		font-size: 6px;
		color: var(--color-text-dim);
		background-color: var(--color-surface);
	}

	/* Modal */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(10, 8, 16, 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
	}

	.modal {
		max-width: 360px;
		text-align: center;
	}

	.modal h2 {
		font-size: var(--font-size-sm);
		margin-bottom: 8px;
	}

	.modal p {
		margin-bottom: 4px;
		font-size: var(--font-size-md);
	}

	.modal ul {
		list-style: none;
		margin: 8px 0;
	}

	.modal li {
		color: var(--color-teal);
		font-size: var(--font-size-sm);
		padding: 2px 0;
	}

	.modal button {
		margin-top: 12px;
	}

	@media (max-width: 768px) {
		.game-main {
			flex-direction: column;
		}

		.sidebar-left {
			width: 100%;
			border-right: none;
			border-bottom: var(--border);
		}
	}
</style>
