<script lang="ts">
  import '../app.css';
  import ThemeSelector from '$lib/components/ThemeSelector.svelte';
  import ToastContainer from '$lib/components/ToastContainer.svelte';
  import SettingsModal from '$lib/components/SettingsModal.svelte';
  import { page } from '$app/stores';

  let isSettingsModalOpen = false;

  $: user = $page.data.user;
  $: userSettings = $page.data.userSettings;

  function openSettingsModal(): void {
    isSettingsModalOpen = true;
  }
</script>

<header class="navbar bg-base-100 shadow-sm min-h-16 mb-4">
  <div class="container mx-auto flex justify-between items-center px-4">
    <ThemeSelector />
    <div class="text-3xl font-bold text-nowrap">$__$</div>
    {#if user}
      <button
        class="btn btn-ghost btn-circle"
        on:click={openSettingsModal}
        title="Настройки"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
          <path
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>
      </button>
    {/if}
  </div>
</header>

<main class="container mx-auto px-4">
  <slot></slot>
</main>

<ToastContainer />

{#if isSettingsModalOpen && user && userSettings}
  <SettingsModal
    bind:isOpen={isSettingsModalOpen}
    currentBaseCurrency={userSettings.baseCurrency}
    username={user.username}
  />
{/if}
