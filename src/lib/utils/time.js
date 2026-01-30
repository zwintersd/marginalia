/**
 * Time formatting and delta calculation utilities.
 */

/**
 * Format seconds into a human-readable duration.
 * @param {number} seconds
 * @returns {string}
 */
export function formatDuration(seconds) {
	if (seconds < 60) {
		return `${Math.floor(seconds)}s`;
	}

	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = Math.floor(seconds % 60);

	if (hours > 0) {
		return `${hours}h ${minutes}m`;
	}
	return `${minutes}m ${secs}s`;
}

/**
 * Format a resource rate per second into a readable per-minute or per-second string.
 * @param {number} perSecond
 * @returns {string}
 */
export function formatRate(perSecond) {
	if (perSecond === 0) return '0/s';
	if (perSecond >= 1) return `${perSecond.toFixed(1)}/s`;
	const perMinute = perSecond * 60;
	return `${perMinute.toFixed(1)}/min`;
}

/**
 * Calculate how many seconds have passed since a timestamp.
 * @param {number} timestamp - Unix timestamp in ms
 * @returns {number} seconds elapsed
 */
export function secondsSince(timestamp) {
	return (Date.now() - timestamp) / 1000;
}

/**
 * Format a number with abbreviations for large values.
 * @param {number} value
 * @returns {string}
 */
export function formatNumber(value) {
	if (value < 1000) return Math.floor(value).toString();
	if (value < 1_000_000) return (value / 1000).toFixed(1) + 'K';
	return (value / 1_000_000).toFixed(1) + 'M';
}
