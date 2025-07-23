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

  function getCurrencySymbol(currencyCode: Currency): string {
    const currency = currencyOptions.find((option) => option.value === currencyCode);

    return currency?.symbol || '';
  }
</script>

<tr>
  <td class="w-auto">
    <input
      bind:value={source.name}
      class="input input-bordered w-full"
      on:input={handleNameChange}
      placeholder="Наличка, Банк TBC"
      type="text"
    />
  </td>
  <td class="w-56">
    <select
      bind:value={source.currency}
      class="select select-bordered w-full"
      on:change={handleCurrencyChange}
    >
      {#each currencyOptions as option (option.value)}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  </td>
  <td class="w-48">
    <div class="join w-full">
      <input
        bind:value={source.amount}
        class="join-item input input-bordered flex-1"
        min="0"
        on:input={handleAmountChange}
        placeholder="0"
        step="0.01"
        type="number"
      />
      <span class="join-item flex items-center justify-center text-sm font-medium w-10 bg-base-200">
        {getCurrencySymbol(source.currency)}
      </span>
    </div>
  </td>
  <td class="w-fit text-center">
    <button
      class="btn btn-ghost btn-xs hover:bg-error hover:text-error-content"
      on:click={onDelete}
      type="button"
    >
      ✕
    </button>
  </td>
</tr>
