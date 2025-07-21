<script>
  import { goto } from '$app/navigation';
</script>

<div class="hero bg-base-200 min-h-[500px]">
  <div class="hero-content text-center">
    <div class="max-w-md">
      <h1 class="text-5xl font-bold">
        БЮДЖЕТИК
      </h1>
      <p class="py-6">
        здесь можно вести свой семейный бюджет
      </p>
      <button class="btn btn-primary" on:click={() => goto('/budget')}>
        НАЧАТЬ
      </button>
    </div>
  </div>
</div>
