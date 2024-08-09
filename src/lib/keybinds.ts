/* eslint-disable @typescript-eslint/no-unused-vars */
import { config, type AppConfig } from './stores/config';
import { toast } from 'svelte-sonner';

type Handler = (e: KeyboardEvent) => void | Promise<void>;

let appConfig: AppConfig;
config.subscribe((value) => {
  appConfig = value;
});

const bindings = new Map<string, Handler>();

const handleKeydown = (e: KeyboardEvent) => {
  const shiftOn = e.shiftKey;
  const specialOn = e.ctrlKey || e.metaKey;
  const altOn = e.altKey;
  const key = !shiftOn ? e.key : e.key.toUpperCase();

  const cmd = `${specialOn ? '<s>' : ''}${altOn ? '<alt>' : ''}${key}`;
  console.debug('keybind:', cmd);

  const handler = bindings.get(cmd);
  handler && handler(e);
};

export function init() {
  document.addEventListener('keydown', handleKeydown);
  return () => {
    document.removeEventListener('keydown', handleKeydown);
  };
}
export function register(bind: string, handler: Handler) {
  bindings.set(bind, handler);
  return bind;
}
export function toString(bind: string) {
  // TODO: platform specific
  const special = '⌘';
  const str = bind.replace('<s>', special);
  return str.replace(/[A-Z]/g, `↑${str.charAt(1)}`).toUpperCase();
}

// DEBUG
export const reloadConfig = register('<alt>R', async (e) => {
  e.preventDefault();

  try {
    await config.reload();
    toast.success('Config reloaded', {
      duration: 650,
    });
  } catch (error) {
    toast.error('Failed to reload config', {
      description: error as unknown as string,
    });
  }
});

const keybindsManager = { register, init };
export default keybindsManager;
