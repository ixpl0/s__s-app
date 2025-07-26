<script lang="ts">
  import type { BalanceSource } from '$lib/types/balance';
  import BalanceSourceRow from './BalanceSourceRow.svelte';
  import { invalidateAll } from '$app/navigation';
  import { balanceService } from '$lib/services/balance-service';
  import { loading } from '$lib/stores/loading';
  import { calculateTotalBalance, formatAmount } from '$lib/utils/budget';
  import { page } from '$app/stores';

  export let isOpen = false;
  export let monthName = '';
  export let year = 0;
  export let userMonthId: string;
  export let exchangeRates: Record<string, number> = {};

  let sources: BalanceSource[] = [];

  $: isLoading = $loading['balance-sources-load'] || false;
  $: isSaving = $loading['balance-sources-save'] || false;
  $: userSettings = $page.data.userSettings;
  $: baseCurrency = userSettings?.baseCurrency || 'USD';
  $: totalBalance = calculateTotalBalance(sources, baseCurrency, exchangeRates);

  $: if (isOpen && userMonthId) {
    loadBalanceSources();
  }

  async function loadBalanceSources(): Promise<void> {
    if (!userMonthId) {
      return;
    }

    const result = await balanceService.getBalanceSources(userMonthId);

    if (result) {
      sources = result;
    } else {
      sources = [];
    }
  }

  function closeModal(): void {
    isOpen = false;
  }

  function handleBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }

  function generateId(): string {
    return crypto.randomUUID();
  }

  function addNewSource(): void {
    const newSource: BalanceSource = {
      id: generateId(),
      name: '',
      currency: 'USD',
      amount: 0,
    };

    sources = [...sources, newSource];
  }

  function updateSource(index: number, updatedSource: BalanceSource): void {
    sources = sources.map((source, i) =>
      i === index ? updatedSource : source,
    );
  }

  async function deleteSource(index: number): Promise<void> {
    const source = sources[index];

    if (!source.userMonthId) {
      sources = sources.filter((_, i) => i !== index);
      return;
    }

    const response = await balanceService.deleteBalanceSource(source.id);

    if (response?.success) {
      sources = sources.filter((_, i) => i !== index);
    }
  }

  async function handleSave(): Promise<void> {
    if (!userMonthId) {
      return;
    }

    const invalidSources = sources.filter((source) => !source.name.trim());

    if (invalidSources.length > 0) {
      sources = sources.map((source) => ({
        ...source,
        hasNameError: !source.name.trim(),
      }));
      return;
    }

    const validSources = sources.filter((source) => source.name.trim());
    const result = await balanceService.saveBalanceSources(
      userMonthId,
      validSources,
    );

    if (result) {
      await invalidateAll();
      closeModal();
    }
  }
</script>

<dialog class="modal" class:modal-open={isOpen} on:click={handleBackdropClick}>
  <div class="modal-box w-11/12 max-w-5xl">
    <form method="dialog">
      <button
        class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        on:click={closeModal}
        type="button"
      >
        ✕
      </button>
    </form>

    <h3 class="font-bold text-lg mb-4">
      Баланс на начало {monthName.toLowerCase()}
      {year} — {formatAmount(totalBalance, baseCurrency)}
    </h3>

    {#if isLoading}
      <div class="flex justify-center items-center py-8">
        <span class="loading loading-spinner loading-lg"></span>
      </div>
    {:else}
      <div class="overflow-x-auto max-h-[calc(100vh-16rem)]">
        <table
          class="table table-xs table-pin-rows w-full [&_tr]:border-0 [&_td]:align-top"
        >
          <thead>
            <tr>
              <th class="w-auto">Источник</th>
              <th class="w-48">Валюта</th>
              <th class="w-44">Сумма</th>
              <th class="w-32">Курс к {baseCurrency}</th>
              <th class="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {#each sources as source, index (source.id)}
              <BalanceSourceRow
                {exchangeRates}
                onDelete={() => deleteSource(index)}
                onUpdate={(updatedSource) => updateSource(index, updatedSource)}
                {source}
              />
            {/each}
          </tbody>
        </table>
      </div>

      <div class="flex justify-between items-center mt-6">
        <button class="btn btn-primary" on:click={addNewSource} type="button">
          <svg class="w-4 h-4 mr-2" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 4v16m8-8H4"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
          Добавить источник
        </button>

        <div class="flex gap-2">
          <button class="btn btn-ghost" on:click={closeModal} type="button">
            Отменить
          </button>
          <button
            class="btn btn-success"
            class:loading={isSaving}
            disabled={isSaving}
            on:click={handleSave}
            type="button"
          >
            {isSaving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>
    {/if}
  </div>
</dialog>
