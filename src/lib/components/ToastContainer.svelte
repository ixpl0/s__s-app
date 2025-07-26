<script lang="ts">
  import { toasts, removeToast } from '$lib/stores/toasts';
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
      <button
        class="btn btn-sm btn-ghost ml-2"
        on:click={() => removeToast(toast.id)}
        type="button"
      >
        ✕
      </button>
    </div>
  {/each}
</div>
