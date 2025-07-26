<script lang="ts">
  export let size: 'xs' | 'sm' | 'md' | 'lg' = 'md';
  export let text = '';
  export let center = true;
</script>

<div class="flex items-center gap-3" class:justify-center={center}>
  <span class="loading loading-spinner loading-{size}"></span>
  {#if text}
    <span class="text-sm opacity-70">{text}</span>
  {/if}
</div>
