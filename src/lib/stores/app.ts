import { writable } from 'svelte/store';

export type App = {
	loading: boolean;
};

function createApp() {
	const { subscribe, set, update } = writable<App>({
		loading: false,
	});

	return {
		subscribe,
		update,
		set(newState: App) {
			set(newState);
		}
	};
}

export const app = createApp();
