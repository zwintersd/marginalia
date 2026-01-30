import { writable, derived } from 'svelte/store';

/**
 * Brianna (the witch) state store.
 * Manages mood, current dialogue, animation state, and interaction history.
 */

/** @typedef {'idle'|'writing'|'happy'|'sad'|'surprised'|'thinking'} BriannaMood */

const DEFAULT_BRIANNA = {
	/** @type {BriannaMood} */
	mood: 'idle',
	/** Current dialogue text being displayed */
	currentDialogue: '',
	/** Whether dialogue is currently being shown */
	dialogueVisible: false,
	/** Current sprite animation state */
	animation: 'idle',
	/** How many spells Brianna has cast this session */
	spellsCastThisSession: 0,
	/** Last time Brianna spoke */
	lastDialogueAt: 0
};

function createBriannaStore() {
	const { subscribe, set, update } = writable(structuredClone(DEFAULT_BRIANNA));

	let dialogueTimeout = null;

	return {
		subscribe,
		set,

		/** Set Brianna's mood */
		setMood(mood) {
			update(state => {
				state.mood = mood;
				state.animation = mood;
				return state;
			});
		},

		/** Show dialogue with auto-hide after duration */
		speak(text, durationMs = 5000) {
			if (dialogueTimeout) {
				clearTimeout(dialogueTimeout);
			}

			update(state => {
				state.currentDialogue = text;
				state.dialogueVisible = true;
				state.lastDialogueAt = Date.now();
				return state;
			});

			if (durationMs > 0) {
				dialogueTimeout = setTimeout(() => {
					update(state => {
						state.dialogueVisible = false;
						return state;
					});
				}, durationMs);
			}
		},

		/** Hide current dialogue */
		dismissDialogue() {
			if (dialogueTimeout) {
				clearTimeout(dialogueTimeout);
			}
			update(state => {
				state.dialogueVisible = false;
				return state;
			});
		},

		/** Record a spell cast */
		onSpellCast() {
			update(state => {
				state.spellsCastThisSession += 1;
				state.mood = 'happy';
				state.animation = 'writing';
				return state;
			});
		},

		/** Reset to default */
		reset() {
			if (dialogueTimeout) {
				clearTimeout(dialogueTimeout);
			}
			set(structuredClone(DEFAULT_BRIANNA));
		},

		/** Load from saved data */
		load(savedBrianna) {
			set({
				...structuredClone(DEFAULT_BRIANNA),
				mood: savedBrianna.mood || 'idle',
				currentDialogue: savedBrianna.currentDialogue || ''
			});
		}
	};
}

export const brianna = createBriannaStore();

/** Derived: is Brianna currently speaking? */
export const isSpeaking = derived(brianna, $b => $b.dialogueVisible);

/** Derived: current mood */
export const mood = derived(brianna, $b => $b.mood);
