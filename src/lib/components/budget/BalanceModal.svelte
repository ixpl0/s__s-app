<script lang="ts">
  import type { BalanceSource } from '$lib/types/balance';
  import BalanceSourceRow from './BalanceSourceRow.svelte';
  import { invalidateAll } from '$app/navigation';
  import { toast } from '$lib/stores/toasts';
  import { balanceService } from '$lib/services/balance-service';

  export let isOpen = false;
  export let monthName = '';
  export let year = 0;
  export let month = 0;
  export let userMonthId: string;
  export let exchangeRates: Record<string, number> | string = {};

  let sources: BalanceSource[] = [];
  let isLoading = false;
  let isSaving = false;

  $: parsedExchangeRates = (() => {
    if (typeof exchangeRates === 'string') {
      try {
        return JSON.parse(exchangeRates) as Record<string, number>;
      } catch {
        return {};
      }
    }

    return exchangeRates as Record<string, number>;
  })();

  $: if (isOpen && userMonthId) {
    loadBalanceSources();
  }

  async function loadBalanceSources(): Promise<void> {
    if (!userMonthId) {
      return;
    }

    isLoading = true;

    try {
      const response = await balanceService.getBalanceSources(userMonthId);

      if (response.success && response.data) {
        sources = response.data.balanceSources;
      } else {
        sources = [];
      }
    } catch {
      sources = [];
    } finally {
      isLoading = false;
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
    return Math.random().toString(36).substring(2, 9);
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

    if (response.success) {
      sources = sources.filter((_, i) => i !== index);
    }
  }

  async function handleSave(): Promise<void> {
    if (!userMonthId) {
      toast.error('Ошибка: не удалось определить месяц для сохранения');

      return;
    }

    const invalidSources = sources.filter((source) => !source.name.trim());

    if (invalidSources.length > 0) {
      sources = sources.map((source) => ({
        ...source,
        hasNameError: !source.name.trim(),
      }));

      toast.warning('Пожалуйста, заполните названия всех источников');

      return;
    }

    isSaving = true;

    try {
      const validSources = sources.filter((source) => source.name.trim());

      const promises = validSources.map(async (source) => {
        if (source.userMonthId) {
          return balanceService.updateBalanceSource(source.id, {
            name: source.name,
            currency: source.currency,
            amount: source.amount,
          });
        } else {
          return balanceService.createBalanceSource({
            userMonthId,
            name: source.name,
            currency: source.currency,
            amount: source.amount,
          });
        }
      });

      const results = await Promise.all(promises);
      const hasErrors = results.some((result) => !result.success);

      if (hasErrors) {
        throw new Error('Некоторые источники не удалось сохранить');
      }

      await invalidateAll();
      toast.success('Данные успешно сохранены');
      closeModal();
    } catch (error) {
      toast.error(
        `Ошибка при сохранении данных: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      isSaving = false;
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
      {year}
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
              <th class="w-32">Курс к USD</th>
              <th class="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {#each sources as source, index (source.id)}
              <BalanceSourceRow
                exchangeRates={parsedExchangeRates}
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
