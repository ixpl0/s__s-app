<script lang="ts">
  import { toasts, removeToast } from '$lib/stores/toasts';
  import { fade, fly } from 'svelte/transition';

  function getToastClasses(type: string): string {
    switch (type) {
      case 'success':

        return 'alert-success';

      case 'error':

        return 'alert-error';

      case 'warning':

        return 'alert-warning';

      case 'info':

        return 'alert-info';

      default:

        return 'alert-info';
    }
  }
</script>

<div class="toast toast-top toast-end z-[9999]">
  {#each $toasts as toast (toast.id)}
    <div
      class="alert {getToastClasses(toast.type)} shadow-lg max-w-sm cursor-pointer"
      in:fly={{ x: 300, duration: 300 }}
      on:click={() => removeToast(toast.id)}
      on:keydown={(e) => e.key === 'Enter' && removeToast(toast.id)}
      out:fade={{ duration: 200 }}
      role="button"
      tabindex="0"
    >
      <span class="flex-1 text-center">{toast.message}</span>
    </div>
  {/each}
</div>
