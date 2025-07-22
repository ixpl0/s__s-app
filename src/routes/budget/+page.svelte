<script lang="ts">
  import YearSection from '$lib/components/budget/YearSection.svelte';
  import type { MonthData } from '$lib/types/budget';
  import { monthsData, monthNames } from '$lib/data/budget';

  // TODO: Replace with real data fetching logic
  // eslint-disable-next-line svelte/no-immutable-reactive-statements
  $: groupedData = monthsData.reduce((acc, month) => {
    if (!acc[month.year]) {
      acc[month.year] = [];
    }

    acc[month.year].push(month);

    return acc;
  }, {} as Record<number, MonthData[]>);

  $: years = Object.keys(groupedData)
    .map(Number)
    .sort((a, b) => b - a);
</script>

<div class="min-h-screen bg-base-100">
  <ul class="timeline timeline-vertical [--timeline-col-start:15ch]">
    {#each years as year (year)}
      <YearSection {monthNames} months={groupedData[year]} {year} />
    {/each}
  </ul>
</div>

