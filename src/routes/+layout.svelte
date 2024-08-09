<script lang="ts">
  import '../app.pcss';
  import { ModeWatcher } from 'mode-watcher';
  import { onMount } from 'svelte';
  import { Toaster } from '$lib/components/ui/sonner';
  import keybindsManager from '../lib/keybinds';

  onMount(() => {
    return keybindsManager.init();
  });
</script>

<div class="app h-full text-zinc-400">
  <ModeWatcher />
  <Toaster />

  <main class="h-full">
    <slot></slot>
  </main>
</div>
