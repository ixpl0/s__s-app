<script lang="ts">
  import '../app.css';
  import ThemeSelector from '$lib/components/ThemeSelector.svelte';
  import ToastContainer from '$lib/components/ToastContainer.svelte';
</script>

<header class="navbar bg-base-100 shadow-sm min-h-16 mb-4">
  <div class="container mx-auto flex justify-between items-center px-4">
    <ThemeSelector />
    <div class="text-3xl font-bold text-nowrap">$__$</div>
  </div>
</header>

<main class="container mx-auto px-4">
  <slot></slot>
</main>

<ToastContainer />
