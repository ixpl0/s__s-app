<script lang="ts">
  import type { BalanceSource } from '$lib/types/balance';
  import { mockBalanceSources } from '$lib/data/balance';
  import BalanceSourceRow from './BalanceSourceRow.svelte';

  export let isOpen = false;
  export let monthName = '';
  export let year = 0;

  let sources: BalanceSource[] = [...mockBalanceSources];

  function closeModal(): void {
    isOpen = false;
  }

  function handleBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }

  function generateId(): string {
    return Math.random()
      .toString(36)
      .substring(2, 9);
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
    sources = sources.map((source, i) => (i === index ? updatedSource : source));
  }

  function deleteSource(index: number): void {
    sources = sources.filter((_, i) => i !== index);
  }

  function handleSave(): void {
    // TODO: add actual save logic
    closeModal();
  }
</script>

<dialog class="modal" class:modal-open={isOpen} on:click={handleBackdropClick}>
  <div class="modal-box w-11/12 max-w-5xl my-16 max-h-[calc(100vh-8rem)] h-auto">
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
      Баланс на начало {monthName.toLowerCase()} {year}
    </h3>

    <div class="space-y-4">
      {#each sources as source, index (source.id)}
        <BalanceSourceRow
          onDelete={() => deleteSource(index)}
          onUpdate={(updatedSource) => updateSource(index, updatedSource)}
          {source}
        />
      {/each}
    </div>

    <div class="flex justify-between items-center mt-6">
      <button class="btn btn-primary" on:click={addNewSource} type="button">
        <svg
          class="w-4 h-4 mr-2"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
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
        <button class="btn btn-success" on:click={handleSave} type="button">
          Сохранить
        </button>
      </div>
    </div>
  </div>
</dialog>
