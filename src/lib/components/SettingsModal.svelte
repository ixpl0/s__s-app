<script lang="ts">
  import { currencyOptions } from '$lib/constants/balance';
  import { userSettingsService } from '$lib/services/user-settings-service';
  import { invalidateAll } from '$app/navigation';
  import { toast } from '$lib/stores/toasts';
  import { handleApiError } from '$lib/utils/error-handling';
  import type { CurrencyValue } from '$lib/types/balance';

  export let isOpen = false;
  export let username = '';
  export let currentBaseCurrency: CurrencyValue = 'USD';

  let selectedCurrency = currentBaseCurrency;
  let isSaving = false;

  $: if (isOpen) {
    selectedCurrency = currentBaseCurrency;
  }

  function closeModal(): void {
    isOpen = false;
  }

  function handleBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }

  async function handleSave(): Promise<void> {
    if (selectedCurrency === currentBaseCurrency) {
      closeModal();
      return;
    }

    isSaving = true;

    try {
      const result =
        await userSettingsService.updateUserSettings(selectedCurrency);

      if (result) {
        await invalidateAll();
        toast.success('Настройки сохранены');
        closeModal();
      }
    } catch {
      handleApiError(
        {
          success: false,
          error: 'Ошибка при сохранении настроек',
          code: 'SETTINGS_SAVE_ERROR',
        },
        'handleSave',
      );
    } finally {
      isSaving = false;
    }
  }
</script>

<dialog class="modal" class:modal-open={isOpen} on:click={handleBackdropClick}>
  <div class="modal-box">
    <form method="dialog">
      <button
        class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        on:click={closeModal}
        type="button"
      >
        ✕
      </button>
    </form>

    <h3 class="font-bold text-lg mb-6">{username}</h3>

    <div class="form-control w-full">
      <label class="label" for="baseCurrency">
        <span class="label-text font-medium">Основная валюта</span>
      </label>
      <select
        id="baseCurrency"
        bind:value={selectedCurrency}
        class="select select-bordered w-full"
      >
        {#each currencyOptions as option (option.value)}
          <option value={option.value}>
            {option.symbol}
            {option.label}
          </option>
        {/each}
      </select>
      <label class="label">
        <span class="label-text-alt">
          Все суммы будут отображаться в этой валюте
        </span>
      </label>
    </div>

    <div class="modal-action">
      <button class="btn btn-ghost" on:click={closeModal} type="button">
        Отменить
      </button>
      <button
        class="btn btn-primary"
        class:loading={isSaving}
        disabled={isSaving || selectedCurrency === currentBaseCurrency}
        on:click={handleSave}
        type="button"
      >
        {isSaving ? 'Сохранение...' : 'Сохранить'}
      </button>
    </div>
  </div>
</dialog>
