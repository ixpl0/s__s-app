<script lang="ts">
  import type { BalanceSource, CurrencyValue } from '$lib/types/balance';
  import { currencyOptions } from '$lib/constants/balance';
  import { getCurrencySymbol } from '$lib/utils/currency';

  type BalanceSourceWithValidation = BalanceSource & {
    hasNameError?: boolean;
  };

  export let source: BalanceSource;
  export let onUpdate: (updatedSource: BalanceSource) => void;
  export let onDelete: () => void;
  export let exchangeRates: Record<string, number> = {};

  $: currentRate = exchangeRates[source.currency] || 1;
  $: formattedRate = source.currency === 'USD' ? '1.00' : currentRate.toFixed(2);
  $: hasNameError = (source as BalanceSourceWithValidation).hasNameError || false;

  function handleNameChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    onUpdate({
      ...source,
      name: value,
      hasNameError: undefined,
    } as BalanceSource);
  }

  function handleCurrencyChange(event: Event): void {
    const target = event.target as HTMLSelectElement;

    onUpdate({
      ...source,
      currency: target.value as CurrencyValue,
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

<tr>
  <td>
    <div class="form-control w-full">
      <input
        bind:value={source.name}
        class="input input-bordered w-full"
        class:input-error={hasNameError}
        on:input={handleNameChange}
        placeholder="Наличка, Банк TBC"
        type="text"
      />
      {#if hasNameError}
        <div class="label">
          <span class="label-text-alt text-error">Введите имя источника</span>
        </div>
      {/if}
    </div>
  </td>

  <td>
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

  <td>
    <div class="join w-full">
      <input
        bind:value={source.amount}
        class="join-item input input-bordered flex-1"
        on:blur={handleAmountChange}
        placeholder="0"
        step="1"
        type="number"
      />
      <span class="join-item flex items-center justify-center text-sm font-medium w-10 bg-base-200">
        {getCurrencySymbol(source.currency)}
      </span>
    </div>
  </td>

  <td>
    <input
      class="input input-bordered w-full"
      disabled
      placeholder="1.00"
      type="text"
      value={formattedRate}
    />
  </td>

  <td class="text-center">
    <button
      class="btn btn-ghost btn-xs hover:bg-error hover:text-error-content mt-2"
      on:click={onDelete}
      type="button"
    >
      ✕
    </button>
  </td>
</tr>
