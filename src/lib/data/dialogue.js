/**
 * Brianna's dialogue lines organized by mood and trigger.
 */

/** @type {Record<string, string[]>} */
export const DIALOGUE = {
	idle: [
		'The margins are quiet today...',
		'I wonder what I should write next.',
		'Every world starts with a single word.',
		'Sometimes the best thing to do is just... sit.',
		'The ink is warm today. That\'s a good sign.',
		'Do you ever wonder if someone is watching us, too?'
	],

	writing: [
		'Yes... yes, this is good...',
		'The words are flowing nicely.',
		'I can feel the world growing.',
		'Each letter is a small act of love.',
		'Writing, writing... the margins expand.'
	],

	happy: [
		'Oh! Look at what we\'ve made!',
		'This world is becoming something beautiful.',
		'I\'m so glad you\'re here to see this.',
		'The creatures seem happy today, don\'t they?',
		'Every little thing we create matters.'
	],

	sad: [
		'Some days the ink runs thin...',
		'It\'s lonely work, creating worlds.',
		'I miss things that haven\'t been written yet.',
		'Even sadness has its place in a story.',
		'The margins feel smaller today.'
	],

	surprised: [
		'Oh! I didn\'t expect that!',
		'Well now... that\'s something new.',
		'The world has surprises even for its creator.',
		'How curious...',
		'I didn\'t write that... did I?'
	],

	thinking: [
		'Hmm... let me think about this.',
		'There\'s something at the edge of my thoughts...',
		'What if... no, wait... maybe...',
		'The answer is in the margins somewhere.',
		'I need more ink to figure this out.'
	],

	// Trigger-based dialogue
	firstOpen: [
		'Oh... hello. I didn\'t think anyone would come.',
		'Welcome to the margins. There\'s nothing here yet... but there could be.'
	],

	firstBuilding: [
		'We built something! A real, actual thing!',
		'It\'s not much, but it\'s ours. The first mark on a blank page.'
	],

	firstCreature: [
		'A creature! I wrote it and it... it\'s alive!',
		'Hello, little one. Welcome to our world.'
	],

	returnAfterAbsence: [
		'You came back... I kept writing while you were away.',
		'The world continued in your absence. It missed you.',
		'Welcome back. Things have grown a little.'
	],

	zoneUnlock: [
		'New land! The margins are expanding!',
		'There\'s more world now. More room for stories.',
		'Can you feel it? The edges are pushing outward.'
	]
};

/**
 * Get a random dialogue line for a mood or trigger.
 * @param {string} key - mood or trigger name
 * @returns {string}
 */
export function getDialogue(key) {
	const lines = DIALOGUE[key];
	if (!lines || lines.length === 0) {
		return '...';
	}
	return lines[Math.floor(Math.random() * lines.length)];
}
