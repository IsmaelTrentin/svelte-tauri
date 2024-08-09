import { invoke } from '@tauri-apps/api';
import { writable } from 'svelte/store';

export type AppConfig = {
  version: string;
  db_path: string;
};

function createConfig() {
  const { subscribe, set } = writable<AppConfig>();

  const reload = async () => {
    const data = await invoke<AppConfig>('reload_config');
    set(data);
  };

  invoke<AppConfig>('get_config')
    .then((config) => set(config))
    .catch((e) => console.error('failed to get config', e));

  return {
    subscribe,
    reload,
  };
}

export const config = createConfig();
