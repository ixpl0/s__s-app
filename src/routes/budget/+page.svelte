<script lang="ts">
  import YearSection from '$lib/components/budget/YearSection.svelte';
  import type { MonthData } from '$lib/types/budget';
  import type { PageData } from './$types';
  import { userMonthService } from '$lib/services/user-month-service';
  import { invalidateAll, goto } from '$app/navigation';

  export let data: PageData;

  const monthNames = [
    'январь',
    'февраль',
    'март',
    'апрель',
    'май',
    'июнь',
    'июль',
    'август',
    'сентябрь',
    'октябрь',
    'ноябрь',
    'декабрь',
  ];

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  let isCreatingCurrentMonth = false;

  $: groupedData = data.monthsData.reduce(
    (acc, month) => {
      if (!acc[month.year]) {
        acc[month.year] = [];
      }

      acc[month.year].push(month);

      return acc;
    },
    {} as Record<number, MonthData[]>,
  );

  $: years = Object.keys(groupedData)
    .map(Number)
    .sort((a, b) => b - a);

  async function createCurrentMonth(): Promise<void> {
    isCreatingCurrentMonth = true;

    try {
      const result = await userMonthService.createUserMonth({
        year: currentYear,
        month: currentMonth,
      });

      if (
        result?.userMonth &&
        Array.isArray(result.userMonth) &&
        result.userMonth.length > 0
      ) {
        await invalidateAll();
        await goto('/budget', { invalidateAll: true });
      }
    } catch (error) {
      console.error('Error creating current month:', error);
    } finally {
      isCreatingCurrentMonth = false;
    }
  }
</script>

<div class="min-h-screen bg-base-100">
  {#if data.monthsData.length === 0}
    <div class="text-center py-12">
      <div class="text-6xl mb-4">💰</div>
      <h2 class="text-2xl font-bold mb-2">Пока нет данных о бюджете</h2>
      <p class="text-lg opacity-70 mb-6">
        Начните с создания месяца и добавления источников баланса
      </p>
      <button
        class="btn btn-primary btn-lg"
        disabled={isCreatingCurrentMonth}
        on:click={createCurrentMonth}
      >
        {#if isCreatingCurrentMonth}
          <span class="loading loading-spinner loading-sm"></span>
          Создание месяца...
        {:else}
          📅 Создать {monthNames[currentMonth]} {currentYear}
        {/if}
      </button>
    </div>
  {:else}
    <ul class="timeline timeline-vertical [--timeline-col-start:15ch]">
      {#each years as year (year)}
        <YearSection
          exchangeRates={data.exchangeRates}
          {monthNames}
          months={groupedData[year]}
          {year}
        />
      {/each}
    </ul>
  {/if}
</div>
