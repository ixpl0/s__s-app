<script lang="ts">
  import type { BalanceSource, Currency } from '$lib/types/balance';
  import { currencyOptions } from '$lib/data/balance';

  export let source: BalanceSource;
  export let onUpdate: (updatedSource: BalanceSource) => void;
  export let onDelete: () => void;

  function handleNameChange(event: Event): void {
    const target = event.target as HTMLInputElement;

    onUpdate({
      ...source,
      name: target.value,
    });
  }

  function handleCurrencyChange(event: Event): void {
    const target = event.target as HTMLSelectElement;

    onUpdate({
      ...source,
      currency: target.value as Currency,
    });
  }

  function handleAmountChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const amount = parseFloat(target.value) || 0;

    onUpdate({
      ...source,
      amount,
    });
  }
</script>

<div class="flex items-end gap-3 p-3 bg-base-200 rounded-lg">
  <div class="flex-1">
    <label class="form-control w-full">
      <span class="label">
        <span class="label-text">Наименование источника</span>
      </span>
      <input
        bind:value={source.name}
        class="input input-bordered w-full"
        on:input={handleNameChange}
        placeholder="Например: Наличка, Банк TBC"
        type="text"
      />
    </label>
  </div>

  <div class="w-48">
    <label class="form-control w-full">
      <span class="label">
        <span class="label-text">Валюта</span>
      </span>
      <select
        bind:value={source.currency}
        class="select select-bordered"
        on:change={handleCurrencyChange}
      >
        {#each currencyOptions as option (option.value)}
          <option value={option.value}>
            {option.symbol} {option.label}
          </option>
        {/each}
      </select>
    </label>
  </div>

  <div class="w-32">
    <label class="form-control w-full">
      <span class="label">
        <span class="label-text">Сумма</span>
      </span>
      <input
        bind:value={source.amount}
        class="input input-bordered w-full"
        min="0"
        on:input={handleAmountChange}
        step="0.01"
        type="number"
      />
    </label>
  </div>

  <div>
    <button
      aria-label="Удалить источник"
      class="btn btn-ghost btn-square hover:bg-error hover:text-error-content"
      on:click={onDelete}
      type="button"
    >
      <svg
        class="w-4 h-4"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M6 18L18 6M6 6l12 12"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        />
      </svg>
    </button>
  </div>
</div>
