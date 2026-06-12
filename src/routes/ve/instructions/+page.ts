import {
	veInstructionAssets,
	veInstructionGroups,
} from '$lib/data/veInstructionAssets';

export const prerender = true;

export function load() {
	return {
		assets: veInstructionAssets,
		groups: veInstructionGroups,
	};
}
