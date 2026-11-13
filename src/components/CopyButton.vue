<script setup lang="ts">
import { ref } from 'vue';
const props = defineProps<{ value: string; label?: string }>();
const done = ref(false);
async function copy() {
  try { await navigator.clipboard.writeText(props.value); done.value = true; setTimeout(() => (done.value = false), 1400); }
  catch { /* el navegador no permitió copiar */ }
}
</script>
<template>
  <button type="button" class="copy" :aria-label="`Copiar ${props.label ?? props.value}`" @click="copy">
    <span aria-live="polite">{{ done ? 'Copiado' : props.value }}</span>
  </button>
</template>
<style scoped>
.copy { padding: 0 6px; height: 24px; border: 0; border-radius: var(--radius-sm); background: var(--bg-field); font: inherit; font-family: ui-monospace, Consolas, monospace; font-size: 12px; color: var(--text-primary); cursor: pointer; }
.copy:hover { background: var(--bg-hover); }
</style>
