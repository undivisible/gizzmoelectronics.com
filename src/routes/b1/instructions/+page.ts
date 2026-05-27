import {
	b1InstructionAssets,
	b1InstructionGroups,
} from '$lib/data/b1InstructionAssets';

export const prerender = true;

export function load() {
	return {
		assets: b1InstructionAssets,
		groups: b1InstructionGroups,
	};
}
