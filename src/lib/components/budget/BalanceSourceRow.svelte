<script lang="ts">
  import type { BalanceSource, CurrencyValue } from '$lib/types/balance';
  import { currencyOptions } from '$lib/constants/balance';
  import { balanceSourceSchema } from '$lib/types/api';
  import { z } from 'zod';
  import { page } from '$app/stores';

  type BalanceSourceWithValidation = BalanceSource & {
    hasNameError?: boolean;
    validationError?: string;
  };

  export let source: BalanceSource;
  export let onUpdate: (updatedSource: BalanceSource) => void;
  export let onDelete: () => void;
  export let exchangeRates: Record<string, number> = {};

  $: userSettings = $page.data.userSettings;
  $: baseCurrency = userSettings?.baseCurrency || 'USD';

  $: currentRate = (() => {
    if (source.currency === baseCurrency) {
      return 1;
    }

    if (baseCurrency === 'USD') {
      return exchangeRates[source.currency] || 1;
    }

    if (source.currency === 'USD') {
      return 1 / (exchangeRates[baseCurrency] || 1);
    }

    const sourceToUsd = exchangeRates[source.currency] || 1;
    const baseToUsd = exchangeRates[baseCurrency] || 1;

    return sourceToUsd / baseToUsd;
  })();

  $: formattedRate = currentRate.toFixed(2);
  $: hasNameError =
    (source as BalanceSourceWithValidation).hasNameError || false;
  $: validationError = (source as BalanceSourceWithValidation).validationError;

  $: {
    try {
      balanceSourceSchema.parse(source);
      if (validationError) {
        onUpdate({
          ...source,
          validationError: undefined,
        } as BalanceSource);
      }
    } catch (error) {
      if (error instanceof z.ZodError && error.issues.length > 0) {
        const errorMessage = error.issues[0]?.message;
        if (errorMessage !== validationError) {
          onUpdate({
            ...source,
            validationError: errorMessage,
          } as BalanceSource);
        }
      }
    }
  }

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
    const value = target.value;

    const amount = value === '' ? 0 : parseFloat(value);

    if (!isNaN(amount)) {
      onUpdate({
        ...source,
        amount,
      });
    }
  }
</script>

<tr>
  <td class="py-3">
    <div class="form-control">
      <input
        bind:value={source.name}
        class="input input-bordered input-sm w-full"
        class:input-error={hasNameError ||
          (validationError && validationError.includes('имя'))}
        on:input={handleNameChange}
        placeholder="Название источника"
        type="text"
      />
      {#if hasNameError}
        <div class="label">
          <span class="label-text-alt text-error">Введите имя источника</span>
        </div>
      {/if}
    </div>
  </td>

  <td class="py-3">
    <select
      bind:value={source.currency}
      class="select select-bordered select-sm w-full"
      on:change={handleCurrencyChange}
    >
      {#each currencyOptions as option (option.value)}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  </td>

  <td class="py-3">
    <div class="form-control">
      <input
        bind:value={source.amount}
        class="input input-bordered input-sm w-full"
        class:input-error={validationError &&
          validationError.includes('amount')}
        on:input={handleAmountChange}
        placeholder="0.00"
        step="0.01"
        type="number"
      />
      {#if validationError && validationError.includes('amount')}
        <div class="label">
          <span class="label-text-alt text-error">{validationError}</span>
        </div>
      {/if}
    </div>
  </td>

  <td class="py-3">
    <input
      class="input input-bordered input-sm w-full bg-base-200"
      disabled
      readonly
      value={formattedRate}
    />
  </td>

  <td class="py-3">
    <div class="mt-2">
      <button
        class="btn btn-error btn-xs"
        on:click={onDelete}
        title="Удалить источник"
        type="button"
      >
        ✕
      </button>
    </div>
  </td>
</tr>
