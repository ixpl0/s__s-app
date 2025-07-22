<script lang="ts">
  import MonthItem from './MonthItem.svelte';
  import type { MonthData } from '$lib/types/budget';

  export let year: number;
  export let months: MonthData[];
  export let monthNames: string[];
</script>

<li>
  <hr />
  <div class="timeline-start">
    <h2 class="text-xl font-bold">{year}</h2>
  </div>
  <div class="timeline-middle">
    <svg class="h-5 w-5" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path
        clip-rule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
        fill="currentColor"
        fill-rule="evenodd"
      />
    </svg>
  </div>
  <hr />
</li>

{#each months as monthData (monthData.year + monthData.month)}
  <MonthItem {monthData} {monthNames} />
{/each}

