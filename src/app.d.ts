// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module 'browserify-fs' {
	import type { Stats, Dirent } from 'fs';
	
	export function readFileSync(path: string): Buffer;
	export function readdirSync(path: string, options?: { withFileTypes?: false }): string[];
	export function readdirSync(path: string, options: { withFileTypes: true }): Dirent[];
	export function existsSync(path: string): boolean;
	export function statSync(path: string): Stats;
}

declare module 'path-browserify' {
	export function join(...paths: string[]): string;
	export function resolve(...paths: string[]): string;
	export function dirname(path: string): string;
	export function basename(path: string, ext?: string): string;
	export function extname(path: string): string;
}

export {};
