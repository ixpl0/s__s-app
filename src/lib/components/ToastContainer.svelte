<script lang="ts">
  import { toasts } from '$lib/stores/toasts';
  import { fly } from 'svelte/transition';
</script>

<div class="toast toast-top toast-end z-[60]">
  {#each $toasts as toast (toast.id)}
    <div
      class="alert"
      class:alert-error={toast.type === 'error'}
      class:alert-info={toast.type === 'info'}
      class:alert-success={toast.type === 'success'}
      class:alert-warning={toast.type === 'warning'}
      in:fly={{ x: 300, duration: 300 }}
      out:fly={{ x: 300, duration: 200 }}
    >
      <span>{toast.message}</span>
    </div>
  {/each}
</div>
