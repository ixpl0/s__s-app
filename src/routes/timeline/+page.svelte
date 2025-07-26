<script lang="ts">
  import YearSection from '$lib/components/budget/YearSection.svelte';
  import type { MonthData } from '$lib/types/budget';
  import type { PageData } from './$types';
  import { testDataService } from '$lib/services/test-data-service';

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

  $: yearGroups = data.monthsData.reduce((groups: Record<number, MonthData[]>, monthData) => {
    if (!groups[monthData.year]) {
      groups[monthData.year] = [];
    }

    groups[monthData.year].push(monthData);

    return groups;
  }, {});

  $: sortedYears = Object.keys(yearGroups)
    .map(Number)
    .sort((a, b) => b - a);

  $: {
    Object.values(yearGroups).forEach((months) => {
      months.sort((a, b) => b.month - a.month);
    });
  }

  let isCreatingTestData = false;

  async function createTestData(): Promise<void> {
    isCreatingTestData = true;

    const response = await testDataService.createTestData();

    if (response.success) {
      window.location.reload();
    }

    isCreatingTestData = false;
  }
</script>

<svelte:head>
  <title>Таймлайн бюджета</title>
</svelte:head>

<div class="min-h-screen bg-base-100 py-8">
  <div class="container mx-auto px-4">
    <div class="mb-8 text-center">
      <h1 class="text-4xl font-bold mb-2">📊 Таймлайн бюджета</h1>
      <p class="text-lg opacity-70">
        Добро пожаловать, {data.user.username}! Здесь вы можете отслеживать свои финансы по месяцам.
      </p>
    </div>

    {#if data.monthsData.length === 0}
      <div class="text-center py-12">
        <div class="text-6xl mb-4">💰</div>
        <h2 class="text-2xl font-bold mb-2">Пока нет данных</h2>
        <p class="text-lg opacity-70 mb-6">
          Начните добавлять источники баланса, чтобы отслеживать свои финансы
        </p>
        <div class="flex gap-4 justify-center">
          <button
            class="btn btn-primary"
            disabled={isCreatingTestData}
            on:click={createTestData}
          >
            {#if isCreatingTestData}
              <span class="loading loading-spinner loading-sm"></span>
              Создание тестовых да��ных...
            {:else}
              🎲 Создать тестовые данные
            {/if}
          </button>
          <a class="btn btn-ghost" href="/timeline">
            🔄 Обновить страницу
          </a>
        </div>
      </div>
    {:else}
      <div class="max-w-4xl mx-auto">
        <ul class="timeline timeline-vertical">
          {#each sortedYears as year (year)}
            <YearSection
              exchangeRates={data.exchangeRates}
              {monthNames}
              months={yearGroups[year]}
              {year}
            />
          {/each}
        </ul>
      </div>
    {/if}
  </div>
</div>
