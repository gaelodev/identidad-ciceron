<script setup lang="ts">
import { ref, onMounted } from 'vue';
const props = defineProps<{ labels: { light: string; dark: string } }>();
const theme = ref<'light' | 'dark'>('light');
onMounted(() => { theme.value = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; });
function set(t: 'light' | 'dark') {
  theme.value = t;
  document.documentElement.setAttribute('data-theme', t);
  try { localStorage.setItem('ciceron-theme', t); } catch { /* sin almacenamiento: solo esta sesión */ }
}
</script>
<template>
  <div class="seg no-print" role="group" aria-label="Tema">
    <button type="button" :aria-pressed="theme === 'light'" @click="set('light')">{{ props.labels.light }}</button>
    <button type="button" :aria-pressed="theme === 'dark'" @click="set('dark')">{{ props.labels.dark }}</button>
  </div>
</template>
<style scoped>
.seg { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; padding: 2px; border-radius: var(--radius-sm); background: var(--bg-field); }
button { height: 28px; border: 0; border-radius: var(--radius-sm); background: none; font: inherit; font-size: 12px; font-weight: 500; color: var(--text-secondary); cursor: pointer; }
button[aria-pressed="true"] { background: var(--bg-raised); color: var(--text-primary); box-shadow: var(--shadow-low); }
</style>
